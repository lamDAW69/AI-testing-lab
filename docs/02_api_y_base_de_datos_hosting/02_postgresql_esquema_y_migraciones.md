# Módulo 02.2 — PostgreSQL: Esquema Relacional y Migraciones Controladas

En este módulo aprenderás a modelar una base de datos relacional multi-tenant resistente a fallos y a gestionar sus cambios a lo largo del tiempo mediante un sistema de migraciones versionadas.

---

## 📐 Diseño del Esquema Relacional Multi-Tenant

Para garantizar aislamiento estricto, todas las tablas que contienen datos de negocio deben tener una clave foránea `tenant_id`.

```
┌───────────────────────────┐
│          TENANTS          │
├───────────────────────────┤
│ id (UUID, PK)             │
│ name (VARCHAR)            │
│ slug (VARCHAR, UNIQUE)    │
│ created_at (TIMESTAMPTZ)  │
└─────────────┬─────────────┘
              │ 1
              │
              │ N
┌─────────────┴─────────────┐          ┌───────────────────────────┐
│       TENANT_USERS        │          │         PRODUCTS          │
├───────────────────────────┤          ├───────────────────────────┤
│ tenant_id (UUID, FK)      │          │ id (UUID, PK)             │
│ user_id (UUID, Supabase)  │          │ tenant_id (UUID, FK) ◄────┼─── Obligatorio
│ role (VARCHAR)            │          │ name (VARCHAR)            │
│ created_at (TIMESTAMPTZ)  │          │ price_cents (INTEGER)     │
│ PK (tenant_id, user_id)   │          │ created_at (TIMESTAMPTZ)  │
└───────────────────────────┘          └───────────────────────────┘
```

---

## 🗄️ Esquema SQL Inicial (`0001_initial_schema.sql`)

```sql
-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de Organizaciones / Clientes (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla intermedia que asocia usuarios de Supabase con Tenants
CREATE TABLE IF NOT EXISTS tenant_memberships (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Corresponde al 'sub' del JWT de Supabase
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tenant_id, user_id)
);

-- 3. Tabla de Recursos de Negocio (Ej: Productos)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    sku VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- El SKU es único dentro del mismo inquilino (no globalmente)
    CONSTRAINT uq_product_tenant_sku UNIQUE (tenant_id, sku)
);

-- ==========================================================
-- ÍNDICES CRÍTICOS PARA SEGURIDAD Y RENDIMIENTO
-- ==========================================================

-- Índice compuesto obligatorio para búsquedas multi-tenant
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_tenant_id_created_at ON products(tenant_id, created_at DESC);
CREATE INDEX idx_memberships_user_id ON tenant_memberships(user_id);
```

---

## 🔄 Sistema de Migraciones Reproducibles

Nunca ejecutes sentencias `ALTER TABLE` a mano en la base de datos de producción. Si lo haces, perderás la trazabilidad y tu entorno de desarrollo quedará desincronizado.

### Herramientas Recomendadas:
1. **Drizzle ORM (TypeScript)**: `drizzle-kit generate` y `drizzle-kit migrate`. Genera SQL transparente y altamente tipado.
2. **Prisma (TypeScript)**: `prisma migrate dev` y `prisma migrate deploy`.
3. **Alembic (Python)**: `alembic revision --autogenerate` y `alembic upgrade head`.

### Ejemplo con Drizzle ORM:
```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  priceCents: integer('price_cents').notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    tenantIdx: uniqueIndex('idx_products_tenant_sku').on(table.tenantId, table.sku),
  };
});
```

---

## 🎓 Buenas Prácticas que Debes Aprender:

1. **UUIDs en lugar de IDs Auto-incrementales**: Usar `gen_random_uuid()` impide que un atacante adivine cuántos registros tienes o enumere recursos secuencialmente (`1, 2, 3...`).
2. **Índices Compuestos que inician con `tenant_id`**: Dado que el 100% de las consultas filtrarán por `WHERE tenant_id = $1`, cualquier índice debe colocar `tenant_id` como primer elemento para que el motor de base de datos haga búsquedas B-Tree inmediatas.
3. **Restricciones de Unicidad Contextuales**: En un sistema multi-tenant, dos empresas diferentes pueden tener un producto con el mismo código `SKU: PROD-01`. Por tanto, la unicidad debe ser compuesta: `UNIQUE (tenant_id, sku)`.
