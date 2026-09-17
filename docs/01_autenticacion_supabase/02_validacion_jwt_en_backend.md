# Módulo 01.2 — Validación Criptográfica de JWT en Backend Propio

En este módulo aprenderás a verificar los tokens emitidos por Supabase en tu API propia, garantizando máxima velocidad (sin llamadas HTTP a Supabase en cada request) y **seguridad matemática inviolable** (anti-bypass).

---

## 🔐 ¿Cómo Funciona la Validación Criptográfica?

Un token JWT consta de 3 partes separadas por puntos:
`HEADER . PAYLOAD . SIGNATURE`

1. **Header**: Indica el algoritmo (ej: `HS256` o `RS256` / `ES256`).
2. **Payload**: Los datos del usuario (`sub`: User ID, `exp`: Fecha de expiración, `app_metadata`: tenant y roles).
3. **Signature**: Una firma criptográfica generada con la clave privada de Supabase.

> [!IMPORTANT]
> **Por qué no se debe hacer bypass**:
> Decodificar un token (`jwt.decode`) sin verificar la firma (`jwt.verify`) es el error más grave de una API. Cualquier atacante podría enviar un token con `user_id = admin` y `tenant_id = 999` inventados. Si verificas la firma con la clave criptográfica, cualquier alteración del payload invalida matemáticamente la firma y el ataque es rechazado al instante.

---

## 🚀 Implementación en Node.js / TypeScript (con `jose` o `jsonwebtoken`)

Usamos la librería estándar moderna [`jose`](https://github.com/panva/jose) (universal, sin dependencias nativas y compatible con Edge / Node / Docker).

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Interfaz para el contexto autenticado
export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
}

// Extender la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL!;
// JWKS público de Supabase (cachea automáticamente las claves públicas)
const JWKS_URL = new URL(`${SUPABASE_PROJECT_URL}/auth/v1/.well-known/jwks.json`);
const JWKS = createRemoteJWKSet(JWKS_URL);

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Falta el encabezado Authorization con formato Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verificación Criptográfica Asimétrica (JWKS)
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${SUPABASE_PROJECT_URL}/auth/v1`,
      audience: 'authenticated',
    });

    // 2. Extracción segura de Claims
    const userId = payload.sub as string;
    const email = payload.email as string;
    
    // Obtenemos tenant_id desde app_metadata o fallback a cabecera controlada
    const appMetadata = (payload.app_metadata as Record<string, any>) || {};
    const tenantId = appMetadata.tenant_id as string;
    const role = (appMetadata.role as string) || 'member';

    if (!tenantId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'El usuario no tiene ningún tenant asignado en sus credenciales'
      });
    }

    // 3. Inyección inmutable del contexto en Request
    req.user = Object.freeze({
      userId,
      tenantId,
      role,
      email
    });

    next();
  } catch (error: any) {
    // Si el token expiró o la firma no coincide, se deniega el acceso
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token inválido o expirado',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

---

## 🐍 Implementación Alternativa en Python (FastAPI con `PyJWT`)

```python
# app/middleware/auth.py
import os
import jwt
from jwt import PyJWKClient
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

SUPABASE_PROJECT_URL = os.getenv("SUPABASE_PROJECT_URL")
JWKS_URL = f"{SUPABASE_PROJECT_URL}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "ES256"],
            audience="authenticated",
            issuer=f"{SUPABASE_PROJECT_URL}/auth/v1"
        )
        
        tenant_id = payload.get("app_metadata", {}).get("tenant_id")
        if not tenant_id:
            raise HTTPException(status_code=403, detail="Usuario sin tenant asignado")
            
        return {
            "user_id": payload["sub"],
            "tenant_id": tenant_id,
            "role": payload.get("app_metadata", {}).get("role", "member")
        }
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")
```

---

## 🎓 Qué has aprendido aquí:

1. **Eficiencia**: Con JWKS tu servidor valida millones de peticiones por segundo sin necesidad de consultar por red a Supabase cada vez, pues las claves públicas se guardan en memoria caché.
2. **Imposibilidad de suplantación**: Nadie puede firmar un token sin la clave privada que custodia Supabase.
3. **Inmutabilidad del Contexto**: Una vez validado el token, el objeto `req.user` se congela (`Object.freeze`), impidiendo que cualquier función posterior altere el `tenant_id` por error.
