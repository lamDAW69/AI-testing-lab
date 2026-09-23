import pg from 'pg';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Monitoreo de errores del pool para prevenir caídas silenciosas
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente inactivo de PostgreSQL:', err);
});

export const db = drizzle(pool, { schema });

/**
 * Superficie mínima de una transacción que puede acceder a datos aislados por
 * tenant. Nunca se expone el pool fuera de estos helpers para operaciones de
 * negocio: RLS depende de que el contexto viva en la misma transacción.
 */
export type TenantTransaction = Pick<typeof db, 'select' | 'insert' | 'update' | 'delete' | 'execute'>;

async function withLocalSetting<T>(
  settingName: 'app.current_tenant_id' | 'app.current_user_id',
  value: string,
  operation: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    // `true` equivale a SET LOCAL: PostgreSQL limpia el valor al terminar la
    // transacción y el pool no puede reutilizarlo para otra petición.
    await tx.execute(sql`select set_config(${settingName}, ${value}, true)`);
    return operation(tx);
  });
}

export async function withTenantTransaction<T>(
  tenantId: string,
  operation: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return withLocalSetting('app.current_tenant_id', tenantId, operation);
}

/**
 * Se usa exclusivamente después de verificar criptográficamente el `sub` del
 * JWT para localizar una membresía. La política RLS de membresías permite leer
 * únicamente las filas de ese usuario durante esta transacción.
 */
export async function withAuthenticatedUserTransaction<T>(
  userId: string,
  operation: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return withLocalSetting('app.current_user_id', userId, operation);
}
