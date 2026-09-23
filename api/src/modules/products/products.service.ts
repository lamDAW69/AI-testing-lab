import { productsRepository, ProductsRepository } from './products.repository.js';
import type { CreateProductInput, UpdateProductInput } from './products.schema.js';
import type { Product } from '../../db/schema.js';
import type { TenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';

export class ProductsService {
  constructor(private readonly repo: ProductsRepository = productsRepository) {}

  async listProducts(database: TenantTransaction, tenantId: string, limit: number, offset: number): Promise<Product[]> {
    return this.repo.listByTenant(database, tenantId, limit, offset);
  }

  async getProduct(database: TenantTransaction, id: string, tenantId: string): Promise<Product> {
    const product = await this.repo.findByIdAndTenant(database, id, tenantId);

    if (!product) {
      // Respondemos 404 tanto si el producto no existe como si pertenece a otro inquilino (evita enumeración de recursos)
      throw new AppError(404, 'El producto solicitado no existe');
    }

    return product;
  }

  async createProduct(database: TenantTransaction, tenantId: string, input: CreateProductInput): Promise<Product> {
    return this.repo.create(database, tenantId, input);
  }

  async updateProduct(database: TenantTransaction, id: string, tenantId: string, input: UpdateProductInput): Promise<Product> {
    const updated = await this.repo.updateByIdAndTenant(database, id, tenantId, input);

    if (!updated) {
      throw new AppError(404, 'El producto a actualizar no existe');
    }

    return updated;
  }

  async deleteProduct(database: TenantTransaction, id: string, tenantId: string): Promise<void> {
    const deleted = await this.repo.deleteByIdAndTenant(database, id, tenantId);

    if (!deleted) {
      throw new AppError(404, 'El producto a eliminar no existe');
    }
  }
}

export const productsService = new ProductsService();
