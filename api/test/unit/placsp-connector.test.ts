import assert from 'node:assert/strict';
import { test } from 'node:test';
import { placspConnector, RawPlacspEntry } from '../../src/modules/procurement/connectors/placsp.connector.js';
import { PlacspTenderInputSchema, TenderQueryFilterSchema } from '../../src/modules/procurement/procurement.schema.js';

const SAMPLE_RAW_ENTRY: RawPlacspEntry = {
  id: 'EXP-UNIT-001',
  title: 'Licitación de desarrollo de software para el portal tributario',
  summary: 'Plataforma en TypeScript y arquitecturas limpias',
  status: 'PUBLISHED',
  procedureType: 'OPEN',
  contractType: 'SERVICES',
  budgetAmountEur: 125000.5,
  taxInclusiveAmountEur: 151250.605,
  estimatedValueEur: 250000.0,
  cpvCode: '72262000',
  additionalCpvCodes: ['72260000-0', '72000000'],
  submissionDeadline: '2026-10-15T12:00:00.000Z',
  authority: {
    name: 'Dirección General de Informática',
    taxId: 'Q2800001A',
    sourceAuthorityId: 'DIR3-INF-01',
    buyerType: 'central',
    postalCode: '28001',
    city: 'Madrid',
  },
  lots: [
    {
      lotNumber: 1,
      title: 'Lote 1: Aplicación web',
      budgetAmountEur: 60000.0,
      cpvCode: '72262000',
    },
    {
      lotNumber: 2,
      title: 'Lote 2: API backend y microservicios',
      budgetAmountEur: 65000.5,
      cpvCode: '72262000',
    },
  ],
  documents: [
    {
      type: 'PCAP',
      name: 'Pliego Administrativo',
      url: 'https://contrataciondelestado.es/pcap_001.pdf',
      contentHash: '1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
      mimeType: 'application/pdf',
    },
  ],
};

test('PlacspConnector normaliza importes a céntimos enteros exactos y CPVs a 8 dígitos', () => {
  const normalized = placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY);

  assert.equal(normalized.sourceTenderId, 'EXP-UNIT-001');
  assert.equal(normalized.sourceCode, 'ES_PLACSP');
  // 125000.50 EUR = 12500050 céntimos enteros
  assert.equal(normalized.budgetAmountCents, 12500050);
  assert.equal(normalized.taxInclusiveAmountCents, 15125061);
  assert.equal(normalized.estimatedValueCents, 25000000);
  assert.equal(normalized.mainCpvCode, '72262000');
  assert.deepEqual(normalized.additionalCpvCodes, ['72260000', '72000000']);
  assert.equal(normalized.status, 'PUBLISHED');
  assert.equal(normalized.procedureType, 'OPEN');
  assert.equal(normalized.contractType, 'SERVICES');

  // Lotes normalizados a céntimos
  assert.equal(normalized.lots.length, 2);
  assert.equal(normalized.lots[0].budgetAmountCents, 6000000);
  assert.equal(normalized.lots[1].budgetAmountCents, 6500050);

  // Documentos
  assert.equal(normalized.documents.length, 1);
  assert.equal(normalized.documents[0].documentType, 'PCAP');
});

test('computePayloadHash es determinista y sensible a modificaciones de pliegos y presupuesto', () => {
  const normalized1 = placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY);
  const hash1 = placspConnector.computePayloadHash(normalized1);

  // Mismo expediente -> mismo hash exactamente
  const hash1Repeat = placspConnector.computePayloadHash(normalized1);
  assert.equal(hash1, hash1Repeat);

  // Modificación del importe presupuestario -> hash debe cambiar
  const modifiedBudget = {
    ...normalized1,
    budgetAmountCents: normalized1.budgetAmountCents + 1000,
  };
  const hashModifiedBudget = placspConnector.computePayloadHash(modifiedBudget);
  assert.notEqual(hash1, hashModifiedBudget);

  // Modificación en pliegos (enmienda de documento) -> hash debe cambiar
  const modifiedDocument = {
    ...normalized1,
    documents: [
      {
        ...normalized1.documents[0],
        url: 'https://contrataciondelestado.es/pcap_001_enmienda.pdf',
        contentHash: '9999888877776666555544443333222211110000aaaabbbbccccddddeeeeffff',
      },
    ],
  };
  const hashModifiedDoc = placspConnector.computePayloadHash(modifiedDocument);
  assert.notEqual(hash1, hashModifiedDoc);
});

test('Anti-Mass Assignment: Esquema Zod descarta y rechaza campos no autorizados (.strict())', () => {
  const maliciousPayload = {
    ...placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY),
    is_admin: true, // Intento de inyección de privilegio
    tenant_id: '99999999-9999-4999-8999-999999999999', // Intento de inyección de tenant
  };

  const parsed = PlacspTenderInputSchema.safeParse(maliciousPayload);
  assert.equal(parsed.success, false);
});

test('TenderQueryFilterSchema valida filtros deterministas y rechaza parámetros inesperados', () => {
  const validQuery = {
    cpv: '72262000',
    status: 'PUBLISHED',
    minBudget: '500000',
    maxBudget: '2000000',
    page: '2',
    limit: '15',
  };

  const parsed = TenderQueryFilterSchema.safeParse(validQuery);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.cpv, '72262000');
    assert.equal(parsed.data.status, 'PUBLISHED');
    assert.equal(parsed.data.minBudget, 500000);
    assert.equal(parsed.data.maxBudget, 2000000);
    assert.equal(parsed.data.page, 2);
    assert.equal(parsed.data.limit, 15);
  }

  // Rechazo de filtros maliciosos o no tipados
  const invalidQuery = {
    ...validQuery,
    sql_injection: "1 OR 1=1",
  };
  const parsedInvalid = TenderQueryFilterSchema.safeParse(invalidQuery);
  assert.equal(parsedInvalid.success, false);
});
