import { sql } from 'drizzle-orm';
import { db } from '../../db/client.js';

export interface InvalidationResult {
  analysisId: string;
  tenantId: string;
  tenderId: string;
}

export class InvalidationService {
  /**
   * Invalida de forma atómica los análisis vigentes de cualquier tenant
   * cuando se publica una nueva versión documental o adenda para una licitación.
   * Genera alertas idempotentes en la outbox de cada tenant afectado.
   */
  async invalidateAnalysesForDocumentVersion(
    tenderId: string,
    newDocumentVersionId: string,
    reason: string = 'Nueva versión documental o pliego rectificado detectado',
  ): Promise<InvalidationResult[]> {
    const result = await db.execute<{
      analysis_id: string;
      tenant_id: string;
      tender_id: string;
    }>(sql`
      SELECT analysis_id, tenant_id, tender_id
      FROM public.invalidate_analyses_for_document_version(
        ${tenderId}::uuid,
        ${newDocumentVersionId}::uuid,
        ${reason}
      )
    `);

    return (result.rows ?? []).map((row) => ({
      analysisId: row.analysis_id,
      tenantId: row.tenant_id,
      tenderId: row.tender_id,
    }));
  }

  /**
   * Invalida o marca como obsoletos los análisis vigentes cuando un expediente
   * cambia de estado (ej: CANCELLED, SUSPENDED) o sufre modificación de plazos.
   */
  async invalidateAnalysesForTenderChange(
    tenderId: string,
    reason: string,
    newStatus?: string,
    newDeadline?: Date | null,
  ): Promise<InvalidationResult[]> {
    const result = await db.execute<{
      analysis_id: string;
      tenant_id: string;
      tender_id: string;
    }>(sql`
      SELECT analysis_id, tenant_id, tender_id
      FROM public.invalidate_analyses_for_tender_change(
        ${tenderId}::uuid,
        ${reason},
        ${newStatus ?? null},
        ${newDeadline ?? null}
      )
    `);

    return (result.rows ?? []).map((row) => ({
      analysisId: row.analysis_id,
      tenantId: row.tenant_id,
      tenderId: row.tender_id,
    }));
  }
}

export const invalidationService = new InvalidationService();
