# Módulo 00.1 — Arquitectura General del Sistema

Este documento describe la arquitectura distribuida del proyecto, los componentes que lo integran y cómo interactúan entre sí de forma segura y eficiente.

---

## 🏛️ Diagrama General de la Arquitectura

```
                       ┌──────────────────────────────────────┐
                       │           USUARIO / CLIENTE          │
                       └──────────────────┬───────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
      1. Login / Registro (Auth)                      2. Carga Frontend / Assets
                   │                                             │
                   ▼                                             ▼
        ┌─────────────────────┐                     ┌────────────────────────┐
        │    SUPABASE AUTH    │                     │    CLOUDFLARE PAGES    │
        │  - Emite JWT        │                     │  - Edge Global (CDN)   │
        │  - JWKS público     │                     │  - SSR / SSG (SEO)     │
        └──────────┬──────────┘                     └────────────┬───────────┘
                   │                                             │
                   │ Token JWT firmado                           │ Peticiones HTTPS
                   └──────────────────────┬──────────────────────┘
                                          │ (Bearer Token en Headers)
                                          ▼
                         ┌─────────────────────────────────┐
                         │      HOSTING PROPIO (VPS)       │
                         │                                 │
                         │  ┌───────────────────────────┐  │
                         │  │       REVERSE PROXY       │  │
                         │  │      (Caddy / Nginx)      │  │
                         │  │  - SSL Let's Encrypt      │  │
                         │  │  - Rate Limiting inicial  │  │
                         │  └─────────────┬─────────────┘  │
                         │                │                │
                         │                ▼                │
                         │  ┌───────────────────────────┐  │
                         │  │       API BACKEND         │  │
                         │  │      (Dockerizado)        │  │
                         │  │  - Valida JWT con JWKS    │  │
                         │  │  - Inyecta Contexto Tenant│  │
                         │  │  - Control Anti-BOLA/IDOR │  │
                         │  └─────────────┬─────────────┘  │
                         │                │                │
                         │                ▼                │
                         │  ┌───────────────────────────┐  │
                         │  │     POSTGRESQL MULTITENANT│  │
                         │  │      (Dockerizado)        │  │
                         │  │  - Row Level Security     │  │
                         │  │  - Índices (tenant_id,..) │  │
                         │  └───────────────────────────┘  │
                         └─────────────────────────────────┘
```

---

## 🧩 Responsabilidad de Cada Componente

### 1. Supabase (Identidad y Credenciales)
* **Función exclusiva**: Actúa como Identity Provider (IdP). Se encarga del registro de usuarios, login con email/contraseña o proveedores sociales (Google, GitHub), reseteo de contraseñas y emisión de tokens criptográficos (JWT).
* **Por qué no usamos Supabase para la base de datos completa**: 
  - Para evitar costes descontrolados y vendor lock-in en la capa de datos.
  - Para mantener el control total del esquema relacional y el almacenamiento en tu propio servidor.
* **Mecanismo de confianza**: Supabase firma los JWT con una clave privada. Nuestro backend solo necesita consultar la clave pública (JWKS) una vez (y cachearla) para validar cualquier petición.

### 2. Frontend en Cloudflare (Pages / Workers)
* **Función**: Servir la interfaz de usuario con la menor latencia del mundo gracias a la red Edge distribuida de Cloudflare.
* **Indexación y SEO**: Utiliza Server-Side Rendering (SSR) o Static Site Generation (SSG). Esto garantiza que Googlebot y otros rastreadores vean el HTML completamente renderizado con sus metaetiquetas y schema.org.
* **Seguridad en el Edge**: Cloudflare mitiga ataques DDoS, inyecciones masivas de tráfico y proporciona certificados SSL automáticos.

### 3. Backend Propio (API Dockerizada)
* **Función**: Procesar la lógica de negocio, validar permisos y gobernar el acceso a los datos.
* **Independencia de Hosting**: Empaquetado en un contenedor Docker. Puede correr en un VPS de 5€/mes (Hetzner, OVH, DigitalOcean) o en cualquier servidor privado sin cambiar una sola línea de código.
* **Seguridad Absoluta**:
  - Valida criptográficamente el JWT.
  - Extrae el `tenant_id` y el `user_id`.
  - Impide accesos no autorizados a recursos de otros inquilinos (Anti-BOLA).

### 4. Base de Datos Propia (PostgreSQL)
* **Función**: Almacenar los datos de negocio con persistencia en volúmenes de Docker.
* **Estructura Multi-Tenant**: Cada fila de cada tabla de negocio tiene una columna `tenant_id`.
* **Doble barrera de protección**:
  - Primera barrera: Las consultas de la API filtran explícitamente por `tenant_id`.
  - Segunda barrera: Políticas de Row Level Security (RLS) en Postgres impiden cualquier fuga de datos incluso si un programador comete un error en una consulta.

---

## 🔄 Flujo de una Petición de Extremo a Extremo

1. **Autenticación**: El usuario ingresa su usuario y contraseña en el frontend. El frontend se comunica con Supabase Auth y recibe un **Access Token (JWT)** y un **Refresh Token**.
2. **Petición al Backend**: El usuario solicita ver sus facturas (`GET /api/invoices`). El frontend envía la petición a nuestra API en el hosting propio incluyendo la cabecera:
   ```http
   Authorization: Bearer <JWT_DE_SUPABASE>
   ```
3. **Validación en el Reverse Proxy**: El proxy inverso (Caddy/Nginx) cifra la conexión TLS y limita la frecuencia de peticiones (*rate limit*).
4. **Inspección en el Middleware de la API**:
   - Comprueba la firma del JWT usando la clave pública de Supabase.
   - Si el token expiró o fue manipulado, responde inmediatamente `401 Unauthorized`.
   - Extrae el `user_id` y el `tenant_id`.
5. **Ejecución Segura en PostgreSQL**:
   - La API ejecuta:
     ```sql
     SELECT * FROM invoices WHERE tenant_id = $1 AND id = $2;
     ```
   - Si el `id` existe pero pertenece a otro inquilino, la consulta devuelve 0 filas, y la API responde `404 Not Found` (o `403 Forbidden`). Jamás se devuelven datos de otro tenant.
6. **Respuesta al Cliente**: Los datos se serializan y se devuelven al cliente de forma segura.
