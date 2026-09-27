-- 1. Ampliación de opportunity_analyses para gestión de vigencia e invalidación
ALTER TABLE "opportunity_analyses"
  ADD COLUMN "is_current" boolean DEFAULT true NOT NULL,
  ADD COLUMN "invalidation_status" varchar(32) DEFAULT 'VALID' NOT NULL,
  ADD COLUMN "invalidation_reason" text,
  ADD COLUMN "superseded_by_document_version_id" uuid REFERENCES "tender_document_versions"("id") ON DELETE set null,
  ADD COLUMN "invalidated_at" timestamp with time zone,
  ADD CONSTRAINT "opportunity_analyses_invalidation_status_check" CHECK ("invalidation_status" IN ('VALID', 'STALE', 'REQUIRES_REANALYSIS'));

--> statement-breakpoint
CREATE INDEX "idx_opportunity_analyses_tenant_invalidation" ON "opportunity_analyses" ("tenant_id", "invalidation_status");
CREATE INDEX "idx_opportunity_analyses_tenant_current" ON "opportunity_analyses" ("tenant_id", "tender_id", "is_current");

--> statement-breakpoint
-- 2. Cola persistente / Outbox de alertas de oportunidad
CREATE TABLE "opportunity_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "analysis_id" uuid REFERENCES "opportunity_analyses"("id") ON DELETE set null,
  "alert_type" varchar(50) NOT NULL,
  "severity" varchar(20) DEFAULT 'INFO' NOT NULL,
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" varchar(20) DEFAULT 'UNREAD' NOT NULL,
  "idempotency_hash" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "read_at" timestamp with time zone,
  "dismissed_at" timestamp with time zone,
  CONSTRAINT "opportunity_alerts_alert_type_check" CHECK ("alert_type" IN ('NEW_OPPORTUNITY', 'DOCUMENT_CHANGED', 'DEADLINE_APPROACHING', 'ANALYSIS_COMPLETED', 'ANALYSIS_FAILED', 'DOSSIER_EXPIRED')),
  CONSTRAINT "opportunity_alerts_severity_check" CHECK ("severity" IN ('INFO', 'WARNING', 'CRITICAL')),
  CONSTRAINT "opportunity_alerts_status_check" CHECK ("status" IN ('UNREAD', 'READ', 'DISMISSED'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX "uq_opportunity_alerts_tenant_idempotency" ON "opportunity_alerts" ("tenant_id", "idempotency_hash");
CREATE INDEX "idx_opportunity_alerts_tenant_status" ON "opportunity_alerts" ("tenant_id", "status", "created_at" DESC);
CREATE INDEX "idx_opportunity_alerts_tenant_tender" ON "opportunity_alerts" ("tenant_id", "tender_id");

--> statement-breakpoint
ALTER TABLE "opportunity_alerts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "opportunity_alerts" FORCE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE POLICY "opportunity_alerts_current_tenant" ON "opportunity_alerts"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

--> statement-breakpoint
REVOKE ALL ON TABLE "opportunity_alerts" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "opportunity_alerts" TO app_runtime;

--> statement-breakpoint
-- 3. Función atómica para invalidar análisis de todos los tenants ante una nueva versión documental
CREATE OR REPLACE FUNCTION public.invalidate_analyses_for_document_version(
  p_tender_id uuid,
  p_new_document_version_id uuid,
  p_reason text DEFAULT 'Nueva versión documental registrada'
)
RETURNS TABLE (
  analysis_id uuid,
  tenant_id uuid,
  tender_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tender_ref varchar;
BEGIN
  SELECT source_tender_id INTO v_tender_ref FROM tenders WHERE id = p_tender_id;

  RETURN QUERY
  WITH invalidated AS (
    UPDATE opportunity_analyses
    SET is_current = false,
        invalidation_status = 'REQUIRES_REANALYSIS',
        invalidation_reason = p_reason,
        superseded_by_document_version_id = p_new_document_version_id,
        invalidated_at = now(),
        updated_at = now()
    WHERE opportunity_analyses.tender_id = p_tender_id
      AND opportunity_analyses.is_current = true
      AND opportunity_analyses.document_version_id <> p_new_document_version_id
    RETURNING opportunity_analyses.id AS affected_analysis_id,
              opportunity_analyses.tenant_id AS affected_tenant_id,
              opportunity_analyses.tender_id AS affected_tender_id,
              opportunity_analyses.document_version_id AS old_doc_ver_id
  ),
  inserted_alerts AS (
    INSERT INTO opportunity_alerts (
      tenant_id,
      tender_id,
      analysis_id,
      alert_type,
      severity,
      title,
      message,
      metadata,
      status,
      idempotency_hash
    )
    SELECT
      inv.affected_tenant_id,
      inv.affected_tender_id,
      inv.affected_analysis_id,
      'DOCUMENT_CHANGED',
      'WARNING',
      'Pliego modificado: requiere re-análisis',
      'Se ha detectado una nueva versión documental para el expediente ' || COALESCE(v_tender_ref, inv.affected_tender_id::text) || '. El análisis previo ha sido marcado para re-evaluación.',
      jsonb_build_object(
        'previousDocumentVersionId', inv.old_doc_ver_id,
        'newDocumentVersionId', p_new_document_version_id,
        'reason', p_reason
      ),
      'UNREAD',
      encode(sha256((inv.affected_tenant_id::text || ':' || inv.affected_tender_id::text || ':DOCUMENT_CHANGED:' || p_new_document_version_id::text)::bytea), 'hex')
    FROM invalidated inv
    ON CONFLICT (tenant_id, idempotency_hash) DO NOTHING
    RETURNING id
  )
  SELECT affected_analysis_id, affected_tenant_id, affected_tender_id FROM invalidated;
END;
$$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION public.invalidate_analyses_for_document_version(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.invalidate_analyses_for_document_version(uuid, uuid, text) TO app_runtime;

--> statement-breakpoint
-- 4. Función atómica para invalidar análisis ante modificaciones del expediente (estado o plazos)
CREATE OR REPLACE FUNCTION public.invalidate_analyses_for_tender_change(
  p_tender_id uuid,
  p_reason text,
  p_new_status varchar DEFAULT NULL,
  p_new_deadline timestamp with time zone DEFAULT NULL
)
RETURNS TABLE (
  analysis_id uuid,
  tenant_id uuid,
  tender_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tender_ref varchar;
  v_alert_type varchar := 'DOCUMENT_CHANGED';
  v_severity varchar := 'WARNING';
BEGIN
  SELECT source_tender_id INTO v_tender_ref FROM tenders WHERE id = p_tender_id;

  IF p_new_status IN ('CANCELLED', 'SUSPENDED') THEN
    v_severity := 'CRITICAL';
  END IF;

  RETURN QUERY
  WITH invalidated AS (
    UPDATE opportunity_analyses
    SET is_current = false,
        invalidation_status = 'STALE',
        invalidation_reason = p_reason,
        invalidated_at = now(),
        updated_at = now()
    WHERE opportunity_analyses.tender_id = p_tender_id
      AND opportunity_analyses.is_current = true
    RETURNING opportunity_analyses.id AS affected_analysis_id,
              opportunity_analyses.tenant_id AS affected_tenant_id,
              opportunity_analyses.tender_id AS affected_tender_id
  ),
  inserted_alerts AS (
    INSERT INTO opportunity_alerts (
      tenant_id,
      tender_id,
      analysis_id,
      alert_type,
      severity,
      title,
      message,
      metadata,
      status,
      idempotency_hash
    )
    SELECT
      inv.affected_tenant_id,
      inv.affected_tender_id,
      inv.affected_analysis_id,
      v_alert_type,
      v_severity,
      'Expediente actualizado: análisis obsoleto',
      'El expediente ' || COALESCE(v_tender_ref, inv.affected_tender_id::text) || ' ha sufrido modificaciones (' || p_reason || ').',
      jsonb_build_object(
        'reason', p_reason,
        'newStatus', p_new_status,
        'newDeadline', p_new_deadline
      ),
      'UNREAD',
      encode(sha256((inv.affected_tenant_id::text || ':' || inv.affected_tender_id::text || ':TENDER_CHANGED:' || coalesce(p_new_status, '') || ':' || coalesce(p_new_deadline::text, '') || ':' || p_reason)::bytea), 'hex')
    FROM invalidated inv
    ON CONFLICT (tenant_id, idempotency_hash) DO NOTHING
    RETURNING id
  )
  SELECT affected_analysis_id, affected_tenant_id, affected_tender_id FROM invalidated;
END;
$$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION public.invalidate_analyses_for_tender_change(uuid, text, varchar, timestamp with time zone) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.invalidate_analyses_for_tender_change(uuid, text, varchar, timestamp with time zone) TO app_runtime;
