-- Ampliación de lease de extracción a 5 minutos:
-- Evita condiciones de carrera y procesamiento duplicado (Split-Brain)
-- cuando Gemini o la extracción documental tardan hasta su timeout de 120 segundos.
CREATE OR REPLACE FUNCTION public.claim_next_extraction_job()
RETURNS TABLE (
  id uuid,
  tenant_id uuid,
  tender_id uuid,
  document_version_id uuid,
  idempotency_key uuid,
  attempt_count integer,
  max_attempts integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  WITH candidate AS (
    SELECT job.id
    FROM extraction_jobs AS job
    WHERE job.attempt_count < job.max_attempts
      AND (
        (job.status = 'PENDING' AND (job.retry_after_timestamp IS NULL OR job.retry_after_timestamp <= now()))
        OR (job.status = 'PROCESSING' AND job.lease_expires_at <= now())
      )
    ORDER BY job.created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  )
  UPDATE extraction_jobs AS job
  SET status = 'PROCESSING',
      attempt_count = job.attempt_count + 1,
      lease_expires_at = now() + interval '5 minutes',
      updated_at = now()
  FROM candidate
  WHERE job.id = candidate.id
  RETURNING job.id, job.tenant_id, job.tender_id, job.document_version_id,
            job.idempotency_key, job.attempt_count, job.max_attempts;
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.claim_next_extraction_job() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_next_extraction_job() TO app_runtime;
