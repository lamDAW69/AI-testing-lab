import type { TenantTransaction } from '../../db/client.js';
import type { CompanyCertification, CompanyProfile } from '../../db/schema.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { CompanyProfileInput, CreateCertificationInput, UpdateCertificationInput } from './dossier.schema.js';
import { DossierRepository, dossierRepository } from './dossier.repository.js';

export class DossierService {
  constructor(private readonly repository: DossierRepository = dossierRepository) {}

  getProfile(database: TenantTransaction, tenantId: string): Promise<CompanyProfile | undefined> {
    return this.repository.findProfile(database, tenantId);
  }

  saveProfile(database: TenantTransaction, tenantId: string, input: CompanyProfileInput): Promise<CompanyProfile> {
    return this.repository.upsertProfile(database, tenantId, input);
  }

  listCertifications(database: TenantTransaction, tenantId: string): Promise<CompanyCertification[]> {
    return this.repository.listCertifications(database, tenantId);
  }

  createCertification(
    database: TenantTransaction, tenantId: string, input: CreateCertificationInput,
  ): Promise<CompanyCertification> {
    return this.repository.createCertification(database, tenantId, input);
  }

  async updateCertification(
    database: TenantTransaction, tenantId: string, id: string, input: UpdateCertificationInput,
  ): Promise<CompanyCertification> {
    const certification = await this.repository.updateCertification(database, tenantId, id, input);
    if (!certification) throw new AppError(404, 'La certificación solicitada no existe');
    return certification;
  }

  async deleteCertification(database: TenantTransaction, tenantId: string, id: string): Promise<void> {
    const deleted = await this.repository.deleteCertification(database, tenantId, id);
    if (!deleted) throw new AppError(404, 'La certificación solicitada no existe');
  }
}

export const dossierService = new DossierService();
