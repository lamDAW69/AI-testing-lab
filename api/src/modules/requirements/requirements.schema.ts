import { z } from 'zod';

const RequirementCategorySchema = z.enum(['ADMINISTRATIVE', 'TECHNICAL', 'ECONOMIC', 'LEGAL', 'OTHER']);
const RequirementTypeSchema = z.enum(['MANDATORY', 'SCORABLE', 'INFORMATIONAL', 'UNKNOWN']);
const SourceStatusSchema = z.enum(['CITED', 'NOT_VERIFIABLE']);

const CitationSchema = z.object({
  pageNumber: z.number().int().positive().optional(),
  sectionReference: z.string().trim().min(1).max(255).optional(),
  startOffset: z.number().int().nonnegative().optional(),
  endOffset: z.number().int().positive().optional(),
  quotedText: z.string().trim().min(3).max(4000),
}).strict().superRefine((value, context) => {
  const hasStart = value.startOffset !== undefined;
  const hasEnd = value.endOffset !== undefined;
  if (hasStart !== hasEnd || (hasStart && value.endOffset! <= value.startOffset!)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endOffset'],
      message: 'Los offsets deben aparecer juntos y delimitar un rango válido',
    });
  }
});

const ExtractedRequirementSchema = z.object({
  category: RequirementCategorySchema,
  requirementType: RequirementTypeSchema,
  sourceStatus: SourceStatusSchema,
  summary: z.string().trim().min(10).max(1500),
  extractedText: z.string().trim().min(3).max(6000),
  confidence: z.number().int().min(0).max(100),
  citations: z.array(CitationSchema).max(20),
}).strict().superRefine((value, context) => {
  if (value.sourceStatus === 'CITED' && value.citations.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['citations'],
      message: 'Un requisito citado debe incluir al menos una cita',
    });
  }
  if (value.sourceStatus === 'NOT_VERIFIABLE' && value.citations.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['citations'],
      message: 'Un requisito no verificable no puede incluir citas que aparenten respaldo',
    });
  }
});

export const SubmitExtractionSchema = z.object({
  idempotencyKey: z.string().uuid(),
  tenderId: z.string().uuid(),
  documentVersionId: z.string().uuid(),
  agent: z.object({
    name: z.string().trim().min(2).max(100),
    model: z.string().trim().min(1).max(100).optional(),
    promptVersion: z.string().trim().min(1).max(100),
    toolVersion: z.string().trim().min(1).max(100).optional(),
    durationMs: z.number().int().nonnegative().optional(),
    costMicrounits: z.number().int().nonnegative().optional(),
  }).strict(),
  requirements: z.array(ExtractedRequirementSchema).min(1).max(100),
}).strict();

export const RequirementIdParamsSchema = z.object({ id: z.string().uuid() }).strict();
export const ListRequirementsQuerySchema = z.object({
  tenderId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
}).strict();

export type SubmitExtractionInput = z.infer<typeof SubmitExtractionSchema>;
export type ExtractedRequirementInput = z.infer<typeof ExtractedRequirementSchema>;
export type ListRequirementsQuery = z.infer<typeof ListRequirementsQuerySchema>;
