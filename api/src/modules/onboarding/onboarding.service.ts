import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { withAuthenticatedUserTransaction, withTenantTransaction } from '../../db/client.js';
import { companyProfiles, tenants } from '../../db/schema.js';
import { AppError } from '../../middleware/error.middleware.js';
import { ProvisionedTenantSchema, type ProvisionedTenant, type ProvisionTenantInput } from './onboarding.schema.js';

export class OnboardingService {
  async provisionFirstTenant(
    userId: string,
    requestId: string,
    input: ProvisionTenantInput,
  ): Promise<ProvisionedTenant> {
    try {
      return await withAuthenticatedUserTransaction(userId, async (tx) => {
        const result = await tx.execute(sql`
          SELECT *
          FROM provision_first_tenant_for_user(
            ${userId}::uuid,
            ${input.legalName},
            ${input.taxId},
            ${input.cpvCode ?? null},
            ${requestId}::uuid
          )
        `);
        const parsed = ProvisionedTenantSchema.safeParse(result.rows[0]);
        if (!parsed.success) {
          throw new AppError(503, 'La provisión no devolvió una organización válida');
        }
        return parsed.data;
      });
    } catch (error) {
      if (isProvisioningConflict(error)) {
        throw new AppError(409, 'Esta cuenta ya pertenece a una organización. No se ha creado otra.');
      }
      throw error;
    }
  }

  async getMembership(tenantId: string, role: string): Promise<ProvisionedTenant> {
    const rows = await withTenantTransaction(tenantId, (tx) => tx
      .select({
        tenantId: tenants.id,
        name: tenants.name,
        taxId: companyProfiles.taxId,
      })
      .from(tenants)
      .leftJoin(companyProfiles, eq(companyProfiles.tenantId, tenants.id))
      .where(eq(tenants.id, tenantId))
      .limit(1));
    const row = rows[0];
    const parsed = ProvisionedTenantSchema.safeParse({
      tenantId: row?.tenantId,
      name: row?.name,
      taxId: row?.taxId,
      role,
      created: false,
    });
    if (!parsed.success) {
      throw new AppError(404, 'La organización autorizada ya no está disponible');
    }
    return parsed.data;
  }
}

function isProvisioningConflict(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error
    && (error as { readonly code?: unknown }).code === 'P0001';
}

export const onboardingService = new OnboardingService();
