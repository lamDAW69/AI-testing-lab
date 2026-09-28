import { env } from '../../config/env.js';
import { pool } from '../../db/client.js';
import { extractionJobsService } from './extraction-jobs.service.js';

const POLL_INTERVAL_MS = 1_000;
let draining = false;

async function drainQueue(): Promise<void> {
  if (draining) return;
  draining = true;
  try {
    // Drena un lote limitado para mantener equidad y volver a consultar leases.
    for (let processed = 0; processed < 10; processed += 1) {
      const claimed = await extractionJobsService.processNextJob();
      if (!claimed) break;
    }
  } catch (error) {
    console.error('Error no controlado en el worker de extracciones:', error);
  } finally {
    draining = false;
  }
}

const interval = setInterval(() => { void drainQueue(); }, POLL_INTERVAL_MS);
void drainQueue();

async function shutdown(signal: string): Promise<void> {
  console.log(`Worker de extracciones detenido por ${signal}`);
  clearInterval(interval);
  await pool.end();
  process.exit(0);
}

console.log(`Worker de extracciones iniciado en modo ${env.NODE_ENV}`);
process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
process.on('SIGINT', () => { void shutdown('SIGINT'); });
