import pg from 'pg';
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
