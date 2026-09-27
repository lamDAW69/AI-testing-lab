import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import {
  analysisDecisions,
  contractingAuthorities,
  opportunityAlerts,
  opportunityAnalyses,
  requirementAssessments,
  tenders,
} from '../../db/schema.js';
import type { PortfolioQueryFilter } from './portfolio.schema.js';

export interface PortfolioItem {
  tender: {
    id: string;
    sourceTenderId: string;
    title: string;
    description: string | null;
    status: string;
    contractType: string | null;
    budgetAmountCents: number | null;
    mainCpvCode: string | null;
    submissionDeadline: Date | null;
    contractingAuthority: string | null;
  };
  latestAnalysis: {
    id: string;
    status: string;
    eligibilityStatus: string;
    isCurrent: boolean;
    invalidationStatus: string;
    invalidationReason: string | null;
    invalidatedAt: Date | null;
    dimensions: Record<string, unknown>;
    blockingReasons: string[];
    warnings: string[];
    summary: string | null;
    createdAt: Date;
  } | null;
  decision: {
    id: string;
    decision: string;
    rationale: string;
    decidedBy: string;
    decidedAt: Date;
  } | null;
  unreadAlertsCount: number;
}

export interface PortfolioMetrics {
  summary: {
    totalTendersTracked: number;
    totalAnalyses: number;
    validAnalyses: number;
    staleOrInvalidAnalyses: number;
  };
  decisionsDistribution: {
    PURSUE: number;
    REVIEW: number;
    DISCARD: number;
    UNDECIDED: number;
  };
  eligibilityDistribution: {
    ELIGIBLE: number;
    POTENTIALLY_INELIGIBLE: number;
    NEEDS_EXPERT_REVIEW: number;
    PENDING: number;
  };
  invalidationDistribution: {
    VALID: number;
    STALE: number;
    REQUIRES_REANALYSIS: number;
  };
  topBlockingReasons: Array<{ reason: string; count: number }>;
  aiExecutionStats: {
    totalAssessments: number;
    totalCostMicrounits: number;
    totalCostUsd: number;
    avgDurationMs: number;
  };
  alertsStats: {
    unreadCount: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
  };
}

export class PortfolioRepository {
  /**
   * Consulta determinista agregada del portfolio del tenant.
   * Cero llamadas a IA: lee únicamente datos estructurados e indexados bajo RLS.
   */
  async listPortfolio(
    database: TenantTransaction,
    tenantId: string,
    filters: PortfolioQueryFilter,
  ): Promise<{ items: PortfolioItem[]; total: number }> {
    // 1. Obtener análisis vigentes del tenant
    const conditions = [eq(opportunityAnalyses.tenantId, tenantId)];

    if (filters.eligibilityStatus) {
      conditions.push(eq(opportunityAnalyses.eligibilityStatus, filters.eligibilityStatus));
    }
    if (filters.invalidationStatus) {
      conditions.push(eq(opportunityAnalyses.invalidationStatus, filters.invalidationStatus));
    }
    if (filters.hasBlockingReasons !== undefined) {
      if (filters.hasBlockingReasons) {
        conditions.push(sql`jsonb_array_length(${opportunityAnalyses.blockingReasons}) > 0`);
      } else {
        conditions.push(sql`jsonb_array_length(${opportunityAnalyses.blockingReasons}) = 0`);
      }
    }
    if (filters.cpv) {
      conditions.push(sql`${tenders.mainCpvCode} LIKE ${filters.cpv + '%'}`);
    }
    if (filters.minAmountCents !== undefined) {
      conditions.push(gte(tenders.budgetAmountCents, filters.minAmountCents));
    }
    if (filters.maxAmountCents !== undefined) {
      conditions.push(lte(tenders.budgetAmountCents, filters.maxAmountCents));
    }
    if (filters.deadlineBefore) {
      conditions.push(lte(tenders.submissionDeadline, new Date(filters.deadlineBefore)));
    }
    if (filters.deadlineAfter) {
      conditions.push(gte(tenders.submissionDeadline, new Date(filters.deadlineAfter)));
    }
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(or(
        ilike(tenders.title, searchPattern),
        ilike(tenders.sourceTenderId, searchPattern),
      )!);
    }
    if (filters.decision) {
      if (filters.decision === 'UNDECIDED') {
        conditions.push(or(
          sql`${analysisDecisions.decision} IS NULL`,
          eq(analysisDecisions.decision, 'UNDECIDED'),
        )!);
      } else {
        conditions.push(eq(analysisDecisions.decision, filters.decision));
      }
    }

    const whereClause = and(...conditions);

    // Consulta con JOIN a licitaciones, autoridades y decisiones
    const rows = await database
      .select({
        tender: tenders,
        authorityName: contractingAuthorities.name,
        analysis: opportunityAnalyses,
        decision: analysisDecisions,
      })
      .from(opportunityAnalyses)
      .innerJoin(tenders, eq(opportunityAnalyses.tenderId, tenders.id))
      .leftJoin(contractingAuthorities, eq(tenders.authorityId, contractingAuthorities.id))
      .leftJoin(analysisDecisions, and(
        eq(analysisDecisions.tenantId, tenantId),
        eq(analysisDecisions.analysisId, opportunityAnalyses.id),
      ))
      .where(whereClause)
      .orderBy(desc(opportunityAnalyses.createdAt))
      .limit(filters.limit)
      .offset(filters.offset);

    // Conteo total para paginación
    const countResult = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAnalyses)
      .innerJoin(tenders, eq(opportunityAnalyses.tenderId, tenders.id))
      .leftJoin(analysisDecisions, and(
        eq(analysisDecisions.tenantId, tenantId),
        eq(analysisDecisions.analysisId, opportunityAnalyses.id),
      ))
      .where(whereClause);

    // Contar alertas no leídas por licitación
    const tenderIds = rows.map((r) => r.tender.id);
    const unreadAlertsMap = new Map<string, number>();

    if (tenderIds.length > 0) {
      const alertCounts = await database
        .select({
          tenderId: opportunityAlerts.tenderId,
          count: sql<number>`count(*)`,
        })
        .from(opportunityAlerts)
        .where(
          and(
            eq(opportunityAlerts.tenantId, tenantId),
            eq(opportunityAlerts.status, 'UNREAD'),
            sql`${opportunityAlerts.tenderId} IN ${tenderIds}`,
          ),
        )
        .groupBy(opportunityAlerts.tenderId);

      for (const ac of alertCounts) {
        unreadAlertsMap.set(ac.tenderId, Number(ac.count));
      }
    }

    const items: PortfolioItem[] = rows.map((r) => ({
      tender: {
        id: r.tender.id,
        sourceTenderId: r.tender.sourceTenderId,
        title: r.tender.title,
        description: r.tender.description,
        status: r.tender.status,
        contractType: r.tender.contractType,
        budgetAmountCents: r.tender.budgetAmountCents,
        mainCpvCode: r.tender.mainCpvCode,
        submissionDeadline: r.tender.submissionDeadline,
        contractingAuthority: r.authorityName ?? null,
      },
      latestAnalysis: {
        id: r.analysis.id,
        status: r.analysis.status,
        eligibilityStatus: r.analysis.eligibilityStatus,
        isCurrent: r.analysis.isCurrent,
        invalidationStatus: r.analysis.invalidationStatus,
        invalidationReason: r.analysis.invalidationReason,
        invalidatedAt: r.analysis.invalidatedAt,
        dimensions: (r.analysis.dimensions ?? {}) as Record<string, unknown>,
        blockingReasons: (r.analysis.blockingReasons ?? []) as string[],
        warnings: (r.analysis.warnings ?? []) as string[],
        summary: r.analysis.summary,
        createdAt: r.analysis.createdAt,
      },
      decision: r.decision ? {
        id: r.decision.id,
        decision: r.decision.decision,
        rationale: r.decision.rationale,
        decidedBy: r.decision.decidedBy,
        decidedAt: r.decision.decidedAt,
      } : null,
      unreadAlertsCount: unreadAlertsMap.get(r.tender.id) ?? 0,
    }));

    return {
      items,
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  /**
   * Obtiene una oportunidad individual con detalle completo.
   */
  async getPortfolioItem(
    database: TenantTransaction,
    tenantId: string,
    tenderId: string,
  ): Promise<PortfolioItem | null> {
    const rows = await database
      .select({
        tender: tenders,
        authorityName: contractingAuthorities.name,
        analysis: opportunityAnalyses,
        decision: analysisDecisions,
      })
      .from(opportunityAnalyses)
      .innerJoin(tenders, eq(opportunityAnalyses.tenderId, tenders.id))
      .leftJoin(contractingAuthorities, eq(tenders.authorityId, contractingAuthorities.id))
      .leftJoin(analysisDecisions, and(
        eq(analysisDecisions.tenantId, tenantId),
        eq(analysisDecisions.analysisId, opportunityAnalyses.id),
      ))
      .where(
        and(
          eq(opportunityAnalyses.tenantId, tenantId),
          eq(opportunityAnalyses.tenderId, tenderId),
        ),
      )
      .orderBy(desc(opportunityAnalyses.createdAt))
      .limit(1);

    const r = rows[0];
    if (!r) return null;

    const unreadAlerts = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.tenderId, tenderId),
          eq(opportunityAlerts.status, 'UNREAD'),
        ),
      );

    return {
      tender: {
        id: r.tender.id,
        sourceTenderId: r.tender.sourceTenderId,
        title: r.tender.title,
        description: r.tender.description,
        status: r.tender.status,
        contractType: r.tender.contractType,
        budgetAmountCents: r.tender.budgetAmountCents,
        mainCpvCode: r.tender.mainCpvCode,
        submissionDeadline: r.tender.submissionDeadline,
        contractingAuthority: r.authorityName ?? null,
      },
      latestAnalysis: {
        id: r.analysis.id,
        status: r.analysis.status,
        eligibilityStatus: r.analysis.eligibilityStatus,
        isCurrent: r.analysis.isCurrent,
        invalidationStatus: r.analysis.invalidationStatus,
        invalidationReason: r.analysis.invalidationReason,
        invalidatedAt: r.analysis.invalidatedAt,
        dimensions: (r.analysis.dimensions ?? {}) as Record<string, unknown>,
        blockingReasons: (r.analysis.blockingReasons ?? []) as string[],
        warnings: (r.analysis.warnings ?? []) as string[],
        summary: r.analysis.summary,
        createdAt: r.analysis.createdAt,
      },
      decision: r.decision ? {
        id: r.decision.id,
        decision: r.decision.decision,
        rationale: r.decision.rationale,
        decidedBy: r.decision.decidedBy,
        decidedAt: r.decision.decidedAt,
      } : null,
      unreadAlertsCount: Number(unreadAlerts[0]?.count ?? 0),
    };
  }

  /**
   * Calcula métricas agregadas y observabilidad del portfolio para el tenant.
   * Sin datos sensibles ni PII.
   */
  async getPortfolioMetrics(
    database: TenantTransaction,
    tenantId: string,
  ): Promise<PortfolioMetrics> {
    // 1. Métricas de análisis y vigencia
    const analysisCounts = await database
      .select({
        total: sql<number>`count(*)`,
        valid: sql<number>`count(*) filter (where ${opportunityAnalyses.invalidationStatus} = 'VALID')`,
        stale: sql<number>`count(*) filter (where ${opportunityAnalyses.invalidationStatus} = 'STALE')`,
        requiresReanalysis: sql<number>`count(*) filter (where ${opportunityAnalyses.invalidationStatus} = 'REQUIRES_REANALYSIS')`,
        uniqueTenders: sql<number>`count(distinct ${opportunityAnalyses.tenderId})`,
      })
      .from(opportunityAnalyses)
      .where(eq(opportunityAnalyses.tenantId, tenantId));

    // 2. Distribución de elegibilidad
    const eligibilityRows = await database
      .select({
        eligibilityStatus: opportunityAnalyses.eligibilityStatus,
        count: sql<number>`count(*)`,
      })
      .from(opportunityAnalyses)
      .where(eq(opportunityAnalyses.tenantId, tenantId))
      .groupBy(opportunityAnalyses.eligibilityStatus);

    const eligibilityDistribution = {
      ELIGIBLE: 0,
      POTENTIALLY_INELIGIBLE: 0,
      NEEDS_EXPERT_REVIEW: 0,
      PENDING: 0,
    };
    for (const row of eligibilityRows) {
      if (row.eligibilityStatus in eligibilityDistribution) {
        eligibilityDistribution[row.eligibilityStatus as keyof typeof eligibilityDistribution] = Number(row.count);
      }
    }

    // 3. Distribución de decisiones
    const decisionRows = await database
      .select({
        decision: analysisDecisions.decision,
        count: sql<number>`count(*)`,
      })
      .from(analysisDecisions)
      .where(eq(analysisDecisions.tenantId, tenantId))
      .groupBy(analysisDecisions.decision);

    const decisionsDistribution = {
      PURSUE: 0,
      REVIEW: 0,
      DISCARD: 0,
      UNDECIDED: 0,
    };
    let decidedTotal = 0;
    for (const row of decisionRows) {
      if (row.decision in decisionsDistribution) {
        const c = Number(row.count);
        decisionsDistribution[row.decision as keyof typeof decisionsDistribution] = c;
        decidedTotal += c;
      }
    }
    const totalAnalyses = Number(analysisCounts[0]?.total ?? 0);
    decisionsDistribution.UNDECIDED = Math.max(0, totalAnalyses - decidedTotal);

    // 4. Causas de bloqueo más frecuentes
    const blockingRows = await database
      .select({
        blockingReason: sql<string>`jsonb_array_elements_text(${opportunityAnalyses.blockingReasons})`,
      })
      .from(opportunityAnalyses)
      .where(eq(opportunityAnalyses.tenantId, tenantId));

    const blockingMap = new Map<string, number>();
    for (const b of blockingRows) {
      blockingMap.set(b.blockingReason, (blockingMap.get(b.blockingReason) ?? 0) + 1);
    }
    const topBlockingReasons = Array.from(blockingMap.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Estadísticas de ejecución de agentes y costes
    const statsRows = await database
      .select({
        totalAssessments: sql<number>`count(*)`,
        totalCostMicrounits: sql<number>`coalesce(sum(${requirementAssessments.costMicrounits}), 0)`,
        avgDurationMs: sql<number>`coalesce(avg(${requirementAssessments.durationMs}), 0)`,
      })
      .from(requirementAssessments)
      .where(eq(requirementAssessments.tenantId, tenantId));

    const totalCostMicrounits = Number(statsRows[0]?.totalCostMicrounits ?? 0);
    const totalCostUsd = totalCostMicrounits / 1_000_000;

    // 6. Alertas
    const alertSeverityRows = await database
      .select({
        severity: opportunityAlerts.severity,
        count: sql<number>`count(*)`,
      })
      .from(opportunityAlerts)
      .where(eq(opportunityAlerts.tenantId, tenantId))
      .groupBy(opportunityAlerts.severity);

    const alertTypeRows = await database
      .select({
        type: opportunityAlerts.alertType,
        count: sql<number>`count(*)`,
      })
      .from(opportunityAlerts)
      .where(eq(opportunityAlerts.tenantId, tenantId))
      .groupBy(opportunityAlerts.alertType);

    const unreadAlerts = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.status, 'UNREAD'),
        ),
      );

    const alertsBySeverity: Record<string, number> = { INFO: 0, WARNING: 0, CRITICAL: 0 };
    for (const r of alertSeverityRows) {
      alertsBySeverity[r.severity] = Number(r.count);
    }

    const alertsByType: Record<string, number> = {};
    for (const r of alertTypeRows) {
      alertsByType[r.type] = Number(r.count);
    }

    return {
      summary: {
        totalTendersTracked: Number(analysisCounts[0]?.uniqueTenders ?? 0),
        totalAnalyses,
        validAnalyses: Number(analysisCounts[0]?.valid ?? 0),
        staleOrInvalidAnalyses: Number(analysisCounts[0]?.stale ?? 0) + Number(analysisCounts[0]?.requiresReanalysis ?? 0),
      },
      decisionsDistribution,
      eligibilityDistribution,
      invalidationDistribution: {
        VALID: Number(analysisCounts[0]?.valid ?? 0),
        STALE: Number(analysisCounts[0]?.stale ?? 0),
        REQUIRES_REANALYSIS: Number(analysisCounts[0]?.requiresReanalysis ?? 0),
      },
      topBlockingReasons,
      aiExecutionStats: {
        totalAssessments: Number(statsRows[0]?.totalAssessments ?? 0),
        totalCostMicrounits,
        totalCostUsd: Math.round(totalCostUsd * 1_000_000) / 1_000_000,
        avgDurationMs: Math.round(Number(statsRows[0]?.avgDurationMs ?? 0)),
      },
      alertsStats: {
        unreadCount: Number(unreadAlerts[0]?.count ?? 0),
        bySeverity: alertsBySeverity,
        byType: alertsByType,
      },
    };
  }
}

export const portfolioRepository = new PortfolioRepository();
