import { NextFunction, Request, Response, Router } from 'express';
import { withTenantTransaction } from '../../db/client.js';
import { auditService } from '../audit/audit.service.js';
import { authMiddleware, requireTenantRole } from '../../middleware/auth.middleware.js';
import {
  CertificationParamsSchema,
  CompanyProfileSchema,
  CreateCertificationSchema,
  UpdateCertificationSchema,
} from './dossier.schema.js';
import { dossierService } from './dossier.service.js';

const dossierEditor = requireTenantRole('owner', 'admin', 'analyst');
export const dossierRouter = Router();

dossierRouter.use(authMiddleware);

dossierRouter.get('/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await withTenantTransaction(req.user!.tenantId, (tx) =>
      dossierService.getProfile(tx, req.user!.tenantId));
    res.status(200).json({ data: profile ?? null });
  } catch (error) {
    next(error);
  }
});

dossierRouter.put('/profile', dossierEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = CompanyProfileSchema.parse(req.body);
    const profile = await withTenantTransaction(req.user!.tenantId, async (tx) => {
      const saved = await dossierService.saveProfile(tx, req.user!.tenantId, input);
      await auditService.recordMutation(tx, {
        tenantId: req.user!.tenantId,
        actorId: req.user!.userId,
        requestId: req.requestId,
        action: 'company_profile.upserted',
        entityType: 'company_profile',
        entityId: saved.tenantId,
        changedFields: Object.keys(input),
      });
      return saved;
    });
    res.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
});

dossierRouter.get('/certifications', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certifications = await withTenantTransaction(req.user!.tenantId, (tx) =>
      dossierService.listCertifications(tx, req.user!.tenantId));
    res.status(200).json({ data: certifications });
  } catch (error) {
    next(error);
  }
});

dossierRouter.post('/certifications', dossierEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = CreateCertificationSchema.parse(req.body);
    const certification = await withTenantTransaction(req.user!.tenantId, async (tx) => {
      const created = await dossierService.createCertification(tx, req.user!.tenantId, input);
      await auditService.recordMutation(tx, {
        tenantId: req.user!.tenantId,
        actorId: req.user!.userId,
        requestId: req.requestId,
        action: 'company_certification.created',
        entityType: 'company_certification',
        entityId: created.id,
        changedFields: Object.keys(input),
      });
      return created;
    });
    res.status(201).json({ data: certification });
  } catch (error) {
    next(error);
  }
});

dossierRouter.patch('/certifications/:id', dossierEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = CertificationParamsSchema.parse(req.params);
    const input = UpdateCertificationSchema.parse(req.body);
    const certification = await withTenantTransaction(req.user!.tenantId, async (tx) => {
      const updated = await dossierService.updateCertification(tx, req.user!.tenantId, id, input);
      await auditService.recordMutation(tx, {
        tenantId: req.user!.tenantId,
        actorId: req.user!.userId,
        requestId: req.requestId,
        action: 'company_certification.updated',
        entityType: 'company_certification',
        entityId: updated.id,
        changedFields: Object.keys(input),
      });
      return updated;
    });
    res.status(200).json({ data: certification });
  } catch (error) {
    next(error);
  }
});

dossierRouter.delete('/certifications/:id', dossierEditor, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = CertificationParamsSchema.parse(req.params);
    await withTenantTransaction(req.user!.tenantId, async (tx) => {
      await dossierService.deleteCertification(tx, req.user!.tenantId, id);
      await auditService.recordMutation(tx, {
        tenantId: req.user!.tenantId,
        actorId: req.user!.userId,
        requestId: req.requestId,
        action: 'company_certification.deleted',
        entityType: 'company_certification',
        entityId: id,
        changedFields: [],
      });
    });
    res.status(200).json({ message: 'Certificación eliminada' });
  } catch (error) {
    next(error);
  }
});
