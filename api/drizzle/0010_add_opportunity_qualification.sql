CREATE TABLE "company_dossier_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "category" varchar(50) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "document_reference" varchar(500),
  "evidence_status" varchar(32) DEFAULT 'DECLARED' NOT NULL,
  "valid_until" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "company_dossier_items_category_check" CHECK ("category" IN ('TECHNICAL', 'ECONOMIC', 'LEGAL', 'ADMINISTRATIVE', 'EXPERIENCE')),
  CONSTRAINT "company_dossier_items_evidence_status_check" CHECK ("evidence_status" IN ('DECLARED', 'VERIFIED', 'EXPIRED'))
);
--> statement-breakpoint
CREATE INDEX "idx_company_dossier_items_tenant_cat" ON "company_dossier_items" ("tenant_id", "category");
--> statement-breakpoint
ALTER TABLE "company_dossier_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_dossier_items" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "company_dossier_items_current_tenant" ON "company_dossier_items"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "company_dossier_items" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "company_dossier_items" TO app_runtime;

--> statement-breakpoint
CREATE TABLE "opportunity_analyses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "idempotency_key" uuid NOT NULL,
  "status" varchar(32) DEFAULT 'PENDING' NOT NULL,
  "eligibility_status" varchar(32) DEFAULT 'PENDING' NOT NULL,
  "dimensions" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "summary" text,
  "blocking_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "opportunity_analyses_status_check" CHECK ("status" IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  CONSTRAINT "opportunity_analyses_eligibility_status_check" CHECK ("eligibility_status" IN ('PENDING', 'ELIGIBLE', 'POTENTIALLY_INELIGIBLE', 'NEEDS_EXPERT_REVIEW'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_opportunity_analyses_tenant_idempotency" ON "opportunity_analyses" ("tenant_id", "idempotency_key");
CREATE INDEX "idx_opportunity_analyses_tenant_tender" ON "opportunity_analyses" ("tenant_id", "tender_id");
CREATE INDEX "idx_opportunity_analyses_tenant_status" ON "opportunity_analyses" ("tenant_id", "status");
CREATE INDEX "idx_opportunity_analyses_tenant_doc" ON "opportunity_analyses" ("tenant_id", "document_version_id");
--> statement-breakpoint
ALTER TABLE "opportunity_analyses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "opportunity_analyses" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "opportunity_analyses_current_tenant" ON "opportunity_analyses"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "opportunity_analyses" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "opportunity_analyses" TO app_runtime;

--> statement-breakpoint
CREATE TABLE "requirement_assessments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "analysis_id" uuid NOT NULL REFERENCES "opportunity_analyses"("id") ON DELETE cascade,
  "requirement_id" uuid NOT NULL REFERENCES "requirements"("id") ON DELETE cascade,
  "status" varchar(32) NOT NULL,
  "confidence" integer NOT NULL,
  "rationale" text NOT NULL,
  "is_blocking" boolean DEFAULT false NOT NULL,
  "agent_name" varchar(100),
  "model" varchar(100),
  "prompt_version" varchar(100),
  "duration_ms" integer,
  "cost_microunits" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "requirement_assessments_status_check" CHECK ("status" IN ('SUPPORTED', 'NOT_SUPPORTED', 'UNKNOWN', 'CONFLICTING', 'NOT_APPLICABLE', 'NEEDS_EXPERT_REVIEW')),
  CONSTRAINT "requirement_assessments_confidence_check" CHECK ("confidence" >= 0 AND "confidence" <= 100)
);
--> statement-breakpoint
CREATE INDEX "idx_requirement_assessments_tenant_analysis" ON "requirement_assessments" ("tenant_id", "analysis_id");
CREATE INDEX "idx_requirement_assessments_tenant_req" ON "requirement_assessments" ("tenant_id", "requirement_id");
--> statement-breakpoint
ALTER TABLE "requirement_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "requirement_assessments" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "requirement_assessments_current_tenant" ON "requirement_assessments"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "requirement_assessments" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "requirement_assessments" TO app_runtime;

--> statement-breakpoint
CREATE TABLE "assessment_evidence" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "assessment_id" uuid NOT NULL REFERENCES "requirement_assessments"("id") ON DELETE cascade,
  "source_type" varchar(50) NOT NULL,
  "source_id" varchar(100),
  "source_title" varchar(255) NOT NULL,
  "match_type" varchar(32) NOT NULL,
  "excerpt" text NOT NULL,
  "confidence" integer NOT NULL,
  "valid_until" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "assessment_evidence_source_type_check" CHECK ("source_type" IN ('CERTIFICATION', 'COMPANY_PROFILE', 'DOSSIER_ITEM', 'EXPERIENCE')),
  CONSTRAINT "assessment_evidence_match_type_check" CHECK ("match_type" IN ('SUPPORTS', 'CONTRADICTS', 'PARTIAL', 'INCONCLUSIVE')),
  CONSTRAINT "assessment_evidence_confidence_check" CHECK ("confidence" >= 0 AND "confidence" <= 100)
);
--> statement-breakpoint
CREATE INDEX "idx_assessment_evidence_tenant_assessment" ON "assessment_evidence" ("tenant_id", "assessment_id");
--> statement-breakpoint
ALTER TABLE "assessment_evidence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assessment_evidence" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "assessment_evidence_current_tenant" ON "assessment_evidence"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "assessment_evidence" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "assessment_evidence" TO app_runtime;

--> statement-breakpoint
CREATE TABLE "analysis_decisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "analysis_id" uuid NOT NULL REFERENCES "opportunity_analyses"("id") ON DELETE cascade,
  "decision" varchar(32) NOT NULL,
  "rationale" text NOT NULL,
  "decided_by" uuid NOT NULL,
  "decided_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "analysis_decisions_decision_check" CHECK ("decision" IN ('UNDECIDED', 'PURSUE', 'REVIEW', 'DISCARD'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_analysis_decisions_tenant_analysis" ON "analysis_decisions" ("tenant_id", "analysis_id");
CREATE INDEX "idx_analysis_decisions_tenant_decision" ON "analysis_decisions" ("tenant_id", "decision");
--> statement-breakpoint
ALTER TABLE "analysis_decisions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "analysis_decisions" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "analysis_decisions_current_tenant" ON "analysis_decisions"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint
REVOKE ALL ON TABLE "analysis_decisions" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "analysis_decisions" TO app_runtime;
