-- Fase 2: Modelo de datos global público para contratación oficial (PLACSP)
-- Tablas globales sin aislamiento por tenant, de consulta pública y persistencia inmutable.

CREATE TABLE IF NOT EXISTS "procurement_sources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" varchar(50) NOT NULL,
  "name" varchar(255) NOT NULL,
  "jurisdiction" varchar(10) DEFAULT 'ES' NOT NULL,
  "base_url" varchar(2048) NOT NULL,
  "feed_url" varchar(2048),
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_procurement_sources_code" UNIQUE ("code")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "contracting_authorities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_id" uuid NOT NULL REFERENCES "procurement_sources"("id") ON DELETE cascade,
  "source_authority_id" varchar(100),
  "name" varchar(255) NOT NULL,
  "tax_id" varchar(32),
  "buyer_type" varchar(50) DEFAULT 'other' NOT NULL,
  "postal_code" varchar(20),
  "city" varchar(100),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_contracting_authorities_source_tax"
  ON "contracting_authorities" ("source_id", "tax_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_contracting_authorities_name"
  ON "contracting_authorities" ("name");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tenders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_id" uuid NOT NULL REFERENCES "procurement_sources"("id") ON DELETE cascade,
  "authority_id" uuid NOT NULL REFERENCES "contracting_authorities"("id") ON DELETE restrict,
  "source_tender_id" varchar(255) NOT NULL,
  "title" varchar(500) NOT NULL,
  "description" text,
  "status" varchar(50) DEFAULT 'PUBLISHED' NOT NULL,
  "procedure_type" varchar(50) DEFAULT 'OPEN' NOT NULL,
  "contract_type" varchar(50) DEFAULT 'SERVICES' NOT NULL,
  "estimated_value_cents" bigint,
  "budget_amount_cents" bigint NOT NULL,
  "tax_inclusive_amount_cents" bigint,
  "currency" varchar(3) DEFAULT 'EUR' NOT NULL,
  "main_cpv_code" varchar(20) NOT NULL,
  "additional_cpv_codes" text[] DEFAULT '{}'::text[] NOT NULL,
  "submission_deadline" timestamp with time zone,
  "award_date" timestamp with time zone,
  "raw_payload_hash" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_tenders_source_tender" UNIQUE ("source_id", "source_tender_id")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_main_cpv"
  ON "tenders" ("main_cpv_code");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_status_deadline"
  ON "tenders" ("status", "submission_deadline");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_budget"
  ON "tenders" ("budget_amount_cents");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_authority"
  ON "tenders" ("authority_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tender_lots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "lot_number" integer NOT NULL,
  "title" varchar(500) NOT NULL,
  "description" text,
  "budget_amount_cents" bigint,
  "main_cpv_code" varchar(20),
  "status" varchar(50),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_tender_lots_tender_number" UNIQUE ("tender_id", "lot_number")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tender_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "document_type" varchar(50) NOT NULL,
  "name" varchar(255) NOT NULL,
  "source_document_id" varchar(255),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tender_documents_tender_type"
  ON "tender_documents" ("tender_id", "document_type");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tender_document_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "document_id" uuid NOT NULL REFERENCES "tender_documents"("id") ON DELETE cascade,
  "version_number" integer NOT NULL,
  "url" varchar(2048) NOT NULL,
  "content_hash" varchar(64),
  "mime_type" varchar(100),
  "byte_size" integer,
  "raw_storage_path" varchar(1024),
  "fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_tender_doc_versions_doc_num" UNIQUE ("document_id", "version_number")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tender_doc_versions_hash"
  ON "tender_document_versions" ("content_hash");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tender_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tender_id" uuid NOT NULL REFERENCES "tenders"("id") ON DELETE cascade,
  "event_type" varchar(50) NOT NULL,
  "event_date" timestamp with time zone NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tender_events_timeline"
  ON "tender_events" ("tender_id", "event_date");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "cpv_codes" (
  "code" varchar(20) PRIMARY KEY NOT NULL,
  "description" text NOT NULL,
  "parent_code" varchar(20)
);
--> statement-breakpoint

-- Asignación de permisos al rol de ejecución de la aplicación (app_runtime)
REVOKE ALL ON TABLE "procurement_sources", "contracting_authorities", "tenders", "tender_lots", "tender_documents", "tender_document_versions", "tender_events", "cpv_codes" FROM app_runtime;
--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE ON TABLE "procurement_sources", "contracting_authorities", "tenders", "tender_lots", "tender_documents", "tender_document_versions", "tender_events", "cpv_codes" TO app_runtime;
