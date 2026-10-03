-- Fase 2: Soporte para sincronización continua y consultas por fecha de publicación oficial en PLACSP
-- 1. Ampliación de la tabla tenders con fecha de publicación oficial y actualización de origen

ALTER TABLE "tenders"
  ADD COLUMN IF NOT EXISTS "publication_date" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "source_updated_at" timestamp with time zone;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_publication_date"
  ON "tenders" ("publication_date" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_submission_deadline"
  ON "tenders" ("submission_deadline" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_tenders_pub_cpv"
  ON "tenders" ("publication_date" DESC, "main_cpv_code");
--> statement-breakpoint

-- 2. Tabla durable de estados y cursores de sincronización (ingestion_sync_states)
CREATE TABLE IF NOT EXISTS "ingestion_sync_states" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_code" varchar(50) NOT NULL,
  "job_type" varchar(50) NOT NULL,
  "current_page_url" varchar(2048) NOT NULL,
  "next_page_url" varchar(2048),
  "oldest_processed_date" timestamp with time zone,
  "newest_processed_date" timestamp with time zone,
  "cutoff_date" timestamp with time zone,
  "pages_processed" integer DEFAULT 0 NOT NULL,
  "tenders_scanned" integer DEFAULT 0 NOT NULL,
  "tenders_persisted" integer DEFAULT 0 NOT NULL,
  "status" varchar(30) DEFAULT 'IDLE' NOT NULL,
  "last_error" text,
  "started_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_ingestion_sync_source_job" UNIQUE ("source_code", "job_type")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_ingestion_sync_status"
  ON "ingestion_sync_states" ("status");
--> statement-breakpoint

-- 3. Permisos de seguridad para el rol de ejecución de la aplicación (app_runtime)
REVOKE ALL ON TABLE "ingestion_sync_states" FROM app_runtime;
--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE ON TABLE "ingestion_sync_states" TO app_runtime;
--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE ON TABLE "tenders" TO app_runtime;
