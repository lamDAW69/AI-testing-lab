# Módulo 01.1 — Configuración de Supabase Auth y Gestión de Credenciales

En este módulo aprenderás cómo configurar Supabase exclusivamente como proveedor de identidad (Identity Provider / Auth Service) para gestionar usuarios, sesiones y emisión de tokens seguros.

---

## 🎯 ¿Por qué usar Supabase Auth?

1. **Seguridad Criptográfica**: Maneja hashing de contraseñas robusto (Argon2 / bcrypt), MFA (autenticación multifactor), protección contra ataques de fuerza bruta y estándares OAuth2 / OIDC.
2. **Desacoplamiento Total**: Tu backend propio no almacena contraseñas directas, reduciendo drásticamente la superficie de ataque y la responsabilidad legal (GDPR / LOPD).
3. **Estándar JWT (JSON Web Token)**: Tras el login, Supabase emite un JWT firmado que viaja con cada petición hacia tu API en hosting propio.

---

## ⚙️ Paso a Paso: Configuración en Supabase

### 1. Crear el Proyecto en Supabase
1. Ingresa en [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. Anota los siguientes valores clave (los encontrarás en **Project Settings > API**):
   - **Project URL**: `https://<tu-proyecto-ref>.supabase.co`
   - **Anon / Public Key**: Clave pública segura para usar en el Frontend.
   - **JWT Secret**: Secreto compartido (o utiliza la clave pública JWKS).

### 2. Configuración de Proveedores de Autenticación
En el panel lateral, ve a **Authentication > Providers**:
- **Email / Password**:
  - Habilita *"Enable Email signup"*.
  - Decide si requerir confirmación por email (recomendado en producción, opcional en desarrollo local).
- **OAuth (Opcional)**: Google, GitHub, etc., configurando los Client ID y Secret provistos por cada plataforma.

### 3. Configuración de Claims Personalizados (Tenant y Roles)
Para que nuestro sistema multi-tenant funcione a la perfección, el JWT debe contener información sobre a qué organización (*tenant*) pertenece el usuario y cuál es su rol.

En Supabase, podemos usar un **Auth Hook** (Custom Access Token Hook en PostgreSQL) o guardar esta relación en la tabla `tenants_users` de nuestro backend.

#### Ejemplo de Hook en PostgreSQL de Supabase (Custom Claims):
```sql
-- Función que inyecta tenant_id y role en el JWT emitido por Supabase Auth
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_tenant_id uuid;
    user_role text;
  begin
    -- Consulta el tenant y rol asignado al usuario
    select tenant_id, role into user_tenant_id, user_role
    from public.user_tenants
    where user_id = (event->>'user_id')::uuid
    limit 1;

    claims := event->'claims';

    if user_tenant_id is not null then
      -- Inyecta los claims en el namespace app_metadata
      claims := jsonb_set(claims, '{app_metadata, tenant_id}', to_jsonb(user_tenant_id::text));
      claims := jsonb_set(claims, '{app_metadata, role}', to_jsonb(user_role));
    end if;

    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;
$$;
```

### 4. Configuración de Custom SMTP (Eliminar el límite de 3 correos/hora)

Por defecto, la infraestructura de Supabase limita las confirmaciones y restablecimientos de contraseña a **3 emails por hora**. Para levantar un entorno real sin bloqueos, debes conectar Supabase a tu propio servidor de correos (Mailpit en local o Docker Mailserver en tu VPS).

1. En el panel de Supabase, navega a **Project Settings > Authentication > SMTP Settings**.
2. Activa la casilla **"Enable Custom SMTP"**.
3. Introduce los parámetros de tu servidor:
   - **Sender Email**: `noreply@tu-dominio.com` (o la dirección que hayas creado en tu servidor).
   - **Sender Name**: El nombre comercial de tu aplicación.
   - **Host**: `mail.tu-dominio.com` (o `localhost` si usas Supabase CLI local con Mailpit).
   - **Port**: `587` (con STARTTLS) o `465` (con SSL/TLS).
   - **Username**: `noreply@tu-dominio.com`.
   - **Password**: La contraseña configurada al crear el buzón.
4. Consulta la guía detallada [04_servidor_de_correos_docker.md](../02_api_y_base_de_datos_hosting/04_servidor_de_correos_docker.md) para aprender a levantar el contenedor y validar los registros DNS (SPF, DKIM, DMARC, rDNS).

---

## 🔒 Variables de Entorno Seguras

Crea un archivo `.env.example` tanto para el frontend como para el backend:

### Para el Frontend (Cloudflare Pages):
```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PUBLIC_API_URL=https://api.tu-dominio.com
```

### Para el Backend Propio (VPS):
```env
SUPABASE_PROJECT_URL=https://tu-proyecto.supabase.co
SUPABASE_JWKS_URL=https://tu-proyecto.supabase.co/auth/v1/.well-known/jwks.json
PORT=3000
DATABASE_URL=postgresql://app_user:secreto_fuerte@localhost:5432/app_db
```

> [!WARNING]
> **NUNCA** expongas la `service_role` key de Supabase en el Frontend ni en repositorios públicos. Esa clave tiene permisos de superadministrador y salta todas las restricciones de seguridad.
