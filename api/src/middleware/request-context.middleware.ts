import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      readonly requestId: string;
    }
  }
}

/**
 * Identificador generado por el servidor para correlacionar una petición, sus
 * mutaciones y futuras ejecuciones de agentes. No aceptamos uno del cliente,
 * para que un consumidor externo no pueda falsear la trazabilidad.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID();
  Object.defineProperty(req, 'requestId', {
    value: requestId,
    enumerable: true,
    writable: false,
    configurable: false,
  });
  res.setHeader('X-Request-ID', requestId);
  next();
}
