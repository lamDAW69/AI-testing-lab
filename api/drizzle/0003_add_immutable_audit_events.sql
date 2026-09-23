CREATE TABLE "agent_execution_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"execution_id" uuid NOT NULL,
	"correlation_id" uuid NOT NULL,
	"agent_name" varchar(100) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"model" varchar(100),
	"prompt_version" varchar(100),
	"tool_version" varchar(100),
	"input_hash" varchar(64),
	"output_hash" varchar(64),
	"duration_ms" integer,
	"cost_microunits" integer,
	"error_code" varchar(100),
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_type" varchar(20) NOT NULL,
	"actor_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"correlation_id" uuid NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_execution_events" ADD CONSTRAINT "agent_execution_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agent_execution_events_tenant_occurred" ON "agent_execution_events" USING btree ("tenant_id","occurred_at");--> statement-breakpoint
CREATE INDEX "idx_agent_execution_events_execution" ON "agent_execution_events" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "idx_agent_execution_events_correlation" ON "agent_execution_events" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "idx_audit_events_tenant_occurred" ON "audit_events" USING btree ("tenant_id","occurred_at");--> statement-breakpoint
CREATE INDEX "idx_audit_events_correlation" ON "audit_events" USING btree ("correlation_id");--> statement-breakpoint

ALTER TABLE "audit_events"
  ADD CONSTRAINT "audit_events_actor_type_check"
  CHECK ("actor_type" IN ('user', 'agent', 'system'));--> statement-breakpoint
ALTER TABLE "agent_execution_events"
  ADD CONSTRAINT "agent_execution_events_event_type_check"
  CHECK ("event_type" IN ('started', 'completed', 'failed', 'cancelled'));--> statement-breakpoint
ALTER TABLE "agent_execution_events"
  ADD CONSTRAINT "agent_execution_events_duration_nonnegative_check"
  CHECK ("duration_ms" IS NULL OR "duration_ms" >= 0);--> statement-breakpoint
ALTER TABLE "agent_execution_events"
  ADD CONSTRAINT "agent_execution_events_cost_nonnegative_check"
  CHECK ("cost_microunits" IS NULL OR "cost_microunits" >= 0);--> statement-breakpoint

-- El runtime solo puede añadir eventos. No existen políticas ni privilegios de
-- UPDATE/DELETE: una vez almacenado, un evento no se reescribe ni se elimina.
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_events" FORCE ROW LEVEL SECURITY;
ALTER TABLE "agent_execution_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agent_execution_events" FORCE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "audit_events_tenant_select" ON "audit_events"
  FOR SELECT
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
CREATE POLICY "audit_events_tenant_insert" ON "audit_events"
  FOR INSERT
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

CREATE POLICY "agent_execution_events_tenant_select" ON "agent_execution_events"
  FOR SELECT
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
CREATE POLICY "agent_execution_events_tenant_insert" ON "agent_execution_events"
  FOR INSERT
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

REVOKE ALL ON TABLE "audit_events", "agent_execution_events" FROM app_runtime;
GRANT SELECT, INSERT ON TABLE "audit_events", "agent_execution_events" TO app_runtime;
