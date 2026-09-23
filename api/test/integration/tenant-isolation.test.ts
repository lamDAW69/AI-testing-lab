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
