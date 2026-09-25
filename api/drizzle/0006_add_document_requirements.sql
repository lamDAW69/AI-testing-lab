CREATE TABLE "requirement_extractions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "idempotency_key" uuid NOT NULL,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "agent_name" varchar(100) NOT NULL, "model" varchar(100), "prompt_version" varchar(100) NOT NULL,
  "tool_version" varchar(100), "input_hash" varchar(64) NOT NULL, "output_hash" varchar(64) NOT NULL,
  "duration_ms" integer, "cost_microunits" integer, "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "requirement_extractions_duration_nonnegative_check" CHECK ("duration_ms" IS NULL OR "duration_ms" >= 0),
  CONSTRAINT "requirement_extractions_cost_nonnegative_check" CHECK ("cost_microunits" IS NULL OR "cost_microunits" >= 0)
);
--> statement-breakpoint
CREATE TABLE "requirements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "extraction_id" uuid NOT NULL REFERENCES "requirement_extractions"("id") ON DELETE cascade,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "category" varchar(32) NOT NULL, "requirement_type" varchar(32) NOT NULL,
  "source_status" varchar(32) NOT NULL, "review_status" varchar(32) NOT NULL,
  "summary" text NOT NULL, "extracted_text" text NOT NULL, "confidence" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "requirements_category_check" CHECK ("category" IN ('ADMINISTRATIVE', 'TECHNICAL', 'ECONOMIC', 'LEGAL', 'OTHER')),
  CONSTRAINT "requirements_type_check" CHECK ("requirement_type" IN ('MANDATORY', 'SCORABLE', 'INFORMATIONAL', 'UNKNOWN')),
  CONSTRAINT "requirements_source_status_check" CHECK ("source_status" IN ('CITED', 'NOT_VERIFIABLE')),
  CONSTRAINT "requirements_review_status_check" CHECK ("review_status" IN ('EXTRACTED', 'NEEDS_REVIEW')),
  CONSTRAINT "requirements_confidence_check" CHECK ("confidence" >= 0 AND "confidence" <= 100)
);
--> statement-breakpoint
CREATE TABLE "requirement_citations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "requirement_id" uuid NOT NULL REFERENCES "requirements"("id") ON DELETE cascade,
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "page_number" integer, "section_reference" varchar(255), "start_offset" integer, "end_offset" integer,
  "quoted_text" text NOT NULL, "verification_status" varchar(32) DEFAULT 'PENDING_REVIEW' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "requirement_citations_page_number_check" CHECK ("page_number" IS NULL OR "page_number" > 0),
  CONSTRAINT "requirement_citations_offsets_check" CHECK (("start_offset" IS NULL AND "end_offset" IS NULL) OR ("start_offset" >= 0 AND "end_offset" > "start_offset")),
  CONSTRAINT "requirement_citations_verification_check" CHECK ("verification_status" = 'PENDING_REVIEW')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_requirement_extractions_tenant_idempotency" ON "requirement_extractions" ("tenant_id", "idempotency_key");
CREATE INDEX "idx_requirement_extractions_tenant_document" ON "requirement_extractions" ("tenant_id", "document_version_id");
CREATE INDEX "idx_requirements_tenant_tender" ON "requirements" ("tenant_id", "tender_id");
CREATE INDEX "idx_requirements_tenant_extraction" ON "requirements" ("tenant_id", "extraction_id");
CREATE INDEX "idx_requirement_citations_tenant_requirement" ON "requirement_citations" ("tenant_id", "requirement_id");
CREATE INDEX "idx_requirement_citations_document_version" ON "requirement_citations" ("document_version_id");
--> statement-breakpoint
ALTER TABLE "requirement_extractions" ENABLE ROW LEVEL SECURITY; ALTER TABLE "requirement_extractions" FORCE ROW LEVEL SECURITY;
ALTER TABLE "requirements" ENABLE ROW LEVEL SECURITY; ALTER TABLE "requirements" FORCE ROW LEVEL SECURITY;
ALTER TABLE "requirement_citations" ENABLE ROW LEVEL SECURITY; ALTER TABLE "requirement_citations" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "requirement_extractions_current_tenant" ON "requirement_extractions" FOR ALL USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
CREATE POLICY "requirements_current_tenant" ON "requirements" FOR ALL USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
CREATE POLICY "requirement_citations_current_tenant" ON "requirement_citations" FOR ALL USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "requirement_extractions", "requirements", "requirement_citations" FROM app_runtime;
GRANT SELECT, INSERT ON TABLE "requirement_extractions", "requirements", "requirement_citations" TO app_runtime;
