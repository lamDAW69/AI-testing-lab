import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import pg from 'pg';
import type { RawPlacspEntry } from '../../src/modules/procurement/connectors/placsp.connector.js';

const { Pool } = pg;

const RUNTIME_PASSWORD = 'test_runtime_password';
const adminDatabaseUrl = process.env.TEST_ADMIN_DATABASE_URL ?? process.env.DATABASE_URL;
const runtimeDatabaseUrl = process.env.TEST_RUNTIME_DATABASE_URL;

if (!adminDatabaseUrl || !runtimeDatabaseUrl) {
  throw new Error(
    'Las pruebas de contratación pública requieren TEST_ADMIN_DATABASE_URL y TEST_RUNTIME_DATABASE_URL.',
  );
}

process.env.DATABASE_URL = runtimeDatabaseUrl;
process.env.NODE_ENV = 'test';
process.env.SUPABASE_PROJECT_URL = 'https://mock-project.supabase.co';
process.env.INGEST_SECRET = 'super_secret_test_token_12345';

const adminPool = new Pool({ connectionString: adminDatabaseUrl });
const runtimePool = new Pool({ connectionString: runtimeDatabaseUrl });

/**
 * No se cargan módulos de la API al evaluar este archivo: config/env valida
 * DATABASE_URL durante el import y las variables de test se fijan arriba.
 */
async function loadProcurementModules() {
  const [serviceModule, connectorModule, appModule] = await Promise.all([
    import('../../src/modules/procurement/procurement.service.js'),
    import('../../src/modules/procurement/connectors/placsp.connector.js'),
    import('../../src/app.js'),
  ]);
  return {
    procurementService: serviceModule.procurementService,
    placspConnector: connectorModule.placspConnector,
    createApp: appModule.createApp,
  };
}

const TEST_ENTRY_1: RawPlacspEntry = {
  id: 'EXP-TEST-2026-001',
  title: 'Desarrollo de plataforma cloud para contratación pública',
  summary: 'Plataforma en TypeScript y PostgreSQL.',
  status: 'PUBLISHED',
  procedureType: 'OPEN',
  contractType: 'SERVICES',
  budgetAmountEur: 120000.0,
  taxInclusiveAmountEur: 145200.0,
  cpvCode: '72262000',
  additionalCpvCodes: ['72000000'],
  submissionDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  authority: {
    name: 'Diputación Foral de Prueba',
    taxId: 'P0100000A',
    sourceAuthorityId: 'DIP-01',
    buyerType: 'local',
    postalCode: '01001',
    city: 'Vitoria-Gasteiz',
  },
  lots: [
    {
      lotNumber: 1,
      title: 'Lote 1: Core de la plataforma',
      budgetAmountEur: 120000.0,
      cpvCode: '72262000',
    },
  ],
  documents: [
    {
      type: 'PCAP',
      name: 'Pliego Administrativo',
      url: 'https://ejemplo.gob.es/pcap_v1.pdf',
      contentHash: 'aaaa1111222233334444555566667777888899990000aaaabbbbccccddddeeee',
      mimeType: 'application/pdf',
    },
  ],
};

const TEST_ENTRY_2: RawPlacspEntry = {
  id: 'EXP-TEST-2026-002',
  title: 'Suministro de equipamiento de red',
  summary: 'Routers y switches para dependencias municipales.',
  status: 'PUBLISHED',
  procedureType: 'SIMPLIFIED_OPEN',
  contractType: 'SUPPLIES',
  budgetAmountEur: 30000.0,
  cpvCode: '32420000',
  authority: {
    name: 'Ayuntamiento de Prueba',
    taxId: 'P2800000B',
    buyerType: 'local',
  },
};

before(async () => {
  await adminPool.query(`ALTER ROLE app_runtime LOGIN PASSWORD '${RUNTIME_PASSWORD}'`);
  await adminPool.query(
    'TRUNCATE TABLE tender_events, tender_document_versions, tender_documents, tender_lots, tenders, contracting_authorities, procurement_sources CASCADE',
  );
});

after(async () => {
  await runtimePool.end();
  await adminPool.end();
});

test('Ingesta inicial e idempotencia estricta (no duplicación)', async () => {
  const { placspConnector, procurementService } = await loadProcurementModules();
  const normalized1 = placspConnector.normalizeEntry(TEST_ENTRY_1);
  const normalized2 = placspConnector.normalizeEntry(TEST_ENTRY_2);

  // 1. Primera pasada: debe insertar ambos expedientes
  const firstBatch = await procurementService.ingestBatch([normalized1, normalized2]);
  assert.equal(firstBatch.total, 2);
  assert.equal(firstBatch.inserted, 2);
  assert.equal(firstBatch.updated, 0);
  assert.equal(firstBatch.skipped, 0);

  const countRowsFirst = await runtimePool.query('SELECT count(*)::int AS total FROM tenders');
  assert.equal(countRowsFirst.rows[0].total, 2);

  // 2. Segunda pasada con exactamente los mismos datos: debe omitir ambos (SKIPPED)
  const secondBatch = await procurementService.ingestBatch([normalized1, normalized2]);
  assert.equal(secondBatch.total, 2);
  assert.equal(secondBatch.inserted, 0);
  assert.equal(secondBatch.updated, 0);
  assert.equal(secondBatch.skipped, 2);

  // El conteo en base de datos debe permanecer exactamente en 2 (Cero duplicados)
  const countRowsSecond = await runtimePool.query('SELECT count(*)::int AS total FROM tenders');
  assert.equal(countRowsSecond.rows[0].total, 2);
});

test('Detección de enmienda y versionado inmutable de pliegos sin sobrescritura', async () => {
  const { placspConnector, procurementService } = await loadProcurementModules();
  // Simulamos que el órgano convocante publica una actualización del pliego administrativo con nuevo contenido
  const modifiedEntry: RawPlacspEntry = {
    ...TEST_ENTRY_1,
    summary: 'Plataforma en TypeScript y PostgreSQL - Enmienda 1 con aclaraciones.',
    documents: [
      {
        type: 'PCAP',
        name: 'Pliego Administrativo',
        url: 'https://ejemplo.gob.es/pcap_v2_aclaraciones.pdf',
        contentHash: 'bbbb222233334444555566667777888899990000aaaabbbbccccddddeeeeffff', // Nuevo hash
        mimeType: 'application/pdf',
      },
    ],
  };

  const normalizedMod = placspConnector.normalizeEntry(modifiedEntry);
  const updateBatch = await procurementService.ingestBatch([normalizedMod]);

  assert.equal(updateBatch.total, 1);
  assert.equal(updateBatch.updated, 1);
  assert.equal(updateBatch.inserted, 0);
  assert.equal(updateBatch.skipped, 0);

  // Verificamos que se han conservado AMBAS versiones del documento (Inmutabilidad documental)
  const docVersions = await runtimePool.query(
    `SELECT v.version_number, v.url, v.content_hash
     FROM tender_document_versions v
     JOIN tender_documents d ON v.document_id = d.id
     JOIN tenders t ON d.tender_id = t.id
     WHERE t.source_tender_id = $1
     ORDER BY v.version_number ASC`,
    [TEST_ENTRY_1.id],
  );

  assert.equal(docVersions.rowCount, 2);
  assert.equal(docVersions.rows[0].version_number, 1);
  assert.equal(docVersions.rows[0].url, 'https://ejemplo.gob.es/pcap_v1.pdf');
  assert.equal(docVersions.rows[1].version_number, 2);
  assert.equal(docVersions.rows[1].url, 'https://ejemplo.gob.es/pcap_v2_aclaraciones.pdf');

  // Verificamos que se registró el evento histórico AMENDMENT
  const events = await runtimePool.query(
    `SELECT event_type FROM tender_events e
     JOIN tenders t ON e.tender_id = t.id
     WHERE t.source_tender_id = $1 AND e.event_type = 'AMENDMENT'`,
    [TEST_ENTRY_1.id],
  );
  assert.equal(events.rowCount, 1);
});

test('Catálogo con filtros deterministas por CPV, importes y detalle de expediente', async () => {
  const { procurementService } = await loadProcurementModules();
  // Filtro por prefijo de software TIC (CPV 72)
  const ticTenders = await procurementService.listTenders({
    cpv: '72',
    page: 1,
    limit: 10,
  });
  assert.equal(ticTenders.pagination.total, 1);
  assert.equal(ticTenders.data[0].sourceTenderId, TEST_ENTRY_1.id);

  // Filtro por presupuesto mínimo (mayor a 50.000€ = 5.000.000 céntimos)
  const highBudget = await procurementService.listTenders({
    minBudget: 5000000,
    page: 1,
    limit: 10,
  });
  assert.equal(highBudget.pagination.total, 1);
  assert.equal(highBudget.data[0].sourceTenderId, TEST_ENTRY_1.id);

  // Detalle completo con lotes, documentos y versiones
  const fullDetail = await procurementService.getTenderById(ticTenders.data[0].id);
  assert.ok(fullDetail);
  assert.equal(fullDetail.authority.name, 'Diputación Foral de Prueba');
  assert.equal(fullDetail.lots.length, 1);
  assert.equal(fullDetail.documents.length, 1);
  assert.equal(fullDetail.documents[0].versions.length, 2); // Ambas versiones presentes
});

test('Endpoints HTTP: consulta pública y seguridad en job de ingesta', async () => {
  const { createApp } = await loadProcurementModules();
  const app = createApp();
  const server = app.listen(0);
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Catálogo público accesible sin token
    const publicRes = await fetch(`${baseUrl}/api/public/tenders?limit=5`);
    assert.equal(publicRes.status, 200);
    const publicJson = await publicRes.json();
    assert.ok(Array.isArray(publicJson.data));
    assert.equal(publicJson.pagination.total, 2);

    // 2. Intento de ingesta sin cabecera X-Ingest-Secret: 401 Unauthorized
    const unauthIngest = await fetch(`${baseUrl}/api/public/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenders: [] }),
    });
    assert.equal(unauthIngest.status, 401);

    // 3. Intento de ingesta con secreto erróneo: 403 Forbidden
    const forbiddenIngest = await fetch(`${baseUrl}/api/public/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ingest-Secret': 'secreto_invalido_hacker',
      },
      body: JSON.stringify({ tenders: [] }),
    });
    assert.equal(forbiddenIngest.status, 403);

    // El job que descarga documentos tampoco se expone como un proxy público.
    const unauthDocumentFetch = await fetch(
      `${baseUrl}/api/internal/documents/versions/88888888-8888-4888-8888-888888888888/fetch`,
      { method: 'POST' },
    );
    assert.equal(unauthDocumentFetch.status, 401);
  } finally {
    server.close();
  }
});
