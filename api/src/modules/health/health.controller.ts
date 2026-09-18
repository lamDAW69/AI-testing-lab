import { Router, Request, Response } from 'express';
import { pool } from '../../db/client.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req: Request, res: Response): Promise<void> => {
  let dbStatus = 'disconnected';

  try {
    const result = await pool.query('SELECT 1 AS alive');
    if (result.rows.length > 0) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = 'error';
    console.error('❌ Health check DB error:', err);
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      api: 'healthy',
      database: dbStatus,
    },
  });
});
