import { eq, sql } from 'drizzle-orm';
import { withAuthenticatedUserTransaction, withTenantTransaction } from '../../db/client.js';
import { companyProfiles, tenantMemberships, tenants } from '../../db/schema.js';
import type { AuthenticatedIdentity } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import {
  ProvisionedTenantSchema,
  ProvisionTenantSchema,
  type ProvisionedTenant,
  type ProvisionTenantInput,
} from './onboarding.schema.js';

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

  async getOrProvisionMembership(
    identity: AuthenticatedIdentity,
    requestId: string,
  ): Promise<ProvisionedTenant | null> {
    const userId = identity.userId;

    // 1. Comprobar si ya existe una membresía activa para este usuario
    const rows = await withAuthenticatedUserTransaction(userId, (tx) => tx
      .select({ tenantId: tenantMemberships.tenantId, role: tenantMemberships.role })
      .from(tenantMemberships)
      .where(eq(tenantMemberships.userId, userId))
      .limit(1));

    if (rows.length > 0 && rows[0]) {
      return await this.getMembership(rows[0].tenantId, rows[0].role);
    }

    // 2. Si no tiene membresía, comprobar si el JWT verificado contiene metadatos corporativos para autoprovisión
    const meta = identity.userMetadata;
    const rawLegalName = meta?.['company_name'] ?? meta?.['companyName'] ?? meta?.['legalName'];
    const rawTaxId = meta?.['tax_id'] ?? meta?.['taxId'];
    const rawCpvCode = meta?.['cpv_code'] ?? meta?.['cpvCode'] ?? meta?.['cpv_sector'] ?? meta?.['cpvSector'];

    if (typeof rawLegalName === 'string' && typeof rawTaxId === 'string') {
      const cpvCode = typeof rawCpvCode === 'string' && rawCpvCode.trim().length > 0
        ? rawCpvCode.trim()
        : undefined;

      const parseResult = ProvisionTenantSchema.safeParse({
        legalName: rawLegalName,
        taxId: rawTaxId,
        cpvCode,
      });

      if (parseResult.success) {
        try {
          return await this.provisionFirstTenant(userId, requestId, parseResult.data);
        } catch (error) {
          // Si otra llamada concurrente lo provisionó en paralelo, recuperar la membresía existente
          if (isProvisioningConflict(error)) {
            const recheck = await withAuthenticatedUserTransaction(userId, (tx) => tx
              .select({ tenantId: tenantMemberships.tenantId, role: tenantMemberships.role })
              .from(tenantMemberships)
              .where(eq(tenantMemberships.userId, userId))
              .limit(1));
            if (recheck.length > 0 && recheck[0]) {
              return await this.getMembership(recheck[0].tenantId, recheck[0].role);
            }
          }
          throw error;
        }
      }
    }

    // 3. Usuario sin organización y sin metadatos válidos de empresa
    return null;
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
  if (error instanceof AppError && error.statusCode === 409) {
    return true;
  }
  return typeof error === 'object' && error !== null && 'code' in error
    && (error as { readonly code?: unknown }).code === 'P0001';
}

export const onboardingService = new OnboardingService();
