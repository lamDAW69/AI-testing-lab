import { NextFunction, Request, Response, Router } from 'express';
import { withTenantTransaction } from '../../db/client.js';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import {
  ListRequirementsQuerySchema,
  RequirementIdParamsSchema,
  SubmitExtractionSchema,
} from './requirements.schema.js';
import { requirementsService } from './requirements.service.js';

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
