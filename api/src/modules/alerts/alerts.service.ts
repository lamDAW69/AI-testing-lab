import { withTenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';
import { alertsRepository, type AlertsRepository } from './alerts.repository.js';
import type { AlertQueryFilter, CreateAlertInput } from './alerts.schema.js';

export class AlertsService {
  constructor(private readonly repository: AlertsRepository = alertsRepository) {}

  async createAlert(tenantId: string, input: CreateAlertInput) {
    return withTenantTransaction(tenantId, async (tx) => {
      return this.repository.createAlert(tx, tenantId, input);
    });
  }

  async listAlerts(tenantId: string, filters: AlertQueryFilter) {
    return withTenantTransaction(tenantId, async (tx) => {
      return this.repository.listAlerts(tx, tenantId, filters);
    });
  }

  async markAsRead(tenantId: string, alertId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      const updated = await this.repository.markAsRead(tx, tenantId, alertId);
      if (!updated) {
        throw new AppError(404, 'La alerta indicada no existe o no pertenece al tenant');
      }
      return updated;
    });
  }

  async markAllAsRead(tenantId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      const count = await this.repository.markAllAsRead(tx, tenantId);
      return { markedCount: count };
    });
  }

  async dismissAlert(tenantId: string, alertId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      const updated = await this.repository.dismissAlert(tx, tenantId, alertId);
      if (!updated) {
        throw new AppError(404, 'La alerta indicada no existe o no pertenece al tenant');
      }
      return updated;
    });
  }

  async getAlertsStats(tenantId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      return this.repository.getAlertsStats(tx, tenantId);
    });
  }
}

export const alertsService = new AlertsService();
