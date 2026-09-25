import crypto from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import { documentContentService } from './document-content.service.js';

export const documentContentRouter = Router();

const DocumentVersionParamsSchema = z.object({
  id: z.string().uuid('El ID de versión documental debe ser un UUID válido'),
}).strict();

function requireIngestSecret(req: Request, _res: Response, next: NextFunction): void {
  const provided = req.headers['x-ingest-secret'];
  if (typeof provided !== 'string') return next(new AppError(401, 'Cabecera X-Ingest-Secret requerida'));
  const candidate = Buffer.from(provided);
  const expected = Buffer.from(env.INGEST_SECRET);
  if (candidate.length !== expected.length || !crypto.timingSafeEqual(candidate, expected)) {
    return next(new AppError(403, 'Secreto de ingesta inválido'));
  }
  next();
}

/** Job interno: descarga y sella una única versión documental inmutable. */
documentContentRouter.post('/versions/:id/fetch', requireIngestSecret, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = DocumentVersionParamsSchema.safeParse(req.params);
    if (!params.success) return next(new AppError(400, 'ID de versión documental inválido', params.error.format()));
    const result = await documentContentService.fetchAndStore(params.data.id);
    res.status(result.idempotent ? 200 : 201).json({
      documentVersionId: result.snapshot.documentVersionId,
      rawSha256: result.snapshot.rawSha256,
      extractedTextSha256: result.snapshot.extractedTextSha256,
      rawByteSize: result.snapshot.rawByteSize,
      idempotent: result.idempotent,
    });
  } catch (error) {
    next(error);
  }
});
