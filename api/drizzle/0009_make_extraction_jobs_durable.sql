-- Cola durable: los leases evitan duplicidad entre workers y permiten recuperar
-- trabajos abandonados por un reinicio sin retener transacciones durante el LLM.
ALTER TABLE "extraction_jobs"
  ADD COLUMN "lease_expires_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX "idx_extraction_jobs_claim" ON "extraction_jobs" ("status", "retry_after_timestamp", "lease_expires_at", "created_at");
--> statement-breakpoint
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
      lease_expires_at = now() + interval '2 minutes',
      updated_at = now()
  FROM candidate
  WHERE job.id = candidate.id
  RETURNING job.id, job.tenant_id, job.tender_id, job.document_version_id,
            job.idempotency_key, job.attempt_count, job.max_attempts;
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.claim_next_extraction_job() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_next_extraction_job() TO app_runtime;
