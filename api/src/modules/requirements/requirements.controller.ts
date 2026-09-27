import { NextFunction, Request, Response, Router } from 'express';
import { withTenantTransaction } from '../../db/client.js';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import {
  CreateExtractionJobSchema,
  ExtractionJobIdParamsSchema,
  ListRequirementsQuerySchema,
  RequirementIdParamsSchema,
  RunExtractionSchema,
  SubmitExtractionSchema,
} from './requirements.schema.js';
import { requirementsService } from './requirements.service.js';
import { extractionJobsService } from './extraction-jobs.service.js';
import { geminiRequirementsExtractor } from './gemini-requirements-extractor.js';

export const requirementsRouter = Router();
const analysisEditor = requireTenantRole('owner', 'admin', 'analyst');

requirementsRouter.use(authMiddleware);

// El resultado de un agente se acepta únicamente tras validación Zod estricta.
// La identidad y el tenant siguen procediendo exclusivamente del JWT/membresía.
requirementsRouter.post('/extractions', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = SubmitExtractionSchema.parse(req.body);
    const result = await withTenantTransaction(req.user!.tenantId, (tx) =>
      requirementsService.submitExtraction(tx, req.user!.tenantId, input));
    res.status(result.idempotent ? 200 : 201).json({ data: result.extraction, idempotent: result.idempotent });
  } catch (error) {
    next(error);
  }
});

// El modelo se invoca fuera de una transacción de PostgreSQL: evita mantener
// bloqueos mientras se espera un proveedor externo. La escritura posterior es
// transaccional y conserva la clave de idempotencia del usuario autenticado.
requirementsRouter.post('/extractions/run', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = RunExtractionSchema.parse(req.body);
    const snapshot = await withTenantTransaction(req.user!.tenantId, (tx) =>
      requirementsService.getDocumentSnapshot(tx, input));
    const extractionInput = await geminiRequirementsExtractor.extract(input, snapshot.extractedText);
    const result = await withTenantTransaction(req.user!.tenantId, (tx) =>
      requirementsService.submitExtraction(tx, req.user!.tenantId, extractionInput));
    res.status(result.idempotent ? 200 : 201).json({ data: result.extraction, idempotent: result.idempotent });
  } catch (error) {
    next(error);
  }
});

// Encola un trabajo asíncrono de extracción (Job Queue multi-tenant)
// Devuelve 202 Accepted con la URL de seguimiento del job
requirementsRouter.post('/jobs', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = CreateExtractionJobSchema.parse(req.body);
    const result = await withTenantTransaction(req.user!.tenantId, (tx) =>
      extractionJobsService.createJob(tx, req.user!.tenantId, input));
    res.status(result.idempotent ? 200 : 202).json({
      data: result.job,
      idempotent: result.idempotent,
    });
  } catch (error) {
    next(error);
  }
});

// Consulta el estado del trabajo asíncrono (polling seguro restringido al tenant)
requirementsRouter.get('/jobs/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = ExtractionJobIdParamsSchema.parse(req.params);
    const job = await withTenantTransaction(req.user!.tenantId, (tx) =>
      extractionJobsService.getJob(tx, req.user!.tenantId, id));
    res.status(200).json({ data: job });
  } catch (error) {
    next(error);
  }
});

requirementsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = ListRequirementsQuerySchema.parse(req.query);
    const items = await withTenantTransaction(req.user!.tenantId, (tx) =>
      requirementsService.listRequirements(tx, req.user!.tenantId, query));
    res.status(200).json({ data: items, pagination: { limit: query.limit, offset: query.offset, count: items.length } });
  } catch (error) {
    next(error);
  }
});

requirementsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = RequirementIdParamsSchema.parse(req.params);
    const item = await withTenantTransaction(req.user!.tenantId, (tx) =>
      requirementsService.getRequirement(tx, req.user!.tenantId, id));
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
});
