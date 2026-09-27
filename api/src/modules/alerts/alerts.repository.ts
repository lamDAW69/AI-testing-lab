import crypto from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import {
  opportunityAlerts,
  tenders,
  type OpportunityAlert,
} from '../../db/schema.js';
import type { AlertQueryFilter, CreateAlertInput } from './alerts.schema.js';

export interface AlertWithTender extends OpportunityAlert {
  tenderReference?: string;
  tenderTitle?: string;
}

export class AlertsRepository {
  /**
   * Genera un hash determinista SHA-256 para garantizar idempotencia y deduplicación.
   */
  computeIdempotencyHash(tenantId: string, alertType: string, deduplicationKey: string): string {
    return crypto
      .createHash('sha256')
      .update(`${tenantId}:${alertType}:${deduplicationKey}`)
      .digest('hex');
  }

  async createAlert(
    database: TenantTransaction,
    tenantId: string,
    input: CreateAlertInput,
  ): Promise<{ alert: OpportunityAlert | null; created: boolean }> {
    const idempotencyHash = this.computeIdempotencyHash(
      tenantId,
      input.alertType,
      input.deduplicationKey,
    );

    const inserted = await database
      .insert(opportunityAlerts)
      .values({
        tenantId,
        tenderId: input.tenderId,
        analysisId: input.analysisId,
        alertType: input.alertType,
        severity: input.severity,
        title: input.title,
        message: input.message,
        metadata: input.metadata as Record<string, unknown>,
        status: 'UNREAD',
        idempotencyHash,
      })
      .onConflictDoNothing({
        target: [opportunityAlerts.tenantId, opportunityAlerts.idempotencyHash],
      })
      .returning();

    if (inserted[0]) {
      return { alert: inserted[0], created: true };
    }

    // Si ya existía por conflicto de idempotencia, recuperar la existente
    const existing = await database
      .select()
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.idempotencyHash, idempotencyHash),
        ),
      )
      .limit(1);

    return { alert: existing[0] ?? null, created: false };
  }

  async listAlerts(
    database: TenantTransaction,
    tenantId: string,
    filters: AlertQueryFilter,
  ): Promise<{ alerts: AlertWithTender[]; total: number; unreadCount: number }> {
    const conditions = [eq(opportunityAlerts.tenantId, tenantId)];

    if (filters.status && filters.status !== 'ALL') {
      conditions.push(eq(opportunityAlerts.status, filters.status));
    }
    if (filters.severity) {
      conditions.push(eq(opportunityAlerts.severity, filters.severity));
    }
    if (filters.alertType) {
      conditions.push(eq(opportunityAlerts.alertType, filters.alertType));
    }
    if (filters.tenderId) {
      conditions.push(eq(opportunityAlerts.tenderId, filters.tenderId));
    }

    const whereClause = and(...conditions);

    const rows = await database
      .select({
        alert: opportunityAlerts,
        tenderRef: tenders.sourceTenderId,
        tenderTitle: tenders.title,
      })
      .from(opportunityAlerts)
      .leftJoin(tenders, eq(opportunityAlerts.tenderId, tenders.id))
      .where(whereClause)
      .orderBy(desc(opportunityAlerts.createdAt))
      .limit(filters.limit)
      .offset(filters.offset);

    const totalRows = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAlerts)
      .where(whereClause);

    const unreadRows = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.status, 'UNREAD'),
        ),
      );

    const alerts: AlertWithTender[] = rows.map((r) => ({
      ...r.alert,
      tenderReference: r.tenderRef ?? undefined,
      tenderTitle: r.tenderTitle ?? undefined,
    }));

    return {
      alerts,
      total: Number(totalRows[0]?.count ?? 0),
      unreadCount: Number(unreadRows[0]?.count ?? 0),
    };
  }

  async findAlertById(
    database: TenantTransaction,
    tenantId: string,
    alertId: string,
  ): Promise<OpportunityAlert | null> {
    const rows = await database
      .select()
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.id, alertId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async markAsRead(
    database: TenantTransaction,
    tenantId: string,
    alertId: string,
  ): Promise<OpportunityAlert | null> {
    const rows = await database
      .update(opportunityAlerts)
      .set({
        status: 'READ',
        readAt: new Date(),
      })
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.id, alertId),
        ),
      )
      .returning();

    return rows[0] ?? null;
  }

  async markAllAsRead(
    database: TenantTransaction,
    tenantId: string,
  ): Promise<number> {
    const rows = await database
      .update(opportunityAlerts)
      .set({
        status: 'READ',
        readAt: new Date(),
      })
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.status, 'UNREAD'),
        ),
      )
      .returning({ id: opportunityAlerts.id });

    return rows.length;
  }

  async dismissAlert(
    database: TenantTransaction,
    tenantId: string,
    alertId: string,
  ): Promise<OpportunityAlert | null> {
    const rows = await database
      .update(opportunityAlerts)
      .set({
        status: 'DISMISSED',
        dismissedAt: new Date(),
      })
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.id, alertId),
        ),
      )
      .returning();

    return rows[0] ?? null;
  }

  async getAlertsStats(
    database: TenantTransaction,
    tenantId: string,
  ): Promise<{
    unreadCount: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const severityRows = await database
      .select({
        severity: opportunityAlerts.severity,
        count: sql<number>`count(*)`,
      })
      .from(opportunityAlerts)
      .where(eq(opportunityAlerts.tenantId, tenantId))
      .groupBy(opportunityAlerts.severity);

    const typeRows = await database
      .select({
        type: opportunityAlerts.alertType,
        count: sql<number>`count(*)`,
      })
      .from(opportunityAlerts)
      .where(eq(opportunityAlerts.tenantId, tenantId))
      .groupBy(opportunityAlerts.alertType);

    const unreadRows = await database
      .select({ count: sql<number>`count(*)` })
      .from(opportunityAlerts)
      .where(
        and(
          eq(opportunityAlerts.tenantId, tenantId),
          eq(opportunityAlerts.status, 'UNREAD'),
        ),
      );

    const bySeverity: Record<string, number> = { INFO: 0, WARNING: 0, CRITICAL: 0 };
    for (const r of severityRows) {
      bySeverity[r.severity] = Number(r.count);
    }

    const byType: Record<string, number> = {};
    for (const r of typeRows) {
      byType[r.type] = Number(r.count);
    }

    return {
      unreadCount: Number(unreadRows[0]?.count ?? 0),
      bySeverity,
      byType,
    };
  }
}

export const alertsRepository = new AlertsRepository();
