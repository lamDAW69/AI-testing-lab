import { z } from 'zod';

export const DecisionFilterEnum = z.enum(['UNDECIDED', 'PURSUE', 'REVIEW', 'DISCARD']);
export type DecisionFilter = z.infer<typeof DecisionFilterEnum>;

export const EligibilityFilterEnum = z.enum([
  'PENDING',
  'ELIGIBLE',
  'POTENTIALLY_INELIGIBLE',
  'NEEDS_EXPERT_REVIEW',
]);
export type EligibilityFilter = z.infer<typeof EligibilityFilterEnum>;

export const InvalidationFilterEnum = z.enum(['VALID', 'STALE', 'REQUIRES_REANALYSIS']);
export type InvalidationFilter = z.infer<typeof InvalidationFilterEnum>;

export const PortfolioQueryFilterSchema = z
  .object({
    decision: DecisionFilterEnum.optional(),
    eligibilityStatus: EligibilityFilterEnum.optional(),
    invalidationStatus: InvalidationFilterEnum.optional(),
    cpv: z.string().trim().regex(/^\d{2,8}$/, 'El código CPV debe contener entre 2 y 8 dígitos').optional(),
    minAmountCents: z.coerce.number().int().min(0).optional(),
    maxAmountCents: z.coerce.number().int().min(0).optional(),
    deadlineBefore: z.string().datetime().optional(),
    deadlineAfter: z.string().datetime().optional(),
    hasBlockingReasons: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    search: z.string().trim().min(2).max(100).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    offset: z.coerce.number().int().min(0).optional().default(0),
  })
  .strict();
export type PortfolioQueryFilter = z.infer<typeof PortfolioQueryFilterSchema>;

export const PortfolioTenderIdParamsSchema = z
  .object({
    tenderId: z.string().uuid(),
  })
  .strict();
