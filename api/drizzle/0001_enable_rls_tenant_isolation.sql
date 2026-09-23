-- Custom SQL migration file, put your code below! --
-- RLS se aplica incluso si app_user es propietario de las tablas. Sin FORCE,
-- el propietario podría omitir las políticas y la barrera sería ilusoria.
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenants" FORCE ROW LEVEL SECURITY;
ALTER TABLE "tenant_memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant_memberships" FORCE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Datos de tenant: la aplicación debe fijar app.current_tenant_id dentro de
-- la misma transacción antes de consultar o mutar cualquier fila privada.
CREATE POLICY "tenants_current_tenant" ON "tenants"
  FOR ALL
  USING ("id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint

-- El middleware ya validó la firma del JWT antes de usar app.current_user_id.
-- Esta política permite descubrir únicamente las membresías del propio sub.
CREATE POLICY "tenant_memberships_authenticated_user_read" ON "tenant_memberships"
  FOR SELECT
  USING ("user_id" = NULLIF(current_setting('app.current_user_id', true), '')::uuid);
--> statement-breakpoint

-- Cualquier operación de gestión posterior debe ir ligada al tenant resuelto.
CREATE POLICY "tenant_memberships_current_tenant" ON "tenant_memberships"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
--> statement-breakpoint

CREATE POLICY "products_current_tenant" ON "products"
  FOR ALL
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
