import { NextFunction, Request, Response, Router } from 'express';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import { portfolioService } from './portfolio.service.js';
import {
  PortfolioQueryFilterSchema,
  PortfolioTenderIdParamsSchema,
} from './portfolio.schema.js';

export const portfolioRouter = Router();
const readerRole = requireTenantRole('owner', 'admin', 'analyst', 'member');

portfolioRouter.use(authMiddleware);

// 1. Listar oportunidades del portfolio con filtros deterministas
portfolioRouter.get('/', readerRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = PortfolioQueryFilterSchema.parse(req.query);
    const result = await portfolioService.listPortfolio(req.user!.tenantId, filters);
    res.status(200).json({
      data: result.items,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. Métricas y observabilidad del portfolio (Fase 5.4)
portfolioRouter.get('/metrics', readerRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const metrics = await portfolioService.getPortfolioMetrics(req.user!.tenantId);
    res.status(200).json({ data: metrics });
  } catch (error) {
    next(error);
  }
});

// 3. Detalle completo de una oportunidad del portfolio
portfolioRouter.get('/:tenderId', readerRole, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tenderId } = PortfolioTenderIdParamsSchema.parse(req.params);
    const item = await portfolioService.getPortfolioItem(req.user!.tenantId, tenderId);
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
});
