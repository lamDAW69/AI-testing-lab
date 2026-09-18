import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../config/env.js';

export interface AuthenticatedUser {
  readonly userId: string;
  readonly tenantId: string;
  readonly role: string;
  readonly email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

if (env.SUPABASE_PROJECT_URL) {
  const jwksUrl = new URL(`${env.SUPABASE_PROJECT_URL}/auth/v1/.well-known/jwks.json`);
  jwks = createRemoteJWKSet(jwksUrl);
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Falta el encabezado Authorization con formato Bearer <token>',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token de autorización ausente',
    });
    return;
  }

  // Si no se configuró SUPABASE_PROJECT_URL en entorno local, requerimos su definición
  if (!jwks) {
    res.status(500).json({
      error: 'ConfigurationError',
      message: 'SUPABASE_PROJECT_URL no está configurado para verificar tokens criptográficamente',
    });
    return;
  }

  try {
    // 1. Verificación Criptográfica Asimétrica contra JWKS público
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${env.SUPABASE_PROJECT_URL}/auth/v1`,
      audience: 'authenticated',
    });

    const userId = payload.sub;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized', message: 'Token no contiene sujeto (sub) válido' });
      return;
    }

    const email = typeof payload['email'] === 'string' ? payload['email'] : undefined;
    const appMetadata = (payload['app_metadata'] as Record<string, unknown> | undefined) ?? {};
    const tenantId = (appMetadata['tenant_id'] as string | undefined) ?? (req.headers['x-tenant-id'] as string | undefined);
    const role = (appMetadata['role'] as string | undefined) ?? 'member';

    if (!tenantId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'El usuario no tiene ningún tenant_id asignado en sus credenciales ni en cabecera autorizada',
      });
      return;
    }

    // 2. Inyección inmutable del contexto en Request (Anti-Tampering)
    req.user = Object.freeze({
      userId,
      tenantId,
      role,
      email,
    });

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Firma de token inválida o token expirado',
      details: env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}
