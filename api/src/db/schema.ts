import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex, index, primaryKey, jsonb } from 'drizzle-orm/pg-core';

// 1. Tabla de Organizaciones / Clientes (Tenants)
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Tabla intermedia que asocia usuarios (Supabase auth.users) con Tenants
export const tenantMemberships = pgTable('tenant_memberships', {
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(), // Corresponde al claim 'sub' del JWT de Supabase
  role: varchar('role', { length: 50 }).notNull().default('member'), // 'owner', 'admin', 'member'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.tenantId, table.userId] }),
  idxUserId: index('idx_memberships_user_id').on(table.userId),
}));

// 3. Tabla de Productos (Recurso Multi-Tenant con Aislamiento Estricto)
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Anti-BOLA / Rendimiento: Índice compuesto que inicia por tenant_id
  idxTenantId: index('idx_products_tenant_id').on(table.tenantId),
  idxTenantCreated: index('idx_products_tenant_created').on(table.tenantId, table.createdAt),
  // SKU único únicamente dentro del inquilino correspondiente
  uqTenantSku: uniqueIndex('uq_products_tenant_sku').on(table.tenantId, table.sku),
}));

// 4. Dossier privado de la empresa. Una organización tiene un único perfil
// canónico; las evidencias se modelan aparte para que no se marquen como
// verificadas por el simple hecho de ser declaradas por un usuario.
export const companyProfiles = pgTable('company_profiles', {
  tenantId: uuid('tenant_id')
    .primaryKey()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  legalName: varchar('legal_name', { length: 255 }).notNull(),
  taxId: varchar('tax_id', { length: 32 }),
  website: varchar('website', { length: 2048 }),
  description: text('description'),
  cpvCodes: text('cpv_codes').array().notNull().default([]),
  territories: text('territories').array().notNull().default([]),
  minContractCents: integer('min_contract_cents'),
  maxContractCents: integer('max_contract_cents'),
  capacitySummary: text('capacity_summary'),
  evidenceStatus: varchar('evidence_status', { length: 24 }).notNull().default('DECLARED'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const companyCertifications = pgTable('company_certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  certificateNumber: varchar('certificate_number', { length: 255 }),
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  documentReference: varchar('document_reference', { length: 500 }),
  evidenceStatus: varchar('evidence_status', { length: 24 }).notNull().default('DECLARED'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenantValidity: index('idx_company_certifications_tenant_validity').on(table.tenantId, table.validUntil),
}));

// 5. Auditoría append-only: no contiene tokens, secretos ni contenido documental.
export const auditEvents = pgTable('audit_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  actorType: varchar('actor_type', { length: 20 }).notNull(),
  actorId: uuid('actor_id'),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  correlationId: uuid('correlation_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenantOccurred: index('idx_audit_events_tenant_occurred').on(table.tenantId, table.occurredAt),
  idxCorrelation: index('idx_audit_events_correlation').on(table.correlationId),
}));

// 6. Trazas append-only de agentes. Un executionId agrupa sus eventos sin
// permitir que una ejecución ya registrada sea reescrita silenciosamente.
export const agentExecutionEvents = pgTable('agent_execution_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  executionId: uuid('execution_id').notNull(),
  correlationId: uuid('correlation_id').notNull(),
  agentName: varchar('agent_name', { length: 100 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  model: varchar('model', { length: 100 }),
  promptVersion: varchar('prompt_version', { length: 100 }),
  toolVersion: varchar('tool_version', { length: 100 }),
  inputHash: varchar('input_hash', { length: 64 }),
  outputHash: varchar('output_hash', { length: 64 }),
  durationMs: integer('duration_ms'),
  costMicrounits: integer('cost_microunits'),
  errorCode: varchar('error_code', { length: 100 }),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenantOccurred: index('idx_agent_execution_events_tenant_occurred').on(table.tenantId, table.occurredAt),
  idxExecution: index('idx_agent_execution_events_execution').on(table.executionId),
  idxCorrelation: index('idx_agent_execution_events_correlation').on(table.correlationId),
}));

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type TenantMembership = typeof tenantMemberships.$inferSelect;
export type NewTenantMembership = typeof tenantMemberships.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type NewCompanyProfile = typeof companyProfiles.$inferInsert;
export type CompanyCertification = typeof companyCertifications.$inferSelect;
export type NewCompanyCertification = typeof companyCertifications.$inferInsert;

export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;
export type AgentExecutionEvent = typeof agentExecutionEvents.$inferSelect;
export type NewAgentExecutionEvent = typeof agentExecutionEvents.$inferInsert;
