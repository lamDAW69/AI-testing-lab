import cors from 'cors';
import helmet from 'helmet';
import { env } from '../config/env.js';
import { AppError } from './error.middleware.js';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

export const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (ej: curl, herramientas de testing del servidor o Docker)
    if (!origin) {
      return callback(null, true);
    }

    // No se admite '*' en ningún entorno: las rutas presentes o futuras pueden
    // requerir credenciales y el origen debe estar permitido explícitamente.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new AppError(403, 'Origen no permitido por la política CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
});
