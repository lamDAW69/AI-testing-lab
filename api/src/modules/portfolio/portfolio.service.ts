import { withTenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';
import { portfolioRepository, type PortfolioRepository } from './portfolio.repository.js';
import type { PortfolioQueryFilter } from './portfolio.schema.js';

export class PortfolioService {
  constructor(private readonly repository: PortfolioRepository = portfolioRepository) {}

  async listPortfolio(tenantId: string, filters: PortfolioQueryFilter) {
    return withTenantTransaction(tenantId, async (tx) => {
      return this.repository.listPortfolio(tx, tenantId, filters);
    });
  }

  async getPortfolioItem(tenantId: string, tenderId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      const item = await this.repository.getPortfolioItem(tx, tenantId, tenderId);
      if (!item) {
        throw new AppError(404, 'La oportunidad solicitada no existe o no tiene análisis registrado para este tenant');
      }
      return item;
    });
  }

  async getPortfolioMetrics(tenantId: string) {
    return withTenantTransaction(tenantId, async (tx) => {
      return this.repository.getPortfolioMetrics(tx, tenantId);
    });
  }
}

export const portfolioService = new PortfolioService();
