# AI Testing Lab — Arquitectura Multi-Tenant Segura y Guiada para IA

Bienvenido a **AI Testing Lab**. Este repositorio está especialmente diseñado para que puedas construir una aplicación web moderna, robusta, altamente segura y multi-inquilino (*multi-tenant*) trabajando en pareja con un agente de Inteligencia Artificial (OpenAI Codex, Claude Code, Cursor, Antigravity, etc.), asegurándote de que **tú aprendas en cada paso** y que la IA **nunca se salte las reglas de arquitectura ni cometa errores de seguridad**.

---

## 🏗️ Pila Tecnológica del Proyecto (Stack)

* **Autenticación y Credenciales**: [Supabase Auth](https://supabase.com/docs/guides/auth) (Manejo de usuarios, sesiones seguras, emisión de JWT con claves asimétricas JWKS).
* **Backend y Base de Datos**: Alojados en **Hosting Propio** (VPS / Contenedor) mediante **Docker & Docker Compose**:
  * **API**: Arquitectura limpia y modular (TypeScript con Hono/Fastify/Express o Python con FastAPI).
  * **Base de Datos**: PostgreSQL con migraciones versionadas y Row Level Security (RLS).
* **Frontend**: Desplegado en el Edge con **Cloudflare Pages / Workers** (alto rendimiento, protección DDoS, CDN global y soporte SSR para indexación).
* **Seguridad Defensiva**: Protección activa contra BOLA/IDOR, inyecciones, manipulación de JWT, Mass Assignment y OWASP API Top 10.
* **Indexación & Rendimiento**: SEO técnico con SSR/SSG en Cloudflare e indexación avanzada en PostgreSQL mediante `EXPLAIN ANALYZE`.
* **CI/CD**: Pipelines automatizados con **GitHub Actions** para pruebas, linters, escaneos de seguridad y despliegue continuo.

---

## 🤖 Cómo Trabaja la IA en este Repositorio

1. **Reglas Maestras (`AGENTS.md`)**:
   El archivo [`AGENTS.md`](./AGENTS.md) es leído automáticamente por los agentes de IA (como OpenAI Codex). En él se fijan normas inviolables:
   - Jamás ejecutar una consulta a la BD sin filtrar por `tenant_id`.
   - Jamás confiar en IDs de URL sin validar propiedad (Anti-BOLA).
   - Validar el 100% de los datos de entrada con esquemas estrictos.
   - **Explicar siempre el porqué** de cada decisión técnica para que el desarrollador aprenda.
2. **Configuración de Codex (`.codex/config.toml`)**:
   Parámetros técnicos que obligan a Codex a cargar las guías como contexto prioritario.

---

## 📚 Mapa de Guías Paso a Paso (`docs/`)

Toda la documentación técnica y pedagógica está organizada en la carpeta [`docs/`](./docs/README.md):

* **[00. Fundamentos y Arquitectura](./docs/00_fundamentos_y_arquitectura/01_arquitectura_del_sistema.md)**: Visión global del sistema y cómo aprender con IA sin copiar a ciegas.
* **[01. Autenticación con Supabase](./docs/01_autenticacion_supabase/01_setup_supabase_auth.md)**: Integración de Supabase Auth y validación de tokens JWT en el backend propio.
* **[02. API y Base de Datos en Hosting Propio](./docs/02_api_y_base_de_datos_hosting/01_diseno_api_dockerizada.md)**: Dockerización completa, PostgreSQL, migraciones y despliegue en VPS.
* **[03. Frontend en Cloudflare](./docs/03_frontend_cloudflare/01_cloudflare_pages_workers.md)**: Cloudflare Pages, Edge rendering y manejo seguro de sesiones.
* **[04. Seguridad Extrema Anti-Hack](./docs/04_seguridad_extrema_antihack/01_prevencion_bola_idor.md)**: Defensa contra BOLA, OWASP API Top 10, prevención de bypass y auditoría.
* **[05. Arquitectura Multi-Tenant](./docs/05_multitenancy/01_estrategia_multitenant_aislamiento.md)**: Estrategias de aislamiento estricto, contexto de inquilino y RLS.
* **[06. Indexación y Rendimiento](./docs/06_indexacion_y_rendimiento/01_indexacion_seo_web_ssr.md)**: SEO técnico web (SSR/Sitemaps) e indexación en base de datos.
* **[07. CI/CD y Automatización](./docs/07_cicd_automatizacion/01_github_actions_ci_testing_linting.md)**: Pipelines de GitHub Actions para testeo y despliegue continuo.

---

## 🚀 Cómo Empezar

1. Abre este repositorio en tu editor (VS Code, Cursor, Windsurf, etc.) o lánzalo con OpenAI Codex CLI.
2. Sigue la guía inicial en [`docs/00_fundamentos_y_arquitectura/02_guia_pedagogica_como_aprender_con_ia.md`](./docs/00_fundamentos_y_arquitectura/02_guia_pedagogica_como_aprender_con_ia.md).
3. Pídele a tu IA:
   > *"Por favor lee `AGENTS.md` y la guía `docs/01_autenticacion_supabase/01_setup_supabase_auth.md`. Vamos a comenzar configurando Supabase Auth siguiendo las normas de seguridad."*
