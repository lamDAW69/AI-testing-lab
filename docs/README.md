# Índice de Guías y Ruta de Aprendizaje (`docs/`)

Bienvenido a la documentación central del proyecto. Estas guías tienen un doble objetivo:
1. **Para ti (El Desarrollador)**: Aprender de forma sólida los conceptos clave de arquitectura de software, seguridad web moderna, patrones multi-tenant y DevOps.
2. **Para la IA (Codex, Claude, Cursor, Antigravity)**: Servir de especificación técnica obligatoria para que el asistente no invente arquitecturas incompatibles ni cree agujeros de seguridad.

---

## 🗺️ Ruta de Aprendizaje Paso a Paso

Te recomendamos seguir los módulos en el siguiente orden:

```
[Módulo 00: Fundamentos y Pedagogía]
                 │
                 ▼
[Módulo 01: Autenticación con Supabase] ──┐
                 │                        │ (Integración de Tokens)
                 ▼                        │
[Módulo 02: API y BD en Hosting Propio] ◄─┘
                 │
                 ▼
[Módulo 03: Frontend en Cloudflare]
                 │
                 ▼
[Módulo 04: Seguridad Defensiva (Anti-BOLA/OWASP)]
                 │
                 ▼
[Módulo 05: Arquitectura Multi-Tenant y RLS]
                 │
                 ▼
[Módulo 06: Indexación (SEO Web + BD)]
                 │
                 ▼
[Módulo 07: CI/CD y Automatización]
```

---

## 📑 Detalle de Módulos

### [00. Fundamentos y Arquitectura](./00_fundamentos_y_arquitectura/)
* **[01_arquitectura_del_sistema.md](./00_fundamentos_y_arquitectura/01_arquitectura_del_sistema.md)**: Flujo de información entre Cloudflare, Supabase Auth y el Backend Propio.
* **[02_guia_pedagogica_como_aprender_con_ia.md](./00_fundamentos_y_arquitectura/02_guia_pedagogica_como_aprender_con_ia.md)**: Cómo utilizar este repositorio para convertirte en mejor ingeniero y no depender pasivamente de la IA.

### [01. Autenticación con Supabase](./01_autenticacion_supabase/)
* **[01_setup_supabase_auth.md](./01_autenticacion_supabase/01_setup_supabase_auth.md)**: Configuración en el panel de Supabase, credenciales y emisión de JWTs.
* **[02_validacion_jwt_en_backend.md](./01_autenticacion_supabase/02_validacion_jwt_en_backend.md)**: Verificación criptográfica asimétrica (JWKS) en tu propio servidor sin hacer llamadas lentas a Supabase.

### [02. API, Base de Datos y Correo en Hosting Propio](./02_api_y_base_de_datos_hosting/)
* **[01_diseno_api_dockerizada.md](./02_api_y_base_de_datos_hosting/01_diseno_api_dockerizada.md)**: Patrón de arquitectura limpia, middlewares, y Dockerización lista para producción.
* **[02_postgresql_esquema_y_migraciones.md](./02_api_y_base_de_datos_hosting/02_postgresql_esquema_y_migraciones.md)**: Creación de esquemas con migraciones reproducibles y soporte multi-tenant nativo.
* **[03_despliegue_en_hosting_propio.md](./02_api_y_base_de_datos_hosting/03_despliegue_en_hosting_propio.md)**: Configuración de VPS, Reverse Proxy con SSL automático (Caddy/Nginx) y seguridad de puertos.
* **[04_servidor_de_correos_docker.md](./02_api_y_base_de_datos_hosting/04_servidor_de_correos_docker.md)**: Servidor de correo contenerizado (Mailpit en local y Docker Mailserver en VPS), configuración DNS (SPF, DKIM, DMARC, rDNS) e integración con Supabase y Backend.

### [03. Frontend en Cloudflare](./03_frontend_cloudflare/)
* **[01_cloudflare_pages_workers.md](./03_frontend_cloudflare/01_cloudflare_pages_workers.md)**: Despliegue en el Edge global, routing y configuración de cabeceras HTTP de seguridad.
* **[02_gestion_estado_sesion_segura.md](./03_frontend_cloudflare/02_gestion_estado_sesion_segura.md)**: Manejo de tokens y cookies seguras para blindar el frontend contra ataques XSS y robo de credenciales.

### [04. Seguridad Extrema Anti-Hack](./04_seguridad_extrema_antihack/)
* **[01_prevencion_bola_idor.md](./04_seguridad_extrema_antihack/01_prevencion_bola_idor.md)**: Guía exhaustiva contra BOLA (Broken Object Level Authorization), el vector de ataque #1 en APIs modernas.
* **[02_owasp_api_top10_y_bypass_prevention.md](./04_seguridad_extrema_antihack/02_owasp_api_top10_y_bypass_prevention.md)**: Desglose y mitigación de las 10 vulnerabilidades más críticas de APIs.
* **[03_auditoria_seguridad_checklist.md](./04_seguridad_extrema_antihack/03_auditoria_seguridad_checklist.md)**: Checklist de verificación antes de lanzar cualquier endpoint a producción.

### [05. Arquitectura Multi-Tenant](./05_multitenancy/)
* **[01_estrategia_multitenant_aislamiento.md](./05_multitenancy/01_estrategia_multitenant_aislamiento.md)**: Cómo funciona el modelo multi-inquilino con aislamiento a nivel de fila y contexto inmutable.
* **[02_politicas_rls_y_contexto_tenant.md](./05_multitenancy/02_politicas_rls_y_contexto_tenant.md)**: Implementación de Row Level Security (RLS) en PostgreSQL como segunda línea de defensa.

### [06. Indexación y Rendimiento](./06_indexacion_y_rendimiento/)
* **[01_indexacion_seo_web_ssr.md](./06_indexacion_y_rendimiento/01_indexacion_seo_web_ssr.md)**: Indexación web para motores de búsqueda: SSR, meta tags OpenGraph, Schema.org y sitemaps.
* **[02_indexacion_postgresql_explain.md](./06_indexacion_y_rendimiento/02_indexacion_postgresql_explain.md)**: Indexación en base de datos: índices compuestos por `(tenant_id, ...)`, tipos de índices y análisis de planes de ejecución con `EXPLAIN ANALYZE`.

### [07. CI/CD y Automatización](./07_cicd_automatizacion/)
* **[01_github_actions_ci_testing_linting.md](./07_cicd_automatizacion/01_github_actions_ci_testing_linting.md)**: Pipeline de integración continua: tests automatizados, verificación de tipos y auditoría de seguridad.
* **[02_github_actions_cd_cloudflare_y_vps.md](./07_cicd_automatizacion/02_github_actions_cd_cloudflare_y_vps.md)**: Despliegue continuo hacia Cloudflare Pages y VPS propio mediante SSH seguro y Docker.
