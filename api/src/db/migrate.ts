import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { env } from '../config/env.js';

const { Pool } = pg;

async function runMigrations(): Promise<void> {
  const connectionString = env.ADMIN_DATABASE_URL ?? env.DATABASE_URL;
  const migrationPool = new Pool({ connectionString });
  const migrationDb = drizzle(migrationPool);

  try {
    console.log('🔄 Iniciando migraciones de base de datos con cuenta administrativa...');
    await migrate(migrationDb, { migrationsFolder: './drizzle' });
    console.log('✅ Migraciones de base de datos aplicadas correctamente');
  } finally {
    await migrationPool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error('❌ Error al aplicar migraciones:', error);
  process.exitCode = 1;
});
