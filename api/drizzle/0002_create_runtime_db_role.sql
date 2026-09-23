-- Custom SQL migration file, put your code below! --
-- La cuenta de bootstrap de la imagen oficial de PostgreSQL es superusuario y
-- puede omitir RLS. La API nunca debe conectarse con ella.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime') THEN
    CREATE ROLE app_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
  END IF;
END
$$;
--> statement-breakpoint

-- No puede crear objetos ni tocar tablas fuera de la superficie explícitamente
-- necesaria para el runtime. Las políticas RLS se aplican además de estos GRANT.
REVOKE ALL ON SCHEMA public FROM app_runtime;
GRANT USAGE ON SCHEMA public TO app_runtime;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_runtime;
GRANT SELECT ON TABLE "tenants", "tenant_memberships" TO app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "products" TO app_runtime;
