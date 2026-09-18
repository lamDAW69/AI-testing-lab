import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public override readonly message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Manejo de Errores de Validación de Esquemas Zod (400 Bad Request)
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Los datos proporcionados no cumplen con el esquema requerido',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });
    return;
  }

  // 2. Manejo de Errores de Dominio Controlados (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      details: err.details,
    });
    return;
  }

  // 3. Manejo de Errores Inesperados / Fallos Críticos (500 Internal Server Error)
  console.error('❌ Error no controlado:', err);

  res.status(500).json({
    error: 'InternalServerError',
    message: 'Ha ocurrido un error interno en el servidor',
    details: env.NODE_ENV === 'development' ? (err as Error).message : undefined,
  });
}
