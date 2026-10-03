import { z } from 'zod';

const LegalNameSchema = z.string().trim().min(2).max(255);
const TaxIdSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9-]{2,31}$/);

/**
 * El navegador solo puede declarar datos corporativos. Nunca aporta tenantId,
 * userId, rol o estados de evidencia: los determina el servidor.
 */
export const ProvisionTenantSchema = z.object({
  legalName: LegalNameSchema,
  taxId: TaxIdSchema,
  cpvCode: z.string().regex(/^\d{8}$/).optional(),
}).strict();

export const ProvisionedTenantSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  taxId: z.string().min(3).max(32),
  role: z.enum(['owner', 'admin', 'analyst', 'reviewer', 'viewer', 'member']),
  created: z.boolean(),
}).strict();

export type ProvisionTenantInput = z.infer<typeof ProvisionTenantSchema>;
export type ProvisionedTenant = z.infer<typeof ProvisionedTenantSchema>;
