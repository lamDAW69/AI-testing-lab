-- Dossier privado de empresa: datos declarados y certificaciones con vigencia.
-- No hay ninguna ruta que permita elevar evidence_status a VERIFIED; esa acción
-- llegará con una revisión/documento verificable en una fase posterior.
CREATE TABLE "company_profiles" (
  "tenant_id" uuid PRIMARY KEY NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "legal_name" varchar(255) NOT NULL,
  "tax_id" varchar(32),
  "website" varchar(2048),
  "description" text,
  "cpv_codes" text[] DEFAULT '{}'::text[] NOT NULL,
  "territories" text[] DEFAULT '{}'::text[] NOT NULL,
  "min_contract_cents" integer,
  "max_contract_cents" integer,
  "capacity_summary" text,
  "evidence_status" varchar(24) DEFAULT 'DECLARED' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "company_profiles_evidence_status_check"
    CHECK ("evidence_status" IN ('VERIFIED', 'DECLARED', 'EXPIRED', 'PENDING_REVIEW', 'REJECTED')),
  CONSTRAINT "company_profiles_contract_range_check"
    CHECK ("min_contract_cents" IS NULL OR "max_contract_cents" IS NULL OR "min_contract_cents" <= "max_contract_cents")
);
--> statement-breakpoint

CREATE TABLE "company_certifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "name" varchar(255) NOT NULL,
  "issuer" varchar(255) NOT NULL,
  "certificate_number" varchar(255),
  "valid_from" timestamp with time zone,
  "valid_until" timestamp with time zone,
  "document_reference" varchar(500),
  "evidence_status" varchar(24) DEFAULT 'DECLARED' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "company_certifications_evidence_status_check"
    CHECK ("evidence_status" IN ('VERIFIED', 'DECLARED', 'EXPIRED', 'PENDING_REVIEW', 'REJECTED')),
  CONSTRAINT "company_certifications_validity_check"
    CHECK ("valid_from" IS NULL OR "valid_until" IS NULL OR "valid_from" <= "valid_until")
);
--> statement-breakpoint

CREATE INDEX "idx_company_certifications_tenant_validity"
  ON "company_certifications" ("tenant_id", "valid_until");
--> statement-breakpoint

ALTER TABLE "tenant_memberships" DROP CONSTRAINT IF EXISTS "tenant_memberships_role_check";
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_role_check"
  CHECK ("role" IN ('owner', 'admin', 'analyst', 'reviewer', 'viewer', 'member'));
--> statement-breakpoint

ALTER TABLE "company_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_profiles" FORCE ROW LEVEL SECURITY;
ALTER TABLE "company_certifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_certifications" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY "company_profiles_current_tenant" ON "company_profiles"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
CREATE POLICY "company_certifications_current_tenant" ON "company_certifications"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint

REVOKE ALL ON TABLE "company_profiles", "company_certifications" FROM app_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE "company_profiles" TO app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "company_certifications" TO app_runtime;
