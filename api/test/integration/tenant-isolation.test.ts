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
  const { SubmitExtractionSchema } = await import('../../src/modules/requirements/requirements.schema.js');
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
});
