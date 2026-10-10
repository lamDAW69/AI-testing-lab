import { NextFunction, Request, Response, Router } from 'express';
import { identityMiddleware } from '../../middleware/auth.middleware.js';
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

// Resuelve la membresía existente o autoprovisiona si el token verificado incluye metadatos corporativos.
// Si el usuario no tiene organización ni metadatos válidos, devuelve 200 con pendingOnboarding: true
// sin emitir 403 Forbidden.
onboardingRouter.get('/membership', identityMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membership = await onboardingService.getOrProvisionMembership(req.identity!, req.requestId);
    if (!membership) {
      res.status(200).json({
        data: null,
        pendingOnboarding: true,
        message: 'Usuario autenticado sin organización vinculada.',
      });
      return;
    }
    res.status(200).json({ data: membership });
  } catch (error) {
    next(error);
  }
});
