CREATE TABLE "extraction_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "idempotency_key" uuid NOT NULL,
  "status" varchar(32) DEFAULT 'PENDING' NOT NULL,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "max_attempts" integer DEFAULT 3 NOT NULL,
  "error_message" text,
  "retry_after_timestamp" timestamp with time zone,
  "result_extraction_id" uuid REFERENCES "requirement_extractions"("id") ON DELETE set null,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "extraction_jobs_status_check" CHECK ("status" IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  CONSTRAINT "extraction_jobs_attempt_count_check" CHECK ("attempt_count" >= 0),
  CONSTRAINT "extraction_jobs_max_attempts_check" CHECK ("max_attempts" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_extraction_jobs_tenant_idempotency" ON "extraction_jobs" ("tenant_id", "idempotency_key");
CREATE INDEX "idx_extraction_jobs_tenant_status" ON "extraction_jobs" ("tenant_id", "status");
CREATE INDEX "idx_extraction_jobs_status_retry" ON "extraction_jobs" ("status", "retry_after_timestamp");
--> statement-breakpoint
ALTER TABLE "extraction_jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "extraction_jobs" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "extraction_jobs_current_tenant" ON "extraction_jobs"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "extraction_jobs" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE "extraction_jobs" TO app_runtime;
