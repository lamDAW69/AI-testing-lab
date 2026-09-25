import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import { procurementService } from './procurement.service.js';
import { TenderQueryFilterSchema, IngestionJobInputSchema } from './procurement.schema.js';

export const procurementRouter = Router();

const TenderIdParamSchema = z.object({
  id: z.string().uuid('El ID de licitación debe ser un UUID válido'),
}).strict();

/**
 * Middleware de protección para el endpoint de ingesta.
 * Valida la cabecera X-Ingest-Secret en tiempo constante (anti-timing attacks).
 */
function requireIngestSecret(req: Request, _res: Response, next: NextFunction): void {
  const providedSecret = req.headers['x-ingest-secret'];

  if (typeof providedSecret !== 'string') {
    next(new AppError(401, 'Cabecera X-Ingest-Secret requerida para ejecutar ingestas'));
    return;
  }

  const expectedSecret = env.INGEST_SECRET ?? '';

  const providedBuffer = Buffer.from(providedSecret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    next(new AppError(403, 'Secreto de ingesta inválido'));
    return;
  }

  next();
}

/**
 * GET /api/public/tenders
 * Catálogo público de licitaciones con filtros deterministas y paginación.
 */
procurementRouter.get('/tenders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery = TenderQueryFilterSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      next(new AppError(400, 'Parámetros de consulta inválidos', parsedQuery.error.format()));
      return;
    }

    const result = await procurementService.listTenders(parsedQuery.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/tenders/:id
 * Consulta de detalle completo de un expediente con sus lotes, documentos y eventos.
 */
procurementRouter.get('/tenders/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = TenderIdParamSchema.safeParse(req.params);
    if (!params.success) {
      next(new AppError(400, 'ID de expediente inválido', params.error.format()));
      return;
    }

    const tender = await procurementService.getTenderById(params.data.id);
    if (!tender) {
      next(new AppError(404, 'Expediente de licitación no encontrado'));
      return;
    }

    res.status(200).json(tender);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/sources
 * Listado de fuentes oficiales configuradas en el sistema.
 */
procurementRouter.get('/sources', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sources = await procurementService.listSources();
    res.status(200).json({ data: sources });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/public/ingest
 * Disparo del job de ingesta oficial (idempotente).
 */
procurementRouter.post('/ingest', requireIngestSecret, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bodyResult = IngestionJobInputSchema.safeParse(req.body);
    if (!bodyResult.success) {
      next(new AppError(400, 'Cuerpo de petición de ingesta inválido', bodyResult.error.format()));
      return;
    }

    const summary = await procurementService.ingestBatch(bodyResult.data.tenders);
    res.status(200).json({
      message: 'Lote de licitaciones procesado con éxito',
      ...summary,
    });
  } catch (error) {
    next(error);
  }
});
