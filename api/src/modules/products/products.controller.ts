import { Router, Request, Response, NextFunction } from 'express';
import { productsService } from './products.service.js';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductParamsSchema,
  ListProductsQuerySchema,
} from './products.schema.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const productsRouter = Router();

// Todas las rutas de productos requieren autenticación y contexto de tenant
productsRouter.use(authMiddleware);

// GET /api/products — Listar productos del tenant
productsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const query = ListProductsQuerySchema.parse(req.query);

    const items = await productsService.listProducts(tenantId, query.limit, query.offset);

    res.status(200).json({
      data: items,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        count: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id — Obtener producto específico asegurando pertenencia al tenant
productsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const params = ProductParamsSchema.parse(req.params);

    const product = await productsService.getProduct(params.id, tenantId);

    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products — Crear producto (tenant_id inyectado exclusivamente desde req.user)
productsRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    // .strict() garantiza que ningún campo inesperado en req.body sobreescriba propiedades internas
    const body = CreateProductSchema.parse(req.body);

    const created = await productsService.createProduct(tenantId, body);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:id — Actualizar producto parcial
productsRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const params = ProductParamsSchema.parse(req.params);
    const body = UpdateProductSchema.parse(req.body);

    const updated = await productsService.updateProduct(params.id, tenantId, body);

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id — Eliminar producto
productsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const params = ProductParamsSchema.parse(req.params);

    await productsService.deleteProduct(params.id, tenantId);

    res.status(200).json({
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});
