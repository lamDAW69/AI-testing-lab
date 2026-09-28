import { z } from 'zod';

export const AlertTypeEnum = z.enum([
  'NEW_OPPORTUNITY',
  'DOCUMENT_CHANGED',
  'DEADLINE_APPROACHING',
  'ANALYSIS_COMPLETED',
  'ANALYSIS_FAILED',
  'DOSSIER_EXPIRED',
]);
export type AlertType = z.infer<typeof AlertTypeEnum>;

export const AlertSeverityEnum = z.enum(['INFO', 'WARNING', 'CRITICAL']);
export type AlertSeverity = z.infer<typeof AlertSeverityEnum>;

export const AlertStatusEnum = z.enum(['UNREAD', 'READ', 'DISMISSED']);
export type AlertStatus = z.infer<typeof AlertStatusEnum>;

export const AlertQueryFilterSchema = z
  .object({
    status: z.enum(['UNREAD', 'READ', 'DISMISSED', 'ALL']).optional().default('UNREAD'),
    severity: AlertSeverityEnum.optional(),
    alertType: AlertTypeEnum.optional(),
    tenderId: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    offset: z.coerce.number().int().min(0).optional().default(0),
  })
  .strict();
export type AlertQueryFilter = z.infer<typeof AlertQueryFilterSchema>;

export const CreateAlertInputSchema = z
  .object({
    tenderId: z.string().uuid(),
    analysisId: z.string().uuid().optional(),
    alertType: AlertTypeEnum,
    severity: AlertSeverityEnum.optional().default('INFO'),
    title: z.string().trim().min(3).max(255),
    message: z.string().trim().min(3).max(2000),
    metadata: z.record(z.unknown()).optional().default({}),
    deduplicationKey: z.string().trim().min(1).max(255),
  })
  .strict();
export type CreateAlertInput = z.infer<typeof CreateAlertInputSchema>;
