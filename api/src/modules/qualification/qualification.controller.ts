import { NextFunction, Request, Response, Router } from 'express';
import { withTenantTransaction } from '../../db/client.js';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import { qualificationService } from './qualification.service.js';
import {
  CreateAnalysisDecisionSchema,
  CreateDossierItemSchema,
  CreateOpportunityAnalysisSchema,
  OpportunityAnalysisIdParamsSchema,
} from './qualification.schema.js';

export const qualificationRouter = Router();
const analysisEditor = requireTenantRole('owner', 'admin', 'analyst');

qualificationRouter.use(authMiddleware);

// 1. Crear un análisis de oportunidad (idempotente)
qualificationRouter.post('/analyses', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = CreateOpportunityAnalysisSchema.parse(req.body);
    const result = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.createOpportunityAnalysis(tx, req.user!.tenantId, input));
    res.status(result.idempotent ? 200 : 201).json({ data: result.analysis, idempotent: result.idempotent });
  } catch (error) {
    next(error);
  }
});

// 2. Ejecutar la evaluación completa de precalificación para un análisis
qualificationRouter.post('/analyses/:id/run', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let analysisId: string | undefined;
  let processingStarted = false;
  try {
    const { id } = OpportunityAnalysisIdParamsSchema.parse(req.params);
    analysisId = id;
    const prepared = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.prepareFullAnalysis(tx, req.user!.tenantId, id));

    if ('completed' in prepared) {
      res.status(200).json({ data: prepared.completed, idempotent: true });
      return;
    }
    processingStarted = true;

    // Gemini se ejecuta sin una transacción PostgreSQL abierta. El resultado
    // se persiste después en una transacción corta, con RLS del mismo tenant.
    const matches = await qualificationService.matchPreparedRequirements(prepared);
    const updated = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.completePreparedAnalysis(tx, req.user!.tenantId, prepared, matches));
    res.status(200).json({ data: updated });
  } catch (error) {
    if (analysisId && processingStarted) {
      try {
        await withTenantTransaction(req.user!.tenantId, (tx) =>
          qualificationService.markAnalysisFailed(tx, req.user!.tenantId, analysisId!));
      } catch {
        // El manejador global conserva el error original; no se oculta con un
        // fallo secundario al registrar el estado de la ejecución.
      }
    }
    next(error);
  }
});

// 3. Consultar detalle de un análisis (dimensiones, evaluaciones de requisitos y evidencias)
qualificationRouter.get('/analyses/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = OpportunityAnalysisIdParamsSchema.parse(req.params);
    const detail = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.getAnalysisDetail(tx, req.user!.tenantId, id));
    res.status(200).json({ data: detail });
  } catch (error) {
    next(error);
  }
});

// 4. Registrar o actualizar la decisión humana sobre la oportunidad
qualificationRouter.post('/analyses/:id/decision', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = OpportunityAnalysisIdParamsSchema.parse(req.params);
    const input = CreateAnalysisDecisionSchema.parse(req.body);
    const decision = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.recordDecision(tx, req.user!.tenantId, id, input, req.user!.userId));
    res.status(200).json({ data: decision });
  } catch (error) {
    next(error);
  }
});

// 5. Gestión del dossier de la empresa: añadir ítem
qualificationRouter.post('/dossier', analysisEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = CreateDossierItemSchema.parse(req.body);
    const item = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.createDossierItem(tx, req.user!.tenantId, input));
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

// 6. Gestión del dossier de la empresa: listar ítems
qualificationRouter.get('/dossier', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await withTenantTransaction(req.user!.tenantId, (tx) =>
      qualificationService.listDossierItems(tx, req.user!.tenantId));
    res.status(200).json({ data: items });
  } catch (error) {
    next(error);
  }
});
