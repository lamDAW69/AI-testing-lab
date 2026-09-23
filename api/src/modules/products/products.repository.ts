import { eq, and, desc } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import { products, type Product, type NewProduct } from '../../db/schema.js';
import type { CreateProductInput, UpdateProductInput } from './products.schema.js';

export class ProductsRepository {
  /**
   * Obtiene la lista de productos pertenecientes exclusivamente al tenant autenticado.
   * Regla Anti-BOLA: El tenant_id es el filtro primario del índice compuesto.
   */
  async listByTenant(database: TenantTransaction, tenantId: string, limit: number, offset: number): Promise<Product[]> {
    return database
      .select()
      .from(products)
      .where(eq(products.tenantId, tenantId))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Busca un producto por ID asegurando incondicionalmente el aislamiento de tenant.
   * Si el producto existe pero pertenece a otro tenant, la consulta retorna undefined (404 seguro).
   */
  async findByIdAndTenant(database: TenantTransaction, id: string, tenantId: string): Promise<Product | undefined> {
    const rows = await database
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, id),
          eq(products.tenantId, tenantId)
        )
      )
      .limit(1);

    return rows[0];
  }

  /**
   * Crea un producto asignando el tenant_id inyectado por el middleware (nunca desde el body).
   */
  async create(database: TenantTransaction, tenantId: string, input: CreateProductInput): Promise<Product> {
    const newProduct: NewProduct = {
      tenantId,
      name: input.name,
      description: input.description,
      priceCents: input.priceCents,
      sku: input.sku,
    };

    const rows = await database.insert(products).values(newProduct).returning();
    const created = rows[0];
    if (!created) {
      throw new Error('Fallo al insertar el producto en la base de datos');
    }
    return created;
  }

  /**
   * Actualiza un producto verificando incondicionalmente tenant_id e id en la cláusula WHERE.
   */
  async updateByIdAndTenant(
    database: TenantTransaction,
    id: string,
    tenantId: string,
    input: UpdateProductInput
  ): Promise<Product | undefined> {
    const rows = await database
      .update(products)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, id),
          eq(products.tenantId, tenantId)
        )
      )
      .returning();

    return rows[0];
  }

  /**
   * Elimina un producto garantizando que pertenece al tenant solicitante.
   */
  async deleteByIdAndTenant(database: TenantTransaction, id: string, tenantId: string): Promise<boolean> {
    const result = await database
      .delete(products)
      .where(
        and(
          eq(products.id, id),
          eq(products.tenantId, tenantId)
        )
      )
      .returning({ id: products.id });

    return result.length > 0;
  }
}

export const productsRepository = new ProductsRepository();
