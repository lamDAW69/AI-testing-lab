import type { TenantTransaction } from '../../db/client.js';
import { auditEvents } from '../../db/schema.js';

export type ProductAuditAction = 'product.created' | 'product.updated' | 'product.deleted';

export interface ProductMutationAudit {
  readonly tenantId: string;
  readonly actorId: string;
  readonly requestId: string;
  readonly action: ProductAuditAction;
  readonly productId: string;
  readonly changedFields: readonly string[];
}

/**
 * Registra únicamente metadatos seguros y estructurales. Los valores de bodies
 * o documentos nunca se guardan aquí, porque la auditoría no debe convertirse
 * en otra vía de exposición de información privada.
 */
export class AuditService {
  async recordProductMutation(tx: TenantTransaction, event: ProductMutationAudit): Promise<void> {
    await tx.insert(auditEvents).values({
      tenantId: event.tenantId,
      actorType: 'user',
      actorId: event.actorId,
      action: event.action,
      entityType: 'product',
      entityId: event.productId,
      correlationId: event.requestId,
      metadata: { changedFields: [...event.changedFields].sort() },
    });
  }
}

export const auditService = new AuditService();
