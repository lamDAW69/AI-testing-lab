import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.js';

async function runMigrations(): Promise<void> {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migraciones de base de datos aplicadas correctamente');
  } finally {
    await pool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error('❌ Error al aplicar migraciones:', error);
  process.exitCode = 1;
});
