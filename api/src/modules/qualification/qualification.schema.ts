import { z } from 'zod';

export const AssessmentStatusEnum = z.enum([
  'SUPPORTED',
  'NOT_SUPPORTED',
  'UNKNOWN',
  'CONFLICTING',
  'NOT_APPLICABLE',
  'NEEDS_EXPERT_REVIEW',
]);
export type AssessmentStatus = z.infer<typeof AssessmentStatusEnum>;

export const EvidenceSourceTypeEnum = z.enum([
  'CERTIFICATION',
  'COMPANY_PROFILE',
  'DOSSIER_ITEM',
  'EXPERIENCE',
]);
export type EvidenceSourceType = z.infer<typeof EvidenceSourceTypeEnum>;

export const MatchTypeEnum = z.enum([
  'SUPPORTS',
  'CONTRADICTS',
  'PARTIAL',
  'INCONCLUSIVE',
]);
export type MatchType = z.infer<typeof MatchTypeEnum>;

export const EligibilityStatusEnum = z.enum([
  'PENDING',
  'ELIGIBLE',
  'POTENTIALLY_INELIGIBLE',
  'NEEDS_EXPERT_REVIEW',
]);
export type EligibilityStatus = z.infer<typeof EligibilityStatusEnum>;

export const AnalysisDecisionTypeEnum = z.enum([
  'UNDECIDED',
  'PURSUE',
  'REVIEW',
  'DISCARD',
]);
export type AnalysisDecisionType = z.infer<typeof AnalysisDecisionTypeEnum>;

// ============================================================================
// DIMENSIONES EXPLICABLES (Sin scores mágicos)
// ============================================================================

export const PotentialEligibilityDimensionSchema = z.object({
  status: EligibilityStatusEnum,
  blockingReasons: z.array(z.string()),
  warnings: z.array(z.string()),
}).strict();

export const TechnicalFitDimensionSchema = z.object({
  score: z.enum(['HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT_EVIDENCE']),
  supportedCount: z.number().int().nonnegative(),
  notSupportedCount: z.number().int().nonnegative(),
  unknownCount: z.number().int().nonnegative(),
  totalTechnicalCount: z.number().int().nonnegative(),
  ratio: z.number().min(0).max(1),
}).strict();

export const EconomicFitDimensionSchema = z.object({
  score: z.enum(['HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT_EVIDENCE']),
  budgetEur: z.number().nonnegative(),
  minContractEur: z.number().nonnegative().optional(),
  maxContractEur: z.number().nonnegative().optional(),
  commentary: z.string(),
}).strict();

export const OperationalCapacityDimensionSchema = z.object({
  status: z.enum(['ADEQUATE', 'CONSTRAINED', 'UNKNOWN']),
  territoryMatch: z.boolean(),
  territoryNotes: z.string(),
}).strict();

export const ContractualRiskDimensionSchema = z.object({
  level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  reasons: z.array(z.string()),
}).strict();

export const DeadlineFitDimensionSchema = z.object({
  status: z.enum(['FEASIBLE', 'TIGHT', 'EXPIRED', 'UNKNOWN']),
  daysRemaining: z.number().int().optional(),
  deadline: z.string().optional(),
}).strict();

export const EvidenceCoverageDimensionSchema = z.object({
  level: z.enum(['FULL', 'PARTIAL', 'MINIMAL', 'NONE']),
  verifiedCount: z.number().int().nonnegative(),
  declaredCount: z.number().int().nonnegative(),
  missingCount: z.number().int().nonnegative(),
  coverageRatio: z.number().min(0).max(1),
}).strict();

export const OpportunityDimensionsSchema = z.object({
  potentialEligibility: PotentialEligibilityDimensionSchema,
  technicalFit: TechnicalFitDimensionSchema,
  economicFit: EconomicFitDimensionSchema,
  operationalCapacity: OperationalCapacityDimensionSchema,
  contractualRisk: ContractualRiskDimensionSchema,
  deadlineFit: DeadlineFitDimensionSchema,
  evidenceCoverage: EvidenceCoverageDimensionSchema,
}).strict();
export type OpportunityDimensions = z.infer<typeof OpportunityDimensionsSchema>;

// ============================================================================
// CONTRATOS API
// ============================================================================

export const CreateOpportunityAnalysisSchema = z.object({
  idempotencyKey: z.string().uuid(),
  tenderId: z.string().uuid(),
  documentVersionId: z.string().uuid(),
}).strict();
export type CreateOpportunityAnalysisInput = z.infer<typeof CreateOpportunityAnalysisSchema>;

export const OpportunityAnalysisIdParamsSchema = z.object({
  id: z.string().uuid(),
}).strict();
export type OpportunityAnalysisIdParams = z.infer<typeof OpportunityAnalysisIdParamsSchema>;

export const CreateAnalysisDecisionSchema = z.object({
  decision: AnalysisDecisionTypeEnum,
  rationale: z.string().trim().min(5).max(5000),
}).strict();
export type CreateAnalysisDecisionInput = z.infer<typeof CreateAnalysisDecisionSchema>;

export const CreateDossierItemSchema = z.object({
  category: z.enum(['TECHNICAL', 'ECONOMIC', 'LEGAL', 'ADMINISTRATIVE', 'EXPERIENCE']),
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(5).max(5000),
  documentReference: z.string().trim().min(1).max(500).optional(),
  validUntil: z.string().date().optional(),
}).strict();
export type CreateDossierItemInput = z.infer<typeof CreateDossierItemSchema>;

export const UpdateDossierItemSchema = CreateDossierItemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debes proporcionar al menos un campo a modificar' },
);
export type UpdateDossierItemInput = z.infer<typeof UpdateDossierItemSchema>;

export const DossierItemIdParamsSchema = z.object({
  id: z.string().uuid(),
}).strict();
