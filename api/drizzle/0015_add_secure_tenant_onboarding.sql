-- El alta inicial es la única operación que puede crear un tenant sin que
-- exista una membresía previa. Se encapsula en una función SECURITY DEFINER
-- invocable solo por app_runtime después de verificar el JWT en la API.
-- No recibe tenant_id ni rol del cliente: ambos se determinan aquí.
CREATE OR REPLACE FUNCTION provision_first_tenant_for_user(
  p_user_id uuid,
  p_legal_name varchar(255),
  p_tax_id varchar(32),
  p_cpv_code text,
  p_correlation_id uuid
)
RETURNS TABLE (
  tenant_id uuid,
  name varchar(255),
  tax_id varchar(32),
  role varchar(50),
  created boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Serializa reintentos simultáneos del mismo sujeto autenticado.
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));
  PERFORM set_config('app.current_user_id', p_user_id::text, true);

  IF EXISTS (SELECT 1 FROM tenant_memberships WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'El usuario ya tiene una membresía activa'
      USING ERRCODE = 'P0001';
  END IF;

  v_tenant_id := gen_random_uuid();
  PERFORM set_config('app.current_tenant_id', v_tenant_id::text, true);

  INSERT INTO tenants (id, name, slug)
  VALUES (
    v_tenant_id,
    p_legal_name,
    'org-' || replace(v_tenant_id::text, '-', '')
  );

  INSERT INTO tenant_memberships (tenant_id, user_id, role)
  VALUES (v_tenant_id, p_user_id, 'owner');

  INSERT INTO company_profiles (tenant_id, legal_name, tax_id, cpv_codes, territories, evidence_status)
  VALUES (
    v_tenant_id,
    p_legal_name,
    p_tax_id,
    CASE WHEN p_cpv_code IS NULL THEN ARRAY[]::text[] ELSE ARRAY[p_cpv_code] END,
    ARRAY[]::text[],
    'DECLARED'
  );

  INSERT INTO audit_events (
    tenant_id, actor_type, actor_id, action, entity_type, entity_id,
    correlation_id, metadata
  ) VALUES (
    v_tenant_id, 'user', p_user_id, 'tenant.provisioned', 'tenant', v_tenant_id,
    p_correlation_id, '{"changedFields":["legalName","taxId","cpvCode"]}'::jsonb
  );

  RETURN QUERY
  SELECT v_tenant_id, p_legal_name, p_tax_id, 'owner'::varchar(50), true;
END;
$$;
--> statement-breakpoint

REVOKE ALL ON FUNCTION provision_first_tenant_for_user(uuid, varchar, varchar, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION provision_first_tenant_for_user(uuid, varchar, varchar, text, uuid) TO app_runtime;
