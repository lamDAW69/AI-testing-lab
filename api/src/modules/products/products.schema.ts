import { z } from 'zod';

// Esquema para creación de un nuevo producto dentro de un tenant
export const CreateProductSchema = z
  .object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim(),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
    priceCents: z
      .number({ required_error: 'El precio es obligatorio' })
      .int('El precio debe ser un número entero en centavos')
      .nonnegative('El precio no puede ser negativo'),
    sku: z
      .string({ required_error: 'El SKU es obligatorio' })
      .min(3, 'El SKU debe tener al menos 3 caracteres')
      .max(50, 'El SKU no puede exceder 50 caracteres')
      .regex(/^[A-Za-z0-9-_]+$/, 'El SKU solo puede contener caracteres alfanuméricos, guiones y guiones bajos')
      .trim(),
  })
  .strict(); // RECHAZA cualquier campo malicioso inyectado (ej: tenant_id, is_admin)

// Esquema para actualización parcial de producto
export const UpdateProductSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().max(500).optional(),
    priceCents: z.number().int().nonnegative().optional(),
  })
  .strict();

// Esquema de validación para parámetros de ruta UUIDv4 / UUIDv7
export const ProductParamsSchema = z
  .object({
    id: z.string().uuid('El ID debe ser un UUID válido'),
  })
  .strict();

// Esquema para paginación segura en consultas
export const ListProductsQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductParamsInput = z.infer<typeof ProductParamsSchema>;
export type ListProductsQueryInput = z.infer<typeof ListProductsQuerySchema>;
