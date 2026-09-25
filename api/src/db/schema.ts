import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex, index, primaryKey, jsonb, bigint, boolean } from 'drizzle-orm/pg-core';

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

// ============================================================================
// DATOS GLOBALES PÚBLICOS (Fase 2 — Sin tenant_id, compartidos universalmente)
// ============================================================================

// 7. Fuentes oficiales de contratación (ej. ES_PLACSP, TED Europa, etc.)
export const procurementSources = pgTable('procurement_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  jurisdiction: varchar('jurisdiction', { length: 10 }).notNull().default('ES'),
  baseUrl: varchar('base_url', { length: 2048 }).notNull(),
  feedUrl: varchar('feed_url', { length: 2048 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Órganos de contratación / Entidades compradoras
export const contractingAuthorities = pgTable('contracting_authorities', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id')
    .notNull()
    .references(() => procurementSources.id, { onDelete: 'cascade' }),
  sourceAuthorityId: varchar('source_authority_id', { length: 100 }),
  name: varchar('name', { length: 255 }).notNull(),
  taxId: varchar('tax_id', { length: 32 }),
  buyerType: varchar('buyer_type', { length: 50 }).notNull().default('other'),
  postalCode: varchar('postal_code', { length: 20 }),
  city: varchar('city', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxSourceTax: index('idx_contracting_authorities_source_tax').on(table.sourceId, table.taxId),
  idxName: index('idx_contracting_authorities_name').on(table.name),
}));

// 9. Expedientes de licitación (Tenders)
export const tenders = pgTable('tenders', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id')
    .notNull()
    .references(() => procurementSources.id, { onDelete: 'cascade' }),
  authorityId: uuid('authority_id')
    .notNull()
    .references(() => contractingAuthorities.id, { onDelete: 'restrict' }),
  sourceTenderId: varchar('source_tender_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('PUBLISHED'),
  procedureType: varchar('procedure_type', { length: 50 }).notNull().default('OPEN'),
  contractType: varchar('contract_type', { length: 50 }).notNull().default('SERVICES'),
  estimatedValueCents: bigint('estimated_value_cents', { mode: 'number' }),
  budgetAmountCents: bigint('budget_amount_cents', { mode: 'number' }).notNull(),
  taxInclusiveAmountCents: bigint('tax_inclusive_amount_cents', { mode: 'number' }),
  currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
  mainCpvCode: varchar('main_cpv_code', { length: 20 }).notNull(),
  additionalCpvCodes: text('additional_cpv_codes').array().notNull().default([]),
  submissionDeadline: timestamp('submission_deadline', { withTimezone: true }),
  awardDate: timestamp('award_date', { withTimezone: true }),
  rawPayloadHash: varchar('raw_payload_hash', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uqSourceTender: uniqueIndex('uq_tenders_source_tender').on(table.sourceId, table.sourceTenderId),
  idxMainCpv: index('idx_tenders_main_cpv').on(table.mainCpvCode),
  idxStatusDeadline: index('idx_tenders_status_deadline').on(table.status, table.submissionDeadline),
  idxBudget: index('idx_tenders_budget').on(table.budgetAmountCents),
  idxAuthority: index('idx_tenders_authority').on(table.authorityId),
}));

// 10. Lotes independientes del contrato
export const tenderLots = pgTable('tender_lots', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenderId: uuid('tender_id')
    .notNull()
    .references(() => tenders.id, { onDelete: 'cascade' }),
  lotNumber: integer('lot_number').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  budgetAmountCents: bigint('budget_amount_cents', { mode: 'number' }),
  mainCpvCode: varchar('main_cpv_code', { length: 20 }),
  status: varchar('status', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uqTenderLot: uniqueIndex('uq_tender_lots_tender_number').on(table.tenderId, table.lotNumber),
}));

// 11. Documentos y pliegos rectores (Metadatos)
export const tenderDocuments = pgTable('tender_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenderId: uuid('tender_id')
    .notNull()
    .references(() => tenders.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'PCAP', 'PPT', 'NOTICE', 'AWARD_NOTICE', 'OTHER'
  name: varchar('name', { length: 255 }).notNull(),
  sourceDocumentId: varchar('source_document_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenderType: index('idx_tender_documents_tender_type').on(table.tenderId, table.documentType),
}));

// 12. Versiones físicas inmutables de los documentos (Inmutabilidad anti-sobrescritura)
export const tenderDocumentVersions = pgTable('tender_document_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id')
    .notNull()
    .references(() => tenderDocuments.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  url: varchar('url', { length: 2048 }).notNull(),
  contentHash: varchar('content_hash', { length: 64 }),
  mimeType: varchar('mime_type', { length: 100 }),
  byteSize: integer('byte_size'),
  rawStoragePath: varchar('raw_storage_path', { length: 1024 }),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uqDocVersion: uniqueIndex('uq_tender_doc_versions_doc_num').on(table.documentId, table.versionNumber),
  idxContentHash: index('idx_tender_doc_versions_hash').on(table.contentHash),
}));

// Snapshot inmutable del contenido que realmente vio el extractor. El binario
// original reside fuera de PostgreSQL en un volumen privado; en la base se
// conserva su huella y el texto trazable sobre el que se calculan las citas.
export const documentContentSnapshots = pgTable('document_content_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentVersionId: uuid('document_version_id')
    .notNull().references(() => tenderDocumentVersions.id, { onDelete: 'restrict' }),
  rawStoragePath: varchar('raw_storage_path', { length: 1024 }).notNull(),
  rawSha256: varchar('raw_sha256', { length: 64 }).notNull(),
  rawByteSize: integer('raw_byte_size').notNull(),
  extractedText: text('extracted_text').notNull(),
  extractedTextSha256: varchar('extracted_text_sha256', { length: 64 }).notNull(),
  extractionEngine: varchar('extraction_engine', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uqDocumentVersion: uniqueIndex('uq_document_content_snapshots_document_version')
    .on(table.documentVersionId),
  idxRawSha256: index('idx_document_content_snapshots_raw_sha256').on(table.rawSha256),
}));

// 13. Histórico de eventos del expediente
export const tenderEvents = pgTable('tender_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenderId: uuid('tender_id')
    .notNull()
    .references(() => tenders.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  rawPayload: jsonb('raw_payload').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTimeline: index('idx_tender_events_timeline').on(table.tenderId, table.eventDate),
}));

// 14. Catálogo canónico de códigos CPV
export const cpvCodes = pgTable('cpv_codes', {
  code: varchar('code', { length: 20 }).primaryKey(),
  description: text('description').notNull(),
  parentCode: varchar('parent_code', { length: 20 }),
});

// ============================================================================
// ANÁLISIS DOCUMENTAL PRIVADO POR TENANT (Fase 3)
// ============================================================================
export const requirementExtractions = pgTable('requirement_extractions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  idempotencyKey: uuid('idempotency_key').notNull(),
  tenderId: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  documentVersionId: uuid('document_version_id')
    .notNull().references(() => tenderDocumentVersions.id, { onDelete: 'restrict' }),
  agentName: varchar('agent_name', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }),
  promptVersion: varchar('prompt_version', { length: 100 }).notNull(),
  toolVersion: varchar('tool_version', { length: 100 }),
  inputHash: varchar('input_hash', { length: 64 }).notNull(),
  outputHash: varchar('output_hash', { length: 64 }).notNull(),
  durationMs: integer('duration_ms'),
  costMicrounits: integer('cost_microunits'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uqTenantIdempotency: uniqueIndex('uq_requirement_extractions_tenant_idempotency')
    .on(table.tenantId, table.idempotencyKey),
  idxTenantDocument: index('idx_requirement_extractions_tenant_document')
    .on(table.tenantId, table.documentVersionId),
}));

export const requirements = pgTable('requirements', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  extractionId: uuid('extraction_id')
    .notNull().references(() => requirementExtractions.id, { onDelete: 'cascade' }),
  tenderId: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  documentVersionId: uuid('document_version_id')
    .notNull().references(() => tenderDocumentVersions.id, { onDelete: 'restrict' }),
  category: varchar('category', { length: 32 }).notNull(),
  requirementType: varchar('requirement_type', { length: 32 }).notNull(),
  sourceStatus: varchar('source_status', { length: 32 }).notNull(),
  reviewStatus: varchar('review_status', { length: 32 }).notNull(),
  summary: text('summary').notNull(),
  extractedText: text('extracted_text').notNull(),
  confidence: integer('confidence').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenantTender: index('idx_requirements_tenant_tender').on(table.tenantId, table.tenderId),
  idxTenantExtraction: index('idx_requirements_tenant_extraction').on(table.tenantId, table.extractionId),
}));

export const requirementCitations = pgTable('requirement_citations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  requirementId: uuid('requirement_id').notNull().references(() => requirements.id, { onDelete: 'cascade' }),
  documentVersionId: uuid('document_version_id')
    .notNull().references(() => tenderDocumentVersions.id, { onDelete: 'restrict' }),
  pageNumber: integer('page_number'),
  sectionReference: varchar('section_reference', { length: 255 }),
  startOffset: integer('start_offset'),
  endOffset: integer('end_offset'),
  quotedText: text('quoted_text').notNull(),
  verificationStatus: varchar('verification_status', { length: 32 }).notNull().default('PENDING_REVIEW'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  idxTenantRequirement: index('idx_requirement_citations_tenant_requirement')
    .on(table.tenantId, table.requirementId),
  idxDocumentVersion: index('idx_requirement_citations_document_version').on(table.documentVersionId),
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

export type ProcurementSource = typeof procurementSources.$inferSelect;
export type NewProcurementSource = typeof procurementSources.$inferInsert;

export type ContractingAuthority = typeof contractingAuthorities.$inferSelect;
export type NewContractingAuthority = typeof contractingAuthorities.$inferInsert;

export type Tender = typeof tenders.$inferSelect;
export type NewTender = typeof tenders.$inferInsert;

export type TenderLot = typeof tenderLots.$inferSelect;
export type NewTenderLot = typeof tenderLots.$inferInsert;

export type TenderDocument = typeof tenderDocuments.$inferSelect;
export type NewTenderDocument = typeof tenderDocuments.$inferInsert;

export type TenderDocumentVersion = typeof tenderDocumentVersions.$inferSelect;
export type NewTenderDocumentVersion = typeof tenderDocumentVersions.$inferInsert;
export type DocumentContentSnapshot = typeof documentContentSnapshots.$inferSelect;

export type TenderEvent = typeof tenderEvents.$inferSelect;
export type NewTenderEvent = typeof tenderEvents.$inferInsert;

export type CpvCode = typeof cpvCodes.$inferSelect;
export type NewCpvCode = typeof cpvCodes.$inferInsert;

export type RequirementExtraction = typeof requirementExtractions.$inferSelect;
export type Requirement = typeof requirements.$inferSelect;
export type RequirementCitation = typeof requirementCitations.$inferSelect;
