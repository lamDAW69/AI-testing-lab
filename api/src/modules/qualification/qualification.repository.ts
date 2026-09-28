import { and, eq, sql } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import {
  analysisDecisions,
  assessmentEvidence,
  companyCertifications,
  companyDossierItems,
  companyProfiles,
  opportunityAnalyses,
  requirementAssessments,
  requirementCitations,
  requirements,
  tenderDocuments,
  tenderDocumentVersions,
  tenders,
  type CompanyDossierItem,
  type OpportunityAnalysis,
  type RequirementAssessment,
} from '../../db/schema.js';
import type {
  CreateAnalysisDecisionInput,
  CreateDossierItemInput,
  CreateOpportunityAnalysisInput,
  OpportunityDimensions,
} from './qualification.schema.js';

export class QualificationRepository {
  async verifyTenderAndDocument(
    database: TenantTransaction,
    tenderId: string,
    documentVersionId: string,
  ) {
    const rows = await database
      .select({
        tender: tenders,
        version: tenderDocumentVersions,
      })
      .from(tenders)
      .innerJoin(tenderDocuments, eq(tenders.id, tenderDocuments.tenderId))
      .innerJoin(tenderDocumentVersions, eq(tenderDocuments.id, tenderDocumentVersions.documentId))
      .where(
        and(
          eq(tenders.id, tenderId),
          eq(tenderDocumentVersions.id, documentVersionId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async findAnalysisById(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
  ): Promise<OpportunityAnalysis | null> {
    const rows = await database
      .select()
      .from(opportunityAnalyses)
      .where(
        and(
          eq(opportunityAnalyses.tenantId, tenantId),
          eq(opportunityAnalyses.id, analysisId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async findAnalysisByIdempotency(
    database: TenantTransaction,
    tenantId: string,
    idempotencyKey: string,
  ): Promise<OpportunityAnalysis | null> {
    const rows = await database
      .select()
      .from(opportunityAnalyses)
      .where(
        and(
          eq(opportunityAnalyses.tenantId, tenantId),
          eq(opportunityAnalyses.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async createAnalysis(
    database: TenantTransaction,
    tenantId: string,
    input: CreateOpportunityAnalysisInput,
  ): Promise<OpportunityAnalysis> {
    const rows = await database
      .insert(opportunityAnalyses)
      .values({
        tenantId,
        tenderId: input.tenderId,
        documentVersionId: input.documentVersionId,
        idempotencyKey: input.idempotencyKey,
        status: 'PENDING',
        eligibilityStatus: 'PENDING',
        dimensions: {},
        blockingReasons: [],
        warnings: [],
      })
      .returning();

    return rows[0]!;
  }

  async supersedeCurrentAnalyses(
    database: TenantTransaction,
    tenantId: string,
    tenderId: string,
    documentVersionId: string,
  ): Promise<number> {
    const rows = await database
      .update(opportunityAnalyses)
      .set({
        isCurrent: false,
        invalidationStatus: 'STALE',
        invalidationReason: 'Sustituido por un análisis posterior del mismo expediente',
        supersededByDocumentVersionId: documentVersionId,
        invalidatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(opportunityAnalyses.tenantId, tenantId),
          eq(opportunityAnalyses.tenderId, tenderId),
          eq(opportunityAnalyses.isCurrent, true),
        ),
      )
      .returning({ id: opportunityAnalyses.id });

    return rows.length;
  }

  async updateAnalysis(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
    patch: {
      status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
      eligibilityStatus?: 'PENDING' | 'ELIGIBLE' | 'POTENTIALLY_INELIGIBLE' | 'NEEDS_EXPERT_REVIEW';
      dimensions?: OpportunityDimensions;
      summary?: string | null;
      blockingReasons?: string[];
      warnings?: string[];
    },
  ): Promise<OpportunityAnalysis> {
    const rows = await database
      .update(opportunityAnalyses)
      .set({
        ...patch,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(opportunityAnalyses.tenantId, tenantId),
          eq(opportunityAnalyses.id, analysisId),
        ),
      )
      .returning();

    return rows[0]!;
  }

  async getRequirementsWithCitations(
    database: TenantTransaction,
    tenantId: string,
    tenderId: string,
    documentVersionId: string,
  ) {
    const reqs = await database
      .select()
      .from(requirements)
      .where(
        and(
          eq(requirements.tenantId, tenantId),
          eq(requirements.tenderId, tenderId),
          eq(requirements.documentVersionId, documentVersionId),
        ),
      );

    const citations = await database
      .select()
      .from(requirementCitations)
      .where(
        and(
          eq(requirementCitations.tenantId, tenantId),
          eq(requirementCitations.documentVersionId, documentVersionId),
        ),
      );

    const citationsByReq = new Map<string, typeof citations>();
    for (const c of citations) {
      const list = citationsByReq.get(c.requirementId) || [];
      list.push(c);
      citationsByReq.set(c.requirementId, list);
    }

    return reqs.map((r) => ({
      ...r,
      citations: citationsByReq.get(r.id) || [],
    }));
  }

  async getCompanyDossier(database: TenantTransaction, tenantId: string) {
    const profile = await database
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.tenantId, tenantId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    const certs = await database
      .select()
      .from(companyCertifications)
      .where(eq(companyCertifications.tenantId, tenantId));

    const dossierItems = await database
      .select()
      .from(companyDossierItems)
      .where(eq(companyDossierItems.tenantId, tenantId));

    return {
      profile,
      certifications: certs,
      dossierItems,
    };
  }

  async saveAssessment(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
    assessmentData: {
      requirementId: string;
      status: 'SUPPORTED' | 'NOT_SUPPORTED' | 'UNKNOWN' | 'CONFLICTING' | 'NOT_APPLICABLE' | 'NEEDS_EXPERT_REVIEW';
      confidence: number;
      rationale: string;
      isBlocking: boolean;
      agentName: string;
      model: string;
      promptVersion: string;
      durationMs: number;
      costMicrounits: number;
      evidences: Array<{
        sourceType: 'CERTIFICATION' | 'COMPANY_PROFILE' | 'DOSSIER_ITEM' | 'EXPERIENCE';
        sourceId: string;
        sourceTitle: string;
        matchType: 'SUPPORTS' | 'CONTRADICTS' | 'PARTIAL' | 'INCONCLUSIVE';
        excerpt: string;
        confidence: number;
        validUntil?: Date | null;
      }>;
    },
  ): Promise<RequirementAssessment> {
    const [assessment] = await database
      .insert(requirementAssessments)
      .values({
        tenantId,
        analysisId,
        requirementId: assessmentData.requirementId,
        status: assessmentData.status,
        confidence: assessmentData.confidence,
        rationale: assessmentData.rationale,
        isBlocking: assessmentData.isBlocking,
        agentName: assessmentData.agentName,
        model: assessmentData.model,
        promptVersion: assessmentData.promptVersion,
        durationMs: assessmentData.durationMs,
        costMicrounits: assessmentData.costMicrounits,
      })
      .returning();

    if (assessmentData.evidences.length > 0) {
      await database.insert(assessmentEvidence).values(
        assessmentData.evidences.map((e) => ({
          tenantId,
          assessmentId: assessment!.id,
          sourceType: e.sourceType,
          sourceId: e.sourceId,
          sourceTitle: e.sourceTitle,
          matchType: e.matchType,
          excerpt: e.excerpt,
          confidence: e.confidence,
          validUntil: e.validUntil,
        })),
      );
    }

    return assessment!;
  }

  async getAssessmentsWithEvidence(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
  ) {
    const assessments = await database
      .select({
        assessment: requirementAssessments,
        requirement: requirements,
      })
      .from(requirementAssessments)
      .innerJoin(requirements, eq(requirementAssessments.requirementId, requirements.id))
      .where(
        and(
          eq(requirementAssessments.tenantId, tenantId),
          eq(requirementAssessments.analysisId, analysisId),
        ),
      );

    const evidences = await database
      .select()
      .from(assessmentEvidence)
      .where(eq(assessmentEvidence.tenantId, tenantId));

    const evidenceByAssessment = new Map<string, typeof evidences>();
    for (const ev of evidences) {
      const list = evidenceByAssessment.get(ev.assessmentId) || [];
      list.push(ev);
      evidenceByAssessment.set(ev.assessmentId, list);
    }

    return assessments.map((row) => ({
      ...row.assessment,
      requirement: row.requirement,
      evidences: evidenceByAssessment.get(row.assessment.id) || [],
    }));
  }

  async getDecision(database: TenantTransaction, tenantId: string, analysisId: string) {
    const rows = await database
      .select()
      .from(analysisDecisions)
      .where(
        and(
          eq(analysisDecisions.tenantId, tenantId),
          eq(analysisDecisions.analysisId, analysisId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async saveDecision(
    database: TenantTransaction,
    tenantId: string,
    analysisId: string,
    input: CreateAnalysisDecisionInput,
    userId: string,
  ) {
    const rows = await database
      .insert(analysisDecisions)
      .values({
        tenantId,
        analysisId,
        decision: input.decision,
        rationale: input.rationale,
        decidedBy: userId,
        decidedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [analysisDecisions.tenantId, analysisDecisions.analysisId],
        set: {
          decision: input.decision,
          rationale: input.rationale,
          decidedBy: userId,
          decidedAt: new Date(),
        },
      })
      .returning();

    return rows[0]!;
  }

  async createDossierItem(
    database: TenantTransaction,
    tenantId: string,
    input: CreateDossierItemInput,
  ): Promise<CompanyDossierItem> {
    const rows = await database
      .insert(companyDossierItems)
      .values({
        tenantId,
        category: input.category,
        title: input.title,
        description: input.description,
        documentReference: input.documentReference,
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
      })
      .returning();

    return rows[0]!;
  }

  async listDossierItems(database: TenantTransaction, tenantId: string) {
    return database
      .select()
      .from(companyDossierItems)
      .where(eq(companyDossierItems.tenantId, tenantId))
      .orderBy(sql`${companyDossierItems.createdAt} DESC`);
  }
}

export const qualificationRepository = new QualificationRepository();
