import { NextFunction, Request, Response, Router } from 'express';
import { authMiddleware, identityMiddleware } from '../../middleware/auth.middleware.js';
import { ProvisionTenantSchema } from './onboarding.schema.js';
import { onboardingService } from './onboarding.service.js';

export const onboardingRouter = Router();

// Esta ruta no usa authMiddleware porque el usuario aún no tiene membresía.
// identityMiddleware sigue validando criptográficamente su JWT antes de crear
// cualquier dato. No hay selección de tenant procedente del cliente.
onboardingRouter.post('/tenant', identityMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = ProvisionTenantSchema.parse(req.body);
    const tenant = await onboardingService.provisionFirstTenant(req.identity!.userId, req.requestId, input);
    res.status(201).json({ data: tenant });
  } catch (error) {
    next(error);
  }
});

// Tras el alta, y en cada inicio de sesión, el cliente obtiene únicamente la
// membresía que authMiddleware ha resuelto a partir de su JWT y la base de datos.
onboardingRouter.get('/membership', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membership = await onboardingService.getMembership(req.user!.tenantId, req.user!.role);
    res.status(200).json({ data: membership });
  } catch (error) {
    next(error);
  }
});
