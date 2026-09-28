import type { TenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';
import {
  evaluateDeterministicGates,
  type DeterministicGatesResult,
  type CompanyProfileForGates,
  type RequirementEvaluationForGates,
  type TenderContextForGates,
} from './deterministic-gates.js';
import {
  qualificationMatcherAgent,
  type DossierEvidenceCandidate,
  type QualificationMatchResult,
  type QualificationMatcherAgent,
  type RequirementToMatch,
} from './qualification-matcher.agent.js';
import {
  qualificationRepository,
  type QualificationRepository,
} from './qualification.repository.js';
import type {
  CreateAnalysisDecisionInput,
  CreateDossierItemInput,
  CreateOpportunityAnalysisInput,
  OpportunityDimensions,
} from './qualification.schema.js';
import type { OpportunityAnalysis } from '../../db/schema.js';

type RequirementsWithCitations = Awaited<ReturnType<QualificationRepository['getRequirementsWithCitations']>>;

export interface PreparedQualificationAnalysis {
  analysis: OpportunityAnalysis;
  requirements: RequirementsWithCitations;
  dossierCandidates: DossierEvidenceCandidate[];
  tenderContext: TenderContextForGates;
  profileContext: CompanyProfileForGates | null;
  preliminaryGates: DeterministicGatesResult;
}

export interface PreparedRequirementMatch {
  requirement: RequirementsWithCitations[number];
  match: QualificationMatchResult;
}

export class QualificationService {
  constructor(
    private readonly repository: QualificationRepository = qualificationRepository,
    private readonly matcherAgent: QualificationMatcherAgent = qualificationMatcherAgent,
  ) {}

  async createOpportunityAnalysis(
    database: TenantTransaction,
    tenantId: string,
    input: CreateOpportunityAnalysisInput,
  ) {
    // 1. Idempotencia estricta por tenant y clave
    const existing = await this.repository.findAnalysisByIdempotency(
      database,
      tenantId,
      input.idempotencyKey,
    );
    if (existing) {
      return { analysis: existing, idempotent: true };
    }

    // 2. Verificar que el expediente y la versión documental pertenecen al sistema
    const tenderDoc = await this.repository.verifyTenderAndDocument(
      database,
      input.tenderId,
      input.documentVersionId,
    );
    if (!tenderDoc) {
      throw new AppError(404, 'La versión documental o el expediente indicado no existe');
    }

    // 3. Mantener una sola evaluación vigente por tenant y expediente. El
    // histórico anterior se conserva y queda marcado como obsoleto.
    await this.repository.supersedeCurrentAnalyses(
      database,
      tenantId,
      input.tenderId,
      input.documentVersionId,
    );

    // 4. Crear análisis inicial en estado PENDING
    const analysis = await this.repository.createAnalysis(database, tenantId, input);

    return { analysis, idempotent: false };
  }

  /**
   * Reads and reserves the analysis in a short tenant transaction. Gemini is
   * deliberately not invoked here: an external request must never keep a
   * PostgreSQL transaction (and its tenant context) open.
   */
  async prepareFullAnalysis(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
  ): Promise<PreparedQualificationAnalysis | { completed: OpportunityAnalysis }> {
    const analysis = await this.repository.findAnalysisById(database, tenantId, analysisId);
    if (!analysis) {
      throw new AppError(404, 'El análisis de oportunidad solicitado no existe');
    }
    if (analysis.status === 'COMPLETED') {
      return { completed: analysis };
    }
    if (analysis.status === 'PROCESSING') {
      throw new AppError(409, 'El análisis de oportunidad ya se está procesando');
    }

    // 1. Verificar expediente y versión documental
    const tenderDoc = await this.repository.verifyTenderAndDocument(
      database,
      analysis.tenderId,
      analysis.documentVersionId,
    );
    if (!tenderDoc) {
      throw new AppError(404, 'La versión documental o el expediente indicado no existe');
    }
    const { tender } = tenderDoc;

    // 2. Obtener dossier del tenant (perfil, certificaciones, items de experiencia)
    const dossier = await this.repository.getCompanyDossier(database, tenantId);
    const { profile, certifications, dossierItems } = dossier;

    // Convertir dossier a candidatos de evidencia
    const dossierCandidates: DossierEvidenceCandidate[] = [
      ...certifications.map((c) => ({
        id: c.id,
        sourceType: 'CERTIFICATION' as const,
        title: `Certificación: ${c.name} (${c.issuer})`,
        description: `Número: ${c.certificateNumber || 'N/A'}. Referencia: ${c.documentReference || 'N/A'}. Estado: ${c.evidenceStatus}`,
        validUntil: c.validUntil,
      })),
      ...dossierItems.map((item) => ({
        id: item.id,
        sourceType: 'DOSSIER_ITEM' as const,
        title: `Dossier [${item.category}]: ${item.title}`,
        description: item.description,
        validUntil: item.validUntil,
      })),
    ];

    if (profile) {
      dossierCandidates.push({
        id: profile.tenantId,
        sourceType: 'COMPANY_PROFILE' as const,
        title: `Perfil Corporativo: ${profile.legalName}`,
        description: [
          profile.description,
          profile.capacitySummary ? `Capacidad: ${profile.capacitySummary}` : '',
          profile.territories.length > 0 ? `Territorios: ${profile.territories.join(', ')}` : '',
        ].filter(Boolean).join(' | '),
      });
    }

    const tenderContext: TenderContextForGates = {
      status: tender.status,
      submissionDeadline: tender.submissionDeadline,
      estimatedValueCents: tender.estimatedValueCents,
      title: tender.title,
    };

    const profileContext: CompanyProfileForGates | null = profile ? {
      minContractCents: profile.minContractCents,
      maxContractCents: profile.maxContractCents,
      territories: profile.territories,
    } : null;

    // Estas puertas se aplican antes de cualquier llamada al modelo. Un
    // expediente vencido, suspendido o fuera de presupuesto no consume IA.
    const preliminaryGates = evaluateDeterministicGates({
      tender: tenderContext,
      profile: profileContext,
    });

    // 3. Obtener requisitos extraídos y sellados de esta versión documental
    const requirementsList = await this.repository.getRequirementsWithCitations(
      database,
      tenantId,
      analysis.tenderId,
      analysis.documentVersionId,
    );

    const processing = await this.repository.updateAnalysis(database, tenantId, analysis.id, {
      status: 'PROCESSING',
    });

    return {
      analysis: processing,
      requirements: requirementsList,
      dossierCandidates,
      tenderContext,
      profileContext,
      preliminaryGates,
    };
  }

  /** Runs only the stateless, external model calls. No database transaction is open. */
  async matchPreparedRequirements(prepared: PreparedQualificationAnalysis): Promise<PreparedRequirementMatch[]> {
    // A deterministic exclusion is final and must not call Gemini.
    if (prepared.preliminaryGates.eligibilityStatus === 'POTENTIALLY_INELIGIBLE') {
      return [];
    }

    const concurrency = 4;
    const matches: PreparedRequirementMatch[] = [];

    for (let i = 0; i < prepared.requirements.length; i += concurrency) {
      const batch = prepared.requirements.slice(i, i + concurrency);
      const batchMatches = await Promise.all(
        batch.map(async (req) => {
          const requirement: RequirementToMatch = {
            id: req.id,
            category: req.category,
            requirementType: req.requirementType,
            summary: req.summary,
            extractedText: req.extractedText,
            citations: req.citations.map((c) => ({
              quotedText: c.quotedText,
              sectionReference: c.sectionReference,
            })),
          };
          const match = await this.matcherAgent.evaluateRequirement(requirement, prepared.dossierCandidates);
          return {
            requirement: req,
            match,
          };
        }),
      );
      matches.push(...batchMatches);
    }

    return matches;
  }

  /** Persists model output in a second, short tenant transaction. */
  async completePreparedAnalysis(
    database: TenantTransaction,
    tenantId: string,
    prepared: PreparedQualificationAnalysis,
    matches: PreparedRequirementMatch[],
  ) {
    const analysis = await this.repository.findAnalysisById(database, tenantId, prepared.analysis.id);
    if (!analysis) {
      throw new AppError(404, 'El análisis de oportunidad solicitado no existe');
    }

    // 4. Persistir cada evaluación ya calculada por el agente
    const evaluatedRequirementsForGates: RequirementEvaluationForGates[] = [];
    const savedAssessments = [];

    for (const { requirement: req, match: matchResult } of matches) {
      const assessment = await this.repository.saveAssessment(
        database,
        tenantId,
        analysis.id,
        {
          requirementId: req.id,
          status: matchResult.status,
          confidence: matchResult.confidence,
          rationale: matchResult.rationale,
          isBlocking: matchResult.isBlocking,
          agentName: matchResult.agent.name,
          model: matchResult.agent.model,
          promptVersion: matchResult.agent.promptVersion,
          durationMs: matchResult.agent.durationMs,
          costMicrounits: matchResult.agent.costMicrounits,
          evidences: matchResult.evidences,
        },
      );

      savedAssessments.push({ ...assessment, requirement: req, evidences: matchResult.evidences });
      evaluatedRequirementsForGates.push({
        requirementId: req.id,
        requirementType: req.requirementType,
        category: req.category,
        summary: req.summary,
        status: matchResult.status,
        hasEvidence: matchResult.evidences.length > 0,
      });
    }

    // 5. Volvemos a aplicar las puertas con los resultados del agente. Las
    // causas detectadas antes de Gemini siguen dominando el resultado.
    const deterministicResult = evaluateDeterministicGates({
      tender: prepared.tenderContext,
      profile: prepared.profileContext,
      requirements: evaluatedRequirementsForGates,
    });

    // 6. Calcular las 7 dimensiones explicables
    const dimensions = this.calculateDimensions(
      prepared.tenderContext,
      prepared.profileContext,
      savedAssessments,
      deterministicResult,
    );

    const summary = this.buildExecutiveSummary(deterministicResult, dimensions);

    // 7. Actualizar el análisis a COMPLETED
    const updated = await this.repository.updateAnalysis(database, tenantId, analysis.id, {
      status: 'COMPLETED',
      eligibilityStatus: deterministicResult.eligibilityStatus,
      dimensions,
      summary,
      blockingReasons: deterministicResult.blockingReasons,
      warnings: deterministicResult.warnings,
    });

    return updated;
  }

  async markAnalysisFailed(database: TenantTransaction, tenantId: string, analysisId: string) {
    const analysis = await this.repository.findAnalysisById(database, tenantId, analysisId);
    if (!analysis) return;
    await this.repository.updateAnalysis(database, tenantId, analysisId, { status: 'FAILED' });
  }

  async getAnalysisDetail(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
  ) {
    const analysis = await this.repository.findAnalysisById(database, tenantId, analysisId);
    if (!analysis) {
      throw new AppError(404, 'El análisis de oportunidad solicitado no existe');
    }

    const assessments = await this.repository.getAssessmentsWithEvidence(
      database,
      tenantId,
      analysisId,
    );

    const decision = await this.repository.getDecision(database, tenantId, analysisId);

    return {
      analysis,
      assessments,
      decision,
    };
  }

  async recordDecision(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
    input: CreateAnalysisDecisionInput,
    userId: string,
  ) {
    const analysis = await this.repository.findAnalysisById(database, tenantId, analysisId);
    if (!analysis) {
      throw new AppError(404, 'El análisis de oportunidad solicitado no existe');
    }

    return this.repository.saveDecision(database, tenantId, analysisId, input, userId);
  }

  async createDossierItem(
    database: TenantTransaction,
    tenantId: string,
    input: CreateDossierItemInput,
  ) {
    return this.repository.createDossierItem(database, tenantId, input);
  }

  async listDossierItems(database: TenantTransaction, tenantId: string) {
    return this.repository.listDossierItems(database, tenantId);
  }

  private calculateDimensions(
    tender: TenderContextForGates,
    profile: CompanyProfileForGates | null,
    assessments: Array<{
      status: string;
      requirement: { category: string; requirementType: string; summary: string };
      evidences: Array<{ sourceType: string; matchType: string; confidence?: number; validUntil?: Date | null }>;
    }>,
    gatesResult: { eligibilityStatus: any; blockingReasons: string[]; warnings: string[] },
  ): OpportunityDimensions {
    // 1. Elegibilidad potencial
    const potentialEligibility = {
      status: gatesResult.eligibilityStatus,
      blockingReasons: gatesResult.blockingReasons,
      warnings: gatesResult.warnings,
    };

    // 2. Encaje técnico
    const technicalAssessments = assessments.filter((a) => a.requirement.category === 'TECHNICAL');
    const totalTechnicalCount = technicalAssessments.length;
    const supportedCount = technicalAssessments.filter((a) => a.status === 'SUPPORTED').length;
    const notSupportedCount = technicalAssessments.filter((a) => a.status === 'NOT_SUPPORTED').length;
    const unknownCount = technicalAssessments.filter((a) => a.status === 'UNKNOWN' || a.status === 'NEEDS_EXPERT_REVIEW').length;
    const ratio = totalTechnicalCount === 0 ? 1 : supportedCount / totalTechnicalCount;

    let techScore: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_EVIDENCE' = 'MEDIUM';
    if (totalTechnicalCount === 0) {
      techScore = 'INSUFFICIENT_EVIDENCE';
    } else if (notSupportedCount > 0) {
      techScore = 'LOW';
    } else if (ratio >= 0.8) {
      techScore = 'HIGH';
    } else if (ratio >= 0.5) {
      techScore = 'MEDIUM';
    } else {
      techScore = 'LOW';
    }

    const technicalFit = {
      score: techScore,
      supportedCount,
      notSupportedCount,
      unknownCount,
      totalTechnicalCount,
      ratio: Math.round(ratio * 100) / 100,
    };

    // 3. Encaje económico
    const budgetEur = (tender.estimatedValueCents ?? 0) / 100;
    const minContractEur = profile?.minContractCents ? profile.minContractCents / 100 : undefined;
    const maxContractEur = profile?.maxContractCents ? profile.maxContractCents / 100 : undefined;

    let economicScore: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_EVIDENCE' = 'HIGH';
    let commentary = 'Presupuesto dentro de los márgenes estándar';

    if (maxContractEur && budgetEur > maxContractEur) {
      economicScore = 'LOW';
      commentary = `El presupuesto licitado (${budgetEur.toLocaleString('es-ES')} €) excede el límite máximo fijado (${maxContractEur.toLocaleString('es-ES')} €)`;
    } else if (minContractEur && budgetEur < minContractEur) {
      economicScore = 'MEDIUM';
      commentary = `El presupuesto licitado (${budgetEur.toLocaleString('es-ES')} €) está por debajo del umbral mínimo de preferencia (${minContractEur.toLocaleString('es-ES')} €)`;
    } else if (!minContractEur && !maxContractEur) {
      economicScore = 'INSUFFICIENT_EVIDENCE';
      commentary = 'No se han configurado límites de presupuesto en el perfil de la empresa';
    }

    const economicFit = {
      score: economicScore,
      budgetEur,
      minContractEur,
      maxContractEur,
      commentary,
    };

    // 4. Capacidad operativa (territorio)
    let territoryMatch = true;
    let territoryNotes = 'Cobertura territorial conforme o sin restricciones específicas';
    if (profile && profile.territories.length > 0 && tender.locationCode) {
      territoryMatch = profile.territories.some((t) =>
        tender.locationCode?.toLowerCase().includes(t.toLowerCase()) ||
        t.toLowerCase().includes(tender.locationCode?.toLowerCase() || '')
      );
      if (!territoryMatch) {
        territoryNotes = `Ubicación del contrato (${tender.locationCode}) fuera del ámbito preferente`;
      }
    }

    const operationalCapacity = {
      status: territoryMatch ? ('ADEQUATE' as const) : ('CONSTRAINED' as const),
      territoryMatch,
      territoryNotes,
    };

    // 5. Riesgo contractual
    const riskReasons: string[] = [];
    for (const a of assessments) {
      if (a.requirement.category === 'ECONOMIC' && a.requirement.summary.toLowerCase().includes('garantía provisional')) {
        riskReasons.push('Exigencia de constitución de garantía provisional previa');
      }
      if (a.requirement.summary.toLowerCase().includes('penalidad') || a.requirement.summary.toLowerCase().includes('penalización')) {
        riskReasons.push(`Cláusula de penalizaciones contractuales: "${a.requirement.summary}"`);
      }
    }

    const contractualRisk = {
      level: riskReasons.length >= 2 ? ('HIGH' as const) : riskReasons.length === 1 ? ('MEDIUM' as const) : ('LOW' as const),
      reasons: riskReasons,
    };

    // 6. Plazo
    let daysRemaining: number | undefined;
    let deadlineStatus: 'FEASIBLE' | 'TIGHT' | 'EXPIRED' | 'UNKNOWN' = 'UNKNOWN';
    if (tender.submissionDeadline) {
      const d = new Date(tender.submissionDeadline);
      if (!isNaN(d.getTime())) {
        daysRemaining = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) deadlineStatus = 'EXPIRED';
        else if (daysRemaining < 7) deadlineStatus = 'TIGHT';
        else deadlineStatus = 'FEASIBLE';
      }
    }

    const deadlineFit = {
      status: deadlineStatus,
      daysRemaining,
      deadline: tender.submissionDeadline ? String(tender.submissionDeadline) : undefined,
    };

    // 7. Cobertura de evidencia
    const totalReqs = assessments.length;
    let verifiedCount = 0;
    let declaredCount = 0;
    let missingCount = 0;

    for (const a of assessments) {
      if (a.evidences.length === 0 || a.status === 'UNKNOWN') {
        missingCount++;
      } else {
        const hasVerified = a.evidences.some(
          (e) =>
            (e as any).evidenceStatus === 'VERIFIED' ||
            (e.matchType === 'SUPPORTS' &&
              (e.confidence ?? 0) >= 70 &&
              (!e.validUntil || new Date(e.validUntil) > new Date())),
        );
        if (hasVerified) verifiedCount++;
        else declaredCount++;
      }
    }

    const coverageRatio = totalReqs === 0 ? 1 : (totalReqs - missingCount) / totalReqs;
    let covLevel: 'FULL' | 'PARTIAL' | 'MINIMAL' | 'NONE' = 'PARTIAL';
    if (coverageRatio >= 0.9) covLevel = 'FULL';
    else if (coverageRatio >= 0.5) covLevel = 'PARTIAL';
    else if (coverageRatio > 0) covLevel = 'MINIMAL';
    else covLevel = 'NONE';

    const evidenceCoverage = {
      level: covLevel,
      verifiedCount,
      declaredCount,
      missingCount,
      coverageRatio: Math.round(coverageRatio * 100) / 100,
    };

    return {
      potentialEligibility,
      technicalFit,
      economicFit,
      operationalCapacity,
      contractualRisk,
      deadlineFit,
      evidenceCoverage,
    };
  }

  private buildExecutiveSummary(
    gates: { eligibilityStatus: string; blockingReasons: string[]; warnings: string[] },
    dimensions: OpportunityDimensions,
  ): string {
    const parts: string[] = [];

    if (gates.eligibilityStatus === 'ELIGIBLE') {
      parts.push('Evaluación preliminar favorable: no se detectan causas bloqueantes de inadmisión.');
    } else if (gates.eligibilityStatus === 'POTENTIALLY_INELIGIBLE') {
      parts.push(`ALERTA DE INADMISIÓN: Se han detectado ${gates.blockingReasons.length} factor(es) bloqueante(s) determinista(s).`);
    } else {
      parts.push('REQUIERE REVISIÓN HUMANA: Existen incertidumbres críticas o requisitos obligatorios sin evidencia suficiente.');
    }

    parts.push(`Encaje técnico: ${dimensions.technicalFit.score} (${Math.round(dimensions.technicalFit.ratio * 100)}% de requisitos técnicos respaldados).`);
    parts.push(`Encaje económico: ${dimensions.economicFit.score} — ${dimensions.economicFit.commentary}.`);
    parts.push(`Riesgo contractual: ${dimensions.contractualRisk.level}. Plazo: ${dimensions.deadlineFit.status}.`);

    return parts.join(' ');
  }
}

export const qualificationService = new QualificationService();
