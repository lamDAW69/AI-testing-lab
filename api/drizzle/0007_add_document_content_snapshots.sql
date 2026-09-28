-- El binario se guarda en un volumen privado; este registro fija el contenido
-- exacto empleado por los agentes y evita que una URL mutable altere citas ya
-- emitidas.
CREATE TABLE "document_content_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "document_version_id" uuid NOT NULL REFERENCES "tender_document_versions"("id") ON DELETE restrict,
  "raw_storage_path" varchar(1024) NOT NULL,
  "raw_sha256" varchar(64) NOT NULL,
  "raw_byte_size" integer NOT NULL,
  "extracted_text" text NOT NULL,
  "extracted_text_sha256" varchar(64) NOT NULL,
  "extraction_engine" varchar(100) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "document_content_snapshots_raw_size_check" CHECK ("raw_byte_size" > 0),
  CONSTRAINT "document_content_snapshots_raw_hash_check" CHECK ("raw_sha256" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "document_content_snapshots_text_hash_check" CHECK ("extracted_text_sha256" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "document_content_snapshots_text_not_empty_check" CHECK (length("extracted_text") > 0)
);

CREATE UNIQUE INDEX "uq_document_content_snapshots_document_version"
  ON "document_content_snapshots" ("document_version_id");
CREATE INDEX "idx_document_content_snapshots_raw_sha256"
  ON "document_content_snapshots" ("raw_sha256");

-- Los snapshots son una evidencia append-only: la cuenta de ejecución puede
-- crearlos una sola vez, pero no sustituir ni borrar el contenido analizado.
REVOKE ALL ON TABLE "document_content_snapshots" FROM app_runtime;
GRANT SELECT, INSERT ON TABLE "document_content_snapshots" TO app_runtime;
