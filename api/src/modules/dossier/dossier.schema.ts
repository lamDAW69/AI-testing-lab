import { z } from 'zod';

const EvidenceStatusSchema = z.enum(['VERIFIED', 'DECLARED', 'EXPIRED', 'PENDING_REVIEW', 'REJECTED']);
const ShortTextSchema = z.string().trim().min(1).max(255);
const OptionalTextSchema = z.string().trim().min(1).max(500).optional();
const DateSchema = z.string().date('La fecha debe tener formato YYYY-MM-DD');

export const CompanyProfileSchema = z.object({
  legalName: ShortTextSchema,
  taxId: z.string().trim().min(3).max(32).optional(),
  website: z.string().url().max(2048).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  cpvCodes: z.array(z.string().trim().regex(/^\d{8}$/)).max(50).default([]),
  territories: z.array(z.string().trim().min(2).max(100)).max(50).default([]),
  minContractCents: z.number().int().nonnegative().optional(),
  maxContractCents: z.number().int().positive().optional(),
  capacitySummary: z.string().trim().min(1).max(5000).optional(),
}).strict().superRefine((value, context) => {
  if (value.minContractCents !== undefined && value.maxContractCents !== undefined
    && value.minContractCents > value.maxContractCents) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['maxContractCents'],
      message: 'El importe máximo debe ser igual o superior al mínimo',
    });
  }
});

const CertificationFieldsSchema = z.object({
  name: ShortTextSchema,
  issuer: ShortTextSchema,
  certificateNumber: OptionalTextSchema,
  validFrom: DateSchema.optional(),
  validUntil: DateSchema.optional(),
  documentReference: OptionalTextSchema,
}).strict();

function validateCertificationDates(
  value: { validFrom?: string; validUntil?: string },
  context: z.RefinementCtx,
): void {
  if (value.validFrom && value.validUntil && value.validFrom > value.validUntil) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validUntil'],
      message: 'La vigencia final no puede ser anterior a la inicial',
    });
  }
}

export const CreateCertificationSchema = CertificationFieldsSchema.superRefine(validateCertificationDates);
export const UpdateCertificationSchema = CertificationFieldsSchema.partial().superRefine(validateCertificationDates).refine(
  (value) => Object.keys(value).length > 0,
  'Debes indicar al menos un campo para actualizar',
);
export const CertificationParamsSchema = z.object({ id: z.string().uuid() }).strict();

// Solo el proceso de revisión, que todavía no forma parte del MVP de Fase 1,
// podrá elevar este estado. Las rutas de edición aceptan declaraciones, nunca
// una afirmación de que han sido verificadas.
export const DeclaredEvidenceStatus = EvidenceStatusSchema.extract(['DECLARED']);

export type CompanyProfileInput = z.infer<typeof CompanyProfileSchema>;
export type CreateCertificationInput = z.infer<typeof CreateCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof UpdateCertificationSchema>;
