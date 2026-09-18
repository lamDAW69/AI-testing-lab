import express, { Express, Request, Response } from 'express';
import { securityHeadersMiddleware, corsMiddleware } from './middleware/security.middleware.js';
import { errorMiddleware, AppError } from './middleware/error.middleware.js';
import { healthRouter } from './modules/health/health.controller.js';
import { productsRouter } from './modules/products/products.controller.js';

export function createApp(): Express {
  const app = express();

  // 1. Cabeceras de seguridad y defensa perimetral
  app.use(securityHeadersMiddleware);
  app.use(corsMiddleware);

  // 2. Parser JSON con límite estricto para prevenir DoS por payloads masivos
  app.use(express.json({ limit: '100kb' }));

  // 3. Rutas del sistema
  app.use(healthRouter);
  app.use('/api/products', productsRouter);

  // 4. Captura de rutas inexistentes (404 seguro)
  app.use((req: Request, _res: Response, next) => {
    next(new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
  });

  // 5. Middleware centralizado de manejo de errores
  app.use(errorMiddleware);

  return app;
}
