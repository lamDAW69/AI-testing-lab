import { z } from 'zod';

export const TenderStatusEnum = z.enum([
  'PUBLISHED',
  'EVALUATION',
  'AWARDED',
  'RESOLVED',
  'CANCELLED',
]);
export type TenderStatus = z.infer<typeof TenderStatusEnum>;

export const ProcedureTypeEnum = z.enum([
  'OPEN',
  'RESTRICTED',
  'NEGOTIATED_WITHOUT_ADVERTISING',
  'SIMPLIFIED_OPEN',
  'OTHER',
]);
export type ProcedureType = z.infer<typeof ProcedureTypeEnum>;

export const ContractTypeEnum = z.enum([
  'SERVICES',
  'SUPPLIES',
  'WORKS',
  'OTHER',
]);
export type ContractType = z.infer<typeof ContractTypeEnum>;

export const DocumentTypeEnum = z.enum([
  'PCAP',
  'PPT',
  'NOTICE',
  'AWARD_NOTICE',
  'OTHER',
]);
export type DocumentType = z.infer<typeof DocumentTypeEnum>;

export const TenderEventTypeEnum = z.enum([
  'PUBLICATION',
  'AMENDMENT',
  'SUBMISSION_DEADLINE_EXTENDED',
  'BID_OPENING',
  'AWARD',
  'RESOLUTION',
  'CANCELLATION',
]);
export type TenderEventType = z.infer<typeof TenderEventTypeEnum>;

export const BuyerTypeEnum = z.enum([
  'central',
  'regional',
  'local',
  'public_entity',
  'other',
]);
export type BuyerType = z.infer<typeof BuyerTypeEnum>;

// Esquema de entrada de autoridad convocante
export const AuthorityInputSchema = z.object({
  sourceAuthorityId: z.string().max(100).optional(),
  name: z.string().min(2).max(255),
  taxId: z.string().max(32).optional(),
  buyerType: BuyerTypeEnum.default('other'),
  postalCode: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
}).strict();
export type AuthorityInput = z.infer<typeof AuthorityInputSchema>;

// Esquema de lote del contrato
export const LotInputSchema = z.object({
  lotNumber: z.number().int().positive(),
  title: z.string().min(2).max(500),
  description: z.string().optional(),
  budgetAmountCents: z.number().int().nonnegative().optional(),
  mainCpvCode: z.string().max(20).optional(),
  status: z.string().max(50).optional(),
}).strict();
export type LotInput = z.infer<typeof LotInputSchema>;

// Esquema de documento y su versión inicial
export const DocumentInputSchema = z.object({
  documentType: DocumentTypeEnum,
  name: z.string().min(2).max(255),
  sourceDocumentId: z.string().max(255).optional(),
  url: z.string().url().max(2048),
  contentHash: z.string().length(64).optional(),
  mimeType: z.string().max(100).optional(),
  byteSize: z.number().int().positive().optional(),
  rawStoragePath: z.string().max(1024).optional(),
}).strict();
export type DocumentInput = z.infer<typeof DocumentInputSchema>;

// Esquema de evento histórico
export const EventInputSchema = z.object({
  eventType: TenderEventTypeEnum,
  eventDate: z.string().datetime({ message: 'eventDate debe ser formato ISO-8601 con zona horaria' }),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  rawPayload: z.record(z.unknown()).default({}),
}).strict();
export type EventInput = z.infer<typeof EventInputSchema>;

// Esquema completo de expediente normalizado de la PLACSP
export const PlacspTenderInputSchema = z.object({
  sourceCode: z.string().min(2).max(50).default('ES_PLACSP'),
  sourceTenderId: z.string().min(1).max(255),
  title: z.string().min(2).max(500),
  description: z.string().optional(),
  status: TenderStatusEnum.default('PUBLISHED'),
  procedureType: ProcedureTypeEnum.default('OPEN'),
  contractType: ContractTypeEnum.default('SERVICES'),
  estimatedValueCents: z.number().int().nonnegative().optional(),
  budgetAmountCents: z.number().int().nonnegative(),
  taxInclusiveAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('EUR'),
  mainCpvCode: z.string().regex(/^\d{8}$/, 'El código CPV debe constar de 8 dígitos numéricos'),
  additionalCpvCodes: z.array(z.string()).default([]),
  submissionDeadline: z.string().datetime().optional(),
  awardDate: z.string().datetime().optional(),
  authority: AuthorityInputSchema,
  lots: z.array(LotInputSchema).default([]),
  documents: z.array(DocumentInputSchema).default([]),
  events: z.array(EventInputSchema).default([]),
}).strict();
export type PlacspTenderInput = z.infer<typeof PlacspTenderInputSchema>;

// Esquema de filtros deterministas para búsqueda en el catálogo público
export const TenderQueryFilterSchema = z.object({
  cpv: z.string().max(20).optional(),
  status: TenderStatusEnum.optional(),
  contractType: ContractTypeEnum.optional(),
  procedureType: ProcedureTypeEnum.optional(),
  minBudget: z.coerce.number().int().nonnegative().optional(),
  maxBudget: z.coerce.number().int().nonnegative().optional(),
  deadlineFrom: z.string().datetime().optional(),
  deadlineTo: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();
export type TenderQueryFilter = z.infer<typeof TenderQueryFilterSchema>;

// Esquema de entrada para el job de ingesta manual/programada
export const IngestionJobInputSchema = z.object({
  tenders: z.array(PlacspTenderInputSchema).min(1, 'Debe incluir al menos un expediente a procesar'),
}).strict();
export type IngestionJobInput = z.infer<typeof IngestionJobInputSchema>;
