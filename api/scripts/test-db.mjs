import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 3000,
});

async function main() {
  console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@'));
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('Connected successfully! DB Time:', res.rows[0].current_time);

    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Tables:', tablesRes.rows.map(r => r.table_name));

    const tendersCount = await pool.query('SELECT count(*) FROM tenders');
    console.log('Total tenders in DB:', tendersCount.rows[0].count);

    if (parseInt(tendersCount.rows[0].count, 10) > 0) {
      const sampleTenders = await pool.query('SELECT id, source_tender_id, title, main_cpv_code, status FROM tenders LIMIT 5');
      console.log('Sample tenders:', sampleTenders.rows);
    }
  } catch (err) {
    console.error('Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

main();
