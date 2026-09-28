import type { EligibilityStatus } from './qualification.schema.js';

export interface TenderContextForGates {
  status: string;
  submissionDeadline: Date | string | null;
  estimatedValueCents: number | null;
  locationCode?: string | null;
  title: string;
}

export interface CompanyProfileForGates {
  minContractCents?: number | null;
  maxContractCents?: number | null;
  territories: string[];
}

export interface RequirementEvaluationForGates {
  requirementId: string;
  requirementType: string;
  category: string;
  summary: string;
  status: string;
  hasEvidence: boolean;
}

export interface DeterministicGatesResult {
  eligibilityStatus: EligibilityStatus;
  blockingReasons: string[];
  warnings: string[];
}

export function evaluateDeterministicGates(params: {
  tender: TenderContextForGates;
  profile?: CompanyProfileForGates | null;
  requirements?: RequirementEvaluationForGates[];
  now?: Date;
}): DeterministicGatesResult {
  const { tender, profile, requirements = [], now = new Date() } = params;
  const blockingReasons: string[] = [];
  const warnings: string[] = [];

  // 1. Estado administrativo del expediente (cancelado, anulado, suspendido)
  const normalizedStatus = (tender.status || '').toUpperCase();
  if (['CANCELLED', 'SUSPENDED', 'ANNULLED', 'RESUELTO', 'DESIERTO'].includes(normalizedStatus)) {
    blockingReasons.push(`El expediente de contratación no está activo (estado: ${tender.status})`);
  }

  // 2. Plazo de presentación vencido
  if (tender.submissionDeadline) {
    const deadlineDate = new Date(tender.submissionDeadline);
    if (!isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < now.getTime()) {
      blockingReasons.push(`El plazo de presentación de ofertas ha expirado (${deadlineDate.toISOString()})`);
    }
  }

  // 3. Puertas de presupuesto vs capacidad económica definida en el perfil
  if (profile && tender.estimatedValueCents != null) {
    if (profile.maxContractCents != null && tender.estimatedValueCents > profile.maxContractCents) {
      blockingReasons.push(
        `El presupuesto licitado (${(tender.estimatedValueCents / 100).toLocaleString('es-ES')} €) supera el límite máximo configurado por la empresa (${(profile.maxContractCents / 100).toLocaleString('es-ES')} €)`,
      );
    }
    if (profile.minContractCents != null && tender.estimatedValueCents < profile.minContractCents) {
      warnings.push(
        `El importe del contrato (${(tender.estimatedValueCents / 100).toLocaleString('es-ES')} €) está por debajo del umbral mínimo de rentabilidad deseado (${(profile.minContractCents / 100).toLocaleString('es-ES')} €)`,
      );
    }
  }

  // 4. Puertas de compatibilidad territorial
  if (profile && profile.territories.length > 0 && tender.locationCode) {
    const match = profile.territories.some((t) =>
      tender.locationCode?.toLowerCase().includes(t.toLowerCase()) ||
      t.toLowerCase().includes(tender.locationCode?.toLowerCase() || '')
    );
    if (!match) {
      warnings.push(`El territorio de ejecución (${tender.locationCode}) no figura entre las zonas de actuación preferente de la empresa`);
    }
  }

  // 5. Puertas por requisitos evaluados
  for (const req of requirements) {
    const isMandatory = req.requirementType === 'MANDATORY';

    if (isMandatory && req.status === 'NOT_SUPPORTED') {
      blockingReasons.push(`Incumplimiento de requisito obligatorio: "${req.summary}"`);
    } else if (isMandatory && (req.status === 'UNKNOWN' || req.status === 'NEEDS_EXPERT_REVIEW')) {
      warnings.push(`Requisito obligatorio sin evidencia concluyente en el dossier: "${req.summary}"`);
    } else if (req.status === 'CONFLICTING') {
      warnings.push(`Evidencias contradictorias detectadas en el requisito: "${req.summary}"`);
    }
  }

  // Determinación estricta de la elegibilidad (una causa bloqueante SIEMPRE domina)
  let eligibilityStatus: EligibilityStatus = 'ELIGIBLE';
  if (blockingReasons.length > 0) {
    eligibilityStatus = 'POTENTIALLY_INELIGIBLE';
  } else if (warnings.length > 0) {
    eligibilityStatus = 'NEEDS_EXPERT_REVIEW';
  }

  return {
    eligibilityStatus,
    blockingReasons,
    warnings,
  };
}
