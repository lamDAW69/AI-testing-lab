import { and, desc, eq } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import {
  companyCertifications,
  companyProfiles,
  type CompanyCertification,
  type CompanyProfile,
} from '../../db/schema.js';
import type { CompanyProfileInput, CreateCertificationInput, UpdateCertificationInput } from './dossier.schema.js';

export class DossierRepository {
  async findProfile(database: TenantTransaction, tenantId: string): Promise<CompanyProfile | undefined> {
    const rows = await database.select().from(companyProfiles)
      .where(eq(companyProfiles.tenantId, tenantId)).limit(1);
    return rows[0];
  }

  async upsertProfile(database: TenantTransaction, tenantId: string, input: CompanyProfileInput): Promise<CompanyProfile> {
    const rows = await database.insert(companyProfiles).values({ tenantId, ...input })
      .onConflictDoUpdate({
        target: companyProfiles.tenantId,
        set: { ...input, evidenceStatus: 'DECLARED', updatedAt: new Date() },
      }).returning();
    const profile = rows[0];
    if (!profile) throw new Error('No se pudo guardar el dossier empresarial');
    return profile;
  }

  async listCertifications(database: TenantTransaction, tenantId: string): Promise<CompanyCertification[]> {
    return database.select().from(companyCertifications)
      .where(eq(companyCertifications.tenantId, tenantId))
      .orderBy(desc(companyCertifications.validUntil), desc(companyCertifications.createdAt));
  }

  async createCertification(
    database: TenantTransaction, tenantId: string, input: CreateCertificationInput,
  ): Promise<CompanyCertification> {
    const rows = await database.insert(companyCertifications).values({
      tenantId,
      ...input,
      validFrom: input.validFrom ? new Date(`${input.validFrom}T00:00:00.000Z`) : undefined,
      validUntil: input.validUntil ? new Date(`${input.validUntil}T00:00:00.000Z`) : undefined,
      evidenceStatus: 'DECLARED',
    }).returning();
    const certification = rows[0];
    if (!certification) throw new Error('No se pudo crear la certificación');
    return certification;
  }

  async updateCertification(
    database: TenantTransaction, tenantId: string, id: string, input: UpdateCertificationInput,
  ): Promise<CompanyCertification | undefined> {
    const updates = {
      ...input,
      validFrom: input.validFrom === undefined ? undefined : new Date(`${input.validFrom}T00:00:00.000Z`),
      validUntil: input.validUntil === undefined ? undefined : new Date(`${input.validUntil}T00:00:00.000Z`),
      evidenceStatus: 'DECLARED' as const,
      updatedAt: new Date(),
    };
    const rows = await database.update(companyCertifications).set(updates)
      .where(and(eq(companyCertifications.id, id), eq(companyCertifications.tenantId, tenantId))).returning();
    return rows[0];
  }

  async deleteCertification(database: TenantTransaction, tenantId: string, id: string): Promise<boolean> {
    const rows = await database.delete(companyCertifications)
      .where(and(eq(companyCertifications.id, id), eq(companyCertifications.tenantId, tenantId)))
      .returning({ id: companyCertifications.id });
    return rows.length > 0;
  }
}

export const dossierRepository = new DossierRepository();
