# Módulo 05.1 — Estrategias de Aislamiento en Arquitectura Multi-Tenant

En este módulo aprenderás qué es una arquitectura multi-inquilino (*multi-tenant*), las 3 formas tradicionales de implementarla en bases de datos y por qué nuestro proyecto utiliza **Base de Datos Compartida con Discriminador y Políticas de Seguridad a Nivel de Fila (RLS)**.

---

## 🏢 Los 3 Modelos de Arquitectura Multi-Tenant

```
1. Base de Datos por Tenant       2. Esquema por Tenant             3. BD Compartida (Discriminador)
┌──────────────┐ ┌──────────────┐ ┌───────────────────────────────┐ ┌───────────────────────────────┐
│   Tenant A   │ │   Tenant B   │ │           DATABASE            │ │           DATABASE            │
│  (Base de    │ │  (Base de    │ │  ┌─────────────┐┌───────────┐ │ │  ┌─────────────────────────┐  │
│  Datos A)    │ │  Datos B)    │ │  │  schema_a   ││ schema_b  │ │ │  │   Tabla Compartida      │  │
│              │ │              │ │  │ (Tablas A)  ││(Tablas B) │ │ │  │  [tenant_id | data...]   │  │
└──────────────┘ └──────────────┘ │  └─────────────┘└───────────┘ │ │  └─────────────────────────┘  │
                                  └───────────────────────────────┘ └───────────────────────────────┘
  Alto Coste / Difícil Gestión      Coste Medio / Complejo Migrar     Bajo Coste / Rendimiento Óptimo
```

### Modelo 1: Base de Datos por Tenant
- **Ventaja**: Aislamiento físico absoluto.
- **Desventaja**: Coste prohibitivo para cientos de clientes pequeños; complejidad extrema al ejecutar migraciones (ejecutar migraciones en 1,000 bases de datos separadas).

### Modelo 2: Esquema por Tenant (Schema-per-tenant)
- **Ventaja**: Aislamiento lógico dentro de la misma instancia de base de datos.
- **Desventaja**: Límites de recursos en PostgreSQL si hay miles de esquemas y conexiones; migraciones lentas.

### Modelo 3: Base de Datos Compartida con Discriminador (`tenant_id`) (Nuestro Modelo)
- **Ventaja**: Máximo aprovechamiento de recursos en tu VPS; una sola migración actualiza todo el sistema; costes mínimos de infraestructura.
- **El Reto**: Riesgo de fuga de datos si un programador olvida el filtro `WHERE tenant_id = ...`.
- **Nuestra Solución Defensiva**: Blindaje doble mediante **Middleware de Contexto en API + Row Level Security (RLS) nativo en PostgreSQL**.

---

## 🎯 El Ciclo de Vida del Contexto de Inquilino

Para que cada petición sepa a qué inquilino pertenece sin intervención manual:

```
[Petición HTTP entrante]
          │
          ▼
[1. Middleware de Autenticación] ──► Valida JWT con Supabase JWKS
          │
          ▼
[2. Resolución del Tenant]       ──► Extrae tenant_id del claim verificado (o subdominio)
          │
          ▼
[3. Inyección de Contexto]       ──► Congela req.user.tenantId (inmutable)
          │
          ▼
[4. Ejecución en Servicio/Repo]  ──► Repositorio pasa tenant_id a la consulta SQL
          │
          ▼
[5. PostgreSQL RLS]              ──► Postgres verifica que la sesión corresponda al tenant_id
```

---

## 🧩 Middleware de Contexto de Inquilino (TypeScript)

```typescript
// src/middleware/tenant.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function tenantContextMiddleware(req: Request, res: Response, next: NextFunction) {
  // Verificamos que el usuario ya haya sido autenticado
  if (!req.user || !req.user.tenantId) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'No se pudo resolver el contexto de inquilino para esta petición'
    });
  }

  // Opcional: Validar concordancia con subdominio (ej: acme.tuapp.com)
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];
  
  // Inyectar el contexto de forma segura para los repositorios
  req.tenantContext = {
    tenantId: req.user.tenantId,
    resolvedAt: new Date(),
  };

  next();
}
```
