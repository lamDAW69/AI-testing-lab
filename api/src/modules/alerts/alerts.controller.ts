import { NextFunction, Request, Response, Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import { alertsService } from './alerts.service.js';
import {
  AlertQueryFilterSchema,
} from './alerts.schema.js';

export const alertsRouter = Router();
const readerRole = requireTenantRole('owner', 'admin', 'analyst', 'member');
const editorRole = requireTenantRole('owner', 'admin', 'analyst');

alertsRouter.use(authMiddleware);

const AlertIdParamSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

// 1. Listar alertas del tenant con filtros estructurados
alertsRouter.get('/', readerRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = AlertQueryFilterSchema.parse(req.query);
    const result = await alertsService.listAlerts(req.user!.tenantId, filters);
    res.status(200).json({
      data: result.alerts,
      pagination: {
        total: result.total,
        unreadCount: result.unreadCount,
        limit: filters.limit,
        offset: filters.offset,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. Resumen y métricas de alertas
alertsRouter.get('/stats', readerRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await alertsService.getAlertsStats(req.user!.tenantId);
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
});

// 3. Marcar alerta individual como leída. Las alertas se crean únicamente
// desde servicios internos; el cliente no puede fabricar eventos operativos.
alertsRouter.patch('/:id/read', editorRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = AlertIdParamSchema.parse(req.params);
    const updated = await alertsService.markAsRead(req.user!.tenantId, id);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
});

// 4. Marcar todas las alertas del tenant como leídas
alertsRouter.post('/mark-all-read', editorRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await alertsService.markAllAsRead(req.user!.tenantId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
});

// 5. Descartar / archivar una alerta
alertsRouter.patch('/:id/dismiss', editorRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = AlertIdParamSchema.parse(req.params);
    const updated = await alertsService.dismissAlert(req.user!.tenantId, id);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
});
