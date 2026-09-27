import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import pg from 'pg';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

const TENANT_A = '11111111-1111-4111-8111-111111111111';
const TENANT_B = '22222222-2222-4222-8222-222222222222';
const USER_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const USER_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const PRODUCT_A = '33333333-3333-4333-8333-333333333333';
const SOURCE_A = '44444444-4444-4444-8444-444444444444';
const AUTHORITY_A = '55555555-5555-4555-8555-555555555555';
const TENDER_A = '66666666-6666-4666-8666-666666666666';
const DOCUMENT_A = '77777777-7777-4777-8777-777777777777';
const DOCUMENT_VERSION_A = '88888888-8888-4888-8888-888888888888';
const EXTRACTION_A = '99999999-9999-4999-8999-999999999999';
const REQUIREMENT_A = 'aaaaaaaa-1111-4111-8111-111111111111';
const RUNTIME_PASSWORD = 'test_runtime_password';

const adminDatabaseUrl = process.env.TEST_ADMIN_DATABASE_URL ?? process.env.DATABASE_URL;
const runtimeDatabaseUrl = process.env.TEST_RUNTIME_DATABASE_URL;

if (!adminDatabaseUrl || !runtimeDatabaseUrl) {
  throw new Error(
    'Las pruebas de aislamiento requieren TEST_ADMIN_DATABASE_URL y TEST_RUNTIME_DATABASE_URL.',
  );
}

// El cliente de la aplicación debe utilizar la cuenta sin privilegios elevados,
// igual que en producción. Se define antes de cargar el módulo de base de datos.
process.env.DATABASE_URL = runtimeDatabaseUrl;
process.env.NODE_ENV = 'test';
process.env.SUPABASE_PROJECT_URL = 'https://mock-project.supabase.co';

const adminPool = new Pool({ connectionString: adminDatabaseUrl });
const runtimePool = new Pool({ connectionString: runtimeDatabaseUrl });

let closeApplicationPool: (() => Promise<void>) | undefined;

before(async () => {
  await adminPool.query(`ALTER ROLE app_runtime LOGIN PASSWORD '${RUNTIME_PASSWORD}'`);
  await adminPool.query(
    'TRUNCATE TABLE agent_execution_events, audit_events, company_certifications, company_profiles, products, tenant_memberships, tenants CASCADE',
  );

  await adminPool.query(
    `INSERT INTO tenants (id, name, slug)
     VALUES ($1, 'Tenant A', 'tenant-a-test'), ($2, 'Tenant B', 'tenant-b-test')`,
    [TENANT_A, TENANT_B],
  );
  await adminPool.query(
    `INSERT INTO tenant_memberships (tenant_id, user_id, role)
     VALUES ($1, $2, 'owner'), ($3, $4, 'owner')`,
    [TENANT_A, USER_A, TENANT_B, USER_B],
  );
  await adminPool.query(
    `INSERT INTO products (id, tenant_id, name, price_cents, sku)
     VALUES ($1, $2, 'Producto privado A', 1000, 'PRIVATE-A')`,
    [PRODUCT_A, TENANT_A],
  );
  await adminPool.query(
    `INSERT INTO company_profiles (tenant_id, legal_name, cpv_codes, territories)
     VALUES ($1, 'Empresa privada A', ARRAY['72262000'], ARRAY['ES'])`,
    [TENANT_A],
  );
  await adminPool.query(
    `INSERT INTO procurement_sources (id, code, name, base_url)
     VALUES ($1, 'TEST_REQUIREMENTS', 'Fuente de test', 'https://example.test')
     ON CONFLICT (code) DO NOTHING`,
    [SOURCE_A],
  );
  await adminPool.query(
    `INSERT INTO contracting_authorities (id, source_id, name)
     VALUES ($1, $2, 'Órgano de test') ON CONFLICT (id) DO NOTHING`,
    [AUTHORITY_A, SOURCE_A],
  );
  await adminPool.query(
    `INSERT INTO tenders (id, source_id, authority_id, source_tender_id, title, budget_amount_cents, main_cpv_code, raw_payload_hash)
     VALUES ($1, $2, $3, 'REQ-TEST-1', 'Expediente para aislamiento', 100000, '72000000', repeat('a', 64))
     ON CONFLICT (id) DO NOTHING`,
    [TENDER_A, SOURCE_A, AUTHORITY_A],
  );
  await adminPool.query(
    `INSERT INTO tender_documents (id, tender_id, document_type, name)
     VALUES ($1, $2, 'PCAP', 'Pliego de test') ON CONFLICT (id) DO NOTHING`,
    [DOCUMENT_A, TENDER_A],
  );
  await adminPool.query(
    `INSERT INTO tender_document_versions (id, document_id, version_number, url, content_hash)
     VALUES ($1, $2, 1, 'https://example.test/pliego.pdf', repeat('b', 64)) ON CONFLICT (id) DO NOTHING`,
    [DOCUMENT_VERSION_A, DOCUMENT_A],
  );
  await adminPool.query(
    `INSERT INTO document_content_snapshots
       (document_version_id, raw_storage_path, raw_sha256, raw_byte_size, extracted_text, extracted_text_sha256, extraction_engine)
     VALUES ($1, '/test/documents/pliego.bin', repeat('e', 64), 42, 'El licitador debe acreditar experiencia.', repeat('f', 64), 'test-engine')
     ON CONFLICT (document_version_id) DO NOTHING`,
    [DOCUMENT_VERSION_A],
  );
  await adminPool.query(
    `INSERT INTO requirement_extractions (id, tenant_id, idempotency_key, tender_id, document_version_id, agent_name, prompt_version, input_hash, output_hash)
     VALUES ($1, $2, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', $3, $4, 'extractor-test', 'v1', repeat('c', 64), repeat('d', 64))`,
    [EXTRACTION_A, TENANT_A, TENDER_A, DOCUMENT_VERSION_A],
  );
  await adminPool.query(
    `INSERT INTO requirements (id, tenant_id, extraction_id, tender_id, document_version_id, category, requirement_type, source_status, review_status, summary, extracted_text, confidence)
     VALUES ($1, $2, $3, $4, $5, 'TECHNICAL', 'MANDATORY', 'CITED', 'EXTRACTED', 'Requisito aislado de test', 'El licitador debe acreditar experiencia.', 90)`,
    [REQUIREMENT_A, TENANT_A, EXTRACTION_A, TENDER_A, DOCUMENT_VERSION_A],
  );
  await adminPool.query(
    `INSERT INTO requirement_citations (tenant_id, requirement_id, document_version_id, page_number, quoted_text)
     VALUES ($1, $2, $3, 2, 'El licitador debe acreditar experiencia.')`,
    [TENANT_A, REQUIREMENT_A, DOCUMENT_VERSION_A],
  );
});

after(async () => {
  await closeApplicationPool?.();
  await runtimePool.end();
  await adminPool.end();
});

async function withRuntimeSetting<T>(
  setting: 'app.current_tenant_id' | 'app.current_user_id',
  value: string,
  operation: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await runtimePool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT set_config($1, $2, true)', [setting, value]);
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

test('RLS no expone recursos privados sin contexto ni a otro tenant', async () => {
  const withoutContext = await runtimePool.query('SELECT id FROM products');
  assert.equal(withoutContext.rowCount, 0);

  const ownProducts = await withRuntimeSetting('app.current_tenant_id', TENANT_A, (client) =>
    client.query('SELECT id FROM products'),
  );
  assert.deepEqual(ownProducts.rows.map((row) => row.id), [PRODUCT_A]);

  const otherTenantProducts = await withRuntimeSetting('app.current_tenant_id', TENANT_B, (client) =>
    client.query('SELECT id FROM products WHERE id = $1', [PRODUCT_A]),
  );
  assert.equal(otherTenantProducts.rowCount, 0);

  const otherTenantProfile = await withRuntimeSetting('app.current_tenant_id', TENANT_B, (client) =>
    client.query('SELECT tenant_id FROM company_profiles WHERE tenant_id = $1', [TENANT_A]),
  );
  assert.equal(otherTenantProfile.rowCount, 0);

  const otherTenantRequirements = await withRuntimeSetting('app.current_tenant_id', TENANT_B, (client) =>
    client.query('SELECT id FROM requirements WHERE id = $1', [REQUIREMENT_A]),
  );
  assert.equal(otherTenantRequirements.rowCount, 0);
});

test('anti-BOLA: el repositorio no puede borrar un recurso de otro tenant', async () => {
  const { withTenantTransaction, pool } = await import('../../src/db/client.js');
  const { productsRepository } = await import('../../src/modules/products/products.repository.js');
  closeApplicationPool = () => pool.end();

  const deleted = await withTenantTransaction(TENANT_B, (transaction) =>
    productsRepository.deleteByIdAndTenant(transaction, PRODUCT_A, TENANT_B),
  );
  assert.equal(deleted, false);

  const stillExists = await withTenantTransaction(TENANT_A, async (transaction) => {
    const result = await transaction.execute(sql`SELECT id FROM products WHERE id = ${PRODUCT_A}`);
    return result.rows;
  });
  assert.equal(stillExists.length, 1);
  assert.equal(stillExists[0]?.id, PRODUCT_A);
});

test('RLS solo permite descubrir las membresías del usuario autenticado', async () => {
  const ownMemberships = await withRuntimeSetting('app.current_user_id', USER_A, (client) =>
    client.query('SELECT tenant_id FROM tenant_memberships WHERE user_id = $1', [USER_A]),
  );
  assert.deepEqual(ownMemberships.rows.map((row) => row.tenant_id), [TENANT_A]);

  const forgedMembershipLookup = await withRuntimeSetting('app.current_user_id', USER_B, (client) =>
    client.query('SELECT tenant_id FROM tenant_memberships WHERE user_id = $1', [USER_A]),
  );
  assert.equal(forgedMembershipLookup.rowCount, 0);
});

test('el contrato del agente exige citas estructuradas y rechaza campos privilegiados', async () => {
  const { RunExtractionSchema, SubmitExtractionSchema } = await import('../../src/modules/requirements/requirements.schema.js');
  const invalid = SubmitExtractionSchema.safeParse({
    idempotencyKey: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    tenderId: TENDER_A,
    documentVersionId: DOCUMENT_VERSION_A,
    tenantId: TENANT_B,
    agent: { name: 'extractor', promptVersion: 'v1' },
    requirements: [{
      category: 'TECHNICAL', requirementType: 'MANDATORY', sourceStatus: 'CITED',
      summary: 'Requisito sin cita suficiente', extractedText: 'Texto', confidence: 90, citations: [],
    }],
  });
  assert.equal(invalid.success, false);
  assert.equal(RunExtractionSchema.safeParse({
    idempotencyKey: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', tenderId: TENDER_A,
    documentVersionId: DOCUMENT_VERSION_A, agent: { model: 'forged' },
  }).success, false);
});

test('RLS en extraction_jobs: un tenant no puede leer ni modificar trabajos de otro tenant', async () => {
  const { withTenantTransaction } = await import('../../src/db/client.js');
  const { extractionJobsRepository } = await import('../../src/modules/requirements/extraction-jobs.repository.js');

  const JOB_A_KEY = '55555555-5555-4555-8555-555555555555';
  // Tenant A crea un job
  const jobA = await withTenantTransaction(TENANT_A, (tx) =>
    extractionJobsRepository.createJob(tx, TENANT_A, {
      idempotencyKey: JOB_A_KEY,
      tenderId: TENDER_A,
      documentVersionId: DOCUMENT_VERSION_A,
    }),
  );
  assert.equal(jobA.tenantId, TENANT_A);

  // Tenant B intenta leer el job de Tenant A: debe devolver undefined (Anti-BOLA)
  const leakAttempt = await withTenantTransaction(TENANT_B, (tx) =>
    extractionJobsRepository.findJobById(tx, TENANT_B, jobA.id),
  );
  assert.equal(leakAttempt, undefined);

  // Tenant B intenta actualizar el job de Tenant A: no afecta a ninguna fila
  const hackAttempt = await withTenantTransaction(TENANT_B, (tx) =>
    extractionJobsRepository.updateJob(tx, TENANT_B, jobA.id, { status: 'COMPLETED' }),
  );
  assert.equal(hackAttempt, undefined);
});

test('RLS en Precalificación (Fase 4): un tenant no puede leer, crear ni inferir análisis, evidencias o decisiones de otro', async () => {
  const { withTenantTransaction } = await import('../../src/db/client.js');
  const { qualificationRepository } = await import('../../src/modules/qualification/qualification.repository.js');

  const ANALYSIS_KEY_A = '66666666-6666-4666-8666-666666666666';

  // 1. Tenant A crea un ítem de dossier y un análisis de oportunidad
  const dossierItemA = await withTenantTransaction(TENANT_A, (tx) =>
    qualificationRepository.createDossierItem(tx, TENANT_A, {
      category: 'TECHNICAL',
      title: 'Solvencia técnica confidencial A',
      description: 'Experiencia sensible de Tenant A',
    }),
  );
  assert.equal(dossierItemA.tenantId, TENANT_A);

  const analysisA = await withTenantTransaction(TENANT_A, (tx) =>
    qualificationRepository.createAnalysis(tx, TENANT_A, {
      idempotencyKey: ANALYSIS_KEY_A,
      tenderId: TENDER_A,
      documentVersionId: DOCUMENT_VERSION_A,
    }),
  );
  assert.equal(analysisA.tenantId, TENANT_A);

  // 2. Tenant B no puede leer el análisis de Tenant A
  const leakAnalysis = await withTenantTransaction(TENANT_B, (tx) =>
    qualificationRepository.findAnalysisById(tx, TENANT_B, analysisA.id),
  );
  assert.equal(leakAnalysis, null);

  // 3. Tenant B no puede listar ni ver ítems de dossier de Tenant A
  const itemsB = await withTenantTransaction(TENANT_B, (tx) =>
    qualificationRepository.listDossierItems(tx, TENANT_B),
  );
  assert.ok(!itemsB.some((item) => item.id === dossierItemA.id));

  // 4. Tenant A registra una decisión
  await withTenantTransaction(TENANT_A, (tx) =>
    qualificationRepository.saveDecision(
      tx,
      TENANT_A,
      analysisA.id,
      { decision: 'PURSUE', rationale: 'Estrategia clave para Tenant A' },
      USER_A,
    ),
  );

  // 5. La evidencia de la evaluación también permanece invisible para B,
  // incluso conociendo el ID de la evaluación de A.
  const assessmentA = await withTenantTransaction(TENANT_A, (tx) =>
    qualificationRepository.saveAssessment(tx, TENANT_A, analysisA.id, {
      requirementId: REQUIREMENT_A,
      status: 'SUPPORTED',
      confidence: 90,
      rationale: 'La evidencia privada de Tenant A respalda el requisito.',
      isBlocking: false,
      agentName: 'test-matcher',
      model: 'test-model',
      promptVersion: 'test-v1',
      durationMs: 1,
      costMicrounits: 0,
      evidences: [{
        sourceType: 'DOSSIER_ITEM',
        sourceId: dossierItemA.id,
        sourceTitle: dossierItemA.title,
        matchType: 'SUPPORTS',
        excerpt: dossierItemA.description,
        confidence: 90,
      }],
    }),
  );
  const evidenceVisibleToB = await withTenantTransaction(TENANT_B, async (tx) => {
    const result = await tx.execute(sql`SELECT id FROM assessment_evidence WHERE assessment_id = ${assessmentA.id}`);
    return result.rows;
  });
  assert.equal(evidenceVisibleToB.length, 0);

  // 6. Tenant B intenta leer la decisión de Tenant A: debe devolver null
  const leakDecision = await withTenantTransaction(TENANT_B, (tx) =>
    qualificationRepository.getDecision(tx, TENANT_B, analysisA.id),
  );
  assert.equal(leakDecision, null);
});

test('Fase 5: Aislamiento estricto de alertas y portfolio entre inquilinos (Anti-Cross-Tenant Leak)', async () => {
  const { withTenantTransaction } = await import('../../src/db/client.js');
  const { alertsRepository } = await import('../../src/modules/alerts/alerts.repository.js');
  const { portfolioRepository } = await import('../../src/modules/portfolio/portfolio.repository.js');

  // 1. Tenant A recibe una alerta privada
  const { alert: alertA } = await withTenantTransaction(TENANT_A, (tx) =>
    alertsRepository.createAlert(tx, TENANT_A, {
      tenderId: TENDER_A,
      alertType: 'DOCUMENT_CHANGED',
      severity: 'WARNING',
      title: 'Alerta confidencial Tenant A',
      message: 'Se ha detectado una adenda relevante para la estrategia de A.',
      deduplicationKey: 'test-event-dedup-1',
    }),
  );
  assert.ok(alertA, 'La alerta de Tenant A debe ser creada');

  // 2. Tenant B lista sus alertas: debe recibir 0 alertas (cero fugas)
  const alertsB = await withTenantTransaction(TENANT_B, (tx) =>
    alertsRepository.listAlerts(tx, TENANT_B, {
      status: 'ALL',
      limit: 20,
      offset: 0,
    }),
  );
  assert.equal(alertsB.total, 0);
  assert.equal(alertsB.alerts.length, 0);

  // 3. Intento de BOLA / IDOR: Tenant B intenta consultar directamente la alerta de Tenant A por su ID
  const leakAlert = await withTenantTransaction(TENANT_B, (tx) =>
    alertsRepository.findAlertById(tx, TENANT_B, alertA!.id),
  );
  assert.equal(leakAlert, null, 'Tenant B no debe poder leer la alerta de Tenant A');

  // 4. Intento de manipulación de estado: Tenant B intenta marcar como leída la alerta de Tenant A
  const leakMark = await withTenantTransaction(TENANT_B, (tx) =>
    alertsRepository.markAsRead(tx, TENANT_B, alertA!.id),
  );
  assert.equal(leakMark, null, 'Tenant B no debe poder mutar el estado de la alerta de Tenant A');

  // 5. Tenant B consulta su portfolio: no debe ver el análisis, decisión ni alertas de Tenant A
  const portfolioB = await withTenantTransaction(TENANT_B, (tx) =>
    portfolioRepository.listPortfolio(tx, TENANT_B, {
      limit: 10,
      offset: 0,
    }),
  );
  assert.equal(portfolioB.total, 0);
  assert.equal(portfolioB.items.length, 0);
});

