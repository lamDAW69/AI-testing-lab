import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex, index, primaryKey } from 'drizzle-orm/pg-core';

// 1. Tabla de Organizaciones / Clientes (Tenants)
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Tabla intermedia que asocia usuarios (Supabase auth.users) con Tenants
export const tenantMemberships = pgTable('tenant_memberships', {
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(), // Corresponde al claim 'sub' del JWT de Supabase
  role: varchar('role', { length: 50 }).notNull().default('member'), // 'owner', 'admin', 'member'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.tenantId, table.userId] }),
  idxUserId: index('idx_memberships_user_id').on(table.userId),
}));

// 3. Tabla de Productos (Recurso Multi-Tenant con Aislamiento Estricto)
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Anti-BOLA / Rendimiento: Índice compuesto que inicia por tenant_id
  idxTenantId: index('idx_products_tenant_id').on(table.tenantId),
  idxTenantCreated: index('idx_products_tenant_created').on(table.tenantId, table.createdAt),
  // SKU único únicamente dentro del inquilino correspondiente
  uqTenantSku: uniqueIndex('uq_products_tenant_sku').on(table.tenantId, table.sku),
}));

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type TenantMembership = typeof tenantMemberships.$inferSelect;
export type NewTenantMembership = typeof tenantMemberships.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
