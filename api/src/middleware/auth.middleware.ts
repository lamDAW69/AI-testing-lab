import { Request, Response, NextFunction } from 'express';
import { and, eq } from 'drizzle-orm';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';
import { env } from '../config/env.js';
import { withAuthenticatedUserTransaction } from '../db/client.js';
import { tenantMemberships } from '../db/schema.js';

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

const UserIdSchema = z.string().uuid();
const TenantIdSchema = z.string().uuid();
const MembershipSchema = z.object({
  tenantId: TenantIdSchema,
  role: z.enum(['owner', 'admin', 'member']),
});

type MembershipResolution =
  | { readonly ok: true; readonly membership: z.infer<typeof MembershipSchema> }
  | { readonly ok: false; readonly status: 400 | 403; readonly message: string };

/**
 * Resuelve un tenant exclusivamente desde una membresía persistida en nuestra
 * base de datos. `X-Tenant-ID` nunca concede acceso por sí solo: cuando está
 * presente, se comprueba contra el `sub` firmado del JWT. Si un usuario tiene
 * más de un tenant, exigirlo evita seleccionar uno de forma implícita.
 */
async function resolveMembership(req: Request, userId: string): Promise<MembershipResolution> {
  const tenantHeader = req.headers['x-tenant-id'];

  if (Array.isArray(tenantHeader)) {
    return {
      ok: false,
      status: 400,
      message: 'X-Tenant-ID debe aparecer una sola vez',
    };
  }

  if (tenantHeader !== undefined) {
    const parsedTenantId = TenantIdSchema.safeParse(tenantHeader);
    if (!parsedTenantId.success) {
      return {
        ok: false,
        status: 400,
        message: 'X-Tenant-ID debe ser un UUID válido',
      };
    }

    const rows = await withAuthenticatedUserTransaction(userId, (tx) => tx
      .select({ tenantId: tenantMemberships.tenantId, role: tenantMemberships.role })
      .from(tenantMemberships)
      .where(and(eq(tenantMemberships.userId, userId), eq(tenantMemberships.tenantId, parsedTenantId.data)))
      .limit(1));

    const membership = MembershipSchema.safeParse(rows[0]);
    if (!membership.success) {
      return {
        ok: false,
        status: 403,
        message: 'El usuario no pertenece al tenant solicitado',
      };
    }

    return { ok: true, membership: membership.data };
  }

  const rows = await withAuthenticatedUserTransaction(userId, (tx) => tx
    .select({ tenantId: tenantMemberships.tenantId, role: tenantMemberships.role })
    .from(tenantMemberships)
    .where(eq(tenantMemberships.userId, userId))
    .limit(2));

  if (rows.length === 0) {
    return {
      ok: false,
      status: 403,
      message: 'El usuario no tiene ninguna membresía de tenant activa',
    };
  }

  if (rows.length > 1) {
    return {
      ok: false,
      status: 400,
      message: 'X-Tenant-ID es obligatorio para usuarios con varios tenants',
    };
  }

  const membership = MembershipSchema.safeParse(rows[0]);
  if (!membership.success) {
    return {
      ok: false,
      status: 403,
      message: 'La membresía de tenant no tiene un rol válido',
    };
  }

  return { ok: true, membership: membership.data };
}

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

  let payload: Awaited<ReturnType<typeof jwtVerify>>['payload'];
  try {
    // 1. Verificación Criptográfica Asimétrica contra JWKS público
    ({ payload } = await jwtVerify(token, jwks, {
      issuer: `${env.SUPABASE_PROJECT_URL}/auth/v1`,
      audience: 'authenticated',
    }));

  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Firma de token inválida o token expirado',
      details: env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
    return;
  }

  const userId = UserIdSchema.safeParse(payload.sub);
  if (!userId.success) {
    res.status(401).json({ error: 'Unauthorized', message: 'Token no contiene un sujeto UUID válido' });
    return;
  }

  let resolution: MembershipResolution;
  try {
    resolution = await resolveMembership(req, userId.data);
  } catch (error) {
    console.error('No se pudo resolver la membresía del tenant:', error);
    res.status(503).json({
      error: 'AuthorizationUnavailable',
      message: 'No se pudo comprobar la autorización del tenant',
    });
    return;
  }

  if (!resolution.ok) {
    res.status(resolution.status).json({ error: 'Forbidden', message: resolution.message });
    return;
  }

  const email = typeof payload['email'] === 'string' ? payload['email'] : undefined;

  // 2. Inyección inmutable del contexto en Request (Anti-Tampering)
  req.user = Object.freeze({
    userId: userId.data,
    tenantId: resolution.membership.tenantId,
    role: resolution.membership.role,
    email,
  });

  next();
}
