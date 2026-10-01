# Módulo 08.8 — Cierre de Fase, Auditoría del MVP y Guía de Operación en Producción

> **Módulo:** Fase 8 — Cierre Integral de Producto LicitaIA  
> **Estado:** MVP Certificado, Fusionado en `main` y Verificado en CI/CD  
> **Repositorio:** `lamDAW69/AI-testing-lab`  
> **Cumplimiento:** [AGENTS.md](../../AGENTS.md) — Seguridad Militar, Cero BOLA/IDOR, Cero Slop y Paridad Canónica.

---

## 1. Resumen Ejecutivo de Cierre de Fase

El **Módulo 08 (Producto LicitaIA)** consolida la visión completa del SaaS B2B de inteligencia y precalificación de licitaciones públicas para empresas tecnológicas.

A lo largo de los 8 sub-módulos, se ha construido un sistema de extremo a extremo que:
1. **Monitoriza e ingesta la contratación pública española** a través del feed oficial ATOM / CODICE XML de la Plataforma de Contratación del Sector Público (PLACSP).
2. **Sella criptográficamente los pliegos oficiales** (PCAP y PPT) mediante un hash dual SHA-256 inmutable (binario y texto plano extraído) para erradicar cualquier posibilidad de alteración.
3. **Extrae requisitos mediante workers asíncronos desacoplados**, con control estricto de concurrencia (máximo 2 jobs por tenant) y neutralización de inyecciones adversariales (*Anti-Prompt Injection*).
4. **Evalúa la oportunidad frente al dossier de la empresa en 7 dimensiones explicables** (Elegibilidad Potencial, Encaje Técnico, Encaje Económico, Capacidad Operativa, Riesgo Contractual, Plazo y Cobertura de Evidencias), dominadas por puertas deterministas que no consumen IA ante exclusiones objetivas.
5. **Gestiona el ciclo de vida documental y la invalidez por adendas oficiales**, degradando de forma controlada análisis a `REQUIRES_REANALYSIS` y emitiendo alertas operativas idempotentes en base de datos.
6. **Ofrece un frontend editorial de alta gama** servible desde Cloudflare Pages, con paleta de comandos accesible por teclado (WAI-ARIA), navegación determinista sin métricas inventadas y separación estricta entre identidad de usuario y entidad mercantil licitadora.
7. **Garantiza la calidad continua mediante GitHub Actions**, con 100% de éxito en verificación de tipos, auditoría de dependencias, pruebas de aislamiento PostgreSQL RLS y pruebas End-to-End con Playwright Chromium.

---

## 2. Matriz de Arquitectura y Módulos de LicitaIA

```
                                  [PLACSP - Ministerio de Hacienda]
                                                 │
                                                 ▼ (Feed ATOM / CODICE XML)
                                      ┌──────────────────────┐
                                      │   PlacspConnector    │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Normalización a céntimos y CPV 8 dígitos)
                                      ┌──────────────────────┐
                                      │  tenders / documents │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Descarga Anti-SSRF y Hash Dual SHA-256)
                                      ┌──────────────────────┐
                                      │DocumentContentService│
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Cola Asíncrona con Advisory Locks)
                                      ┌──────────────────────┐
                                      │   extraction_jobs    │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Gemini LLM con Citas Físicas Estrictas)
                                      ┌──────────────────────┐
                                      │   tender_criteria    │
                                      └──────────┬───────────┘
                                                 │
                    ┌────────────────────────────┴───────────────────────────┐
                    ▼                                                        ▼
         [Puertas Deterministas]                                 [Matcher Requisito-Evidencia]
     (Plazo, Estado, Solvencia Max)                              (Aislamiento Multi-Tenant RLS)
                    │                                                        │
                    └────────────────────────────┬───────────────────────────┘
                                                 │
                                                 ▼ (7 Dimensiones Explicables)
                                      ┌──────────────────────┐
                                      │ opportunity_analyses │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Adendas, Cambios Documentales e Invalidez)
                                      ┌──────────────────────┐
                                      │  opportunity_alerts  │ ◄─── Invalidez Atómica Postgres
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (API REST Segura con X-Tenant-ID)
                                      ┌──────────────────────┐
                                      │    Express Backend   │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼ (Vite + React + Tailwind + Playwright)
                                      ┌──────────────────────┐
                                      │   Frontend Web App   │
                                      │  (Cloudflare Pages)  │
                                      └──────────────────────┘
```

---

## 3. Guía de Operación y Activación de Despliegue en Producción

El pipeline de Entrega Continua (`.github/workflows/cd.yml`) se encuentra implementado con guardas defensivas. En cuanto el operador registre los secretos en GitHub, los despliegues se activarán automáticamente.

### 3.1. Secretos a Configurar en GitHub
En el repositorio GitHub: **Settings > Secrets and variables > Actions > New repository secret**:

| Nombre del Secreto | Destino | Descripción | Ejemplo / Formato |
| :--- | :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Frontend | Token de API de Cloudflare con permisos de edición de Cloudflare Pages | `v1.0-abcd1234...` |
| `CLOUDFLARE_ACCOUNT_ID` | Frontend | ID de cuenta de Cloudflare (obtenible en la URL del panel de Cloudflare) | `3a8f9c1029e...` |
| `VPS_HOST` | Backend | IP pública o dominio del servidor VPS de producción | `142.93.120.45` |
| `VPS_USERNAME` | Backend | Usuario con permisos SSH y acceso al daemon de Docker | `deployer` |
| `VPS_SSH_KEY` | Backend | Clave privada SSH sin contraseña generada para el bot de despliegue | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_SSH_PORT` | Backend | Puerto del servicio SSH (opcional, por defecto 22) | `22` |
| `VPS_APP_DIR` | Backend | Ruta absoluta del proyecto en el servidor VPS | `/home/deployer/app` |
| `SUPABASE_PROJECT_URL` | Global | URL del proyecto de autenticación de Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Frontend | Clave pública anónima de Supabase | `eyJhbGciOiJIUzI1Ni...` |

### 3.2. Disparo de Despliegues
1. **Despliegue Automático por Git**:
   ```bash
   git checkout main
   git push origin main
   ```
2. **Despliegue Manual bajo Demanda (GitHub CLI)**:
   ```bash
   gh workflow run "CD - Despliegue Continuo a Producción" --ref main
   ```

---

## 4. Verificación de Suites de Pruebas y Certificación

Toda la base de código ha sido sometida a pruebas automatizadas reproducibles:

### A. Pruebas Unitarias de Backend (`npm --prefix api run test:unit`)
- **33/33 Tests Aprobados**:
  - Descargador documental seguro Anti-SSRF.
  - Generación de hashes criptográficos e idempotencia de trabajos.
  - Parser CODICE XML de licitaciones oficiales y normalización horaria peninsular (CET/CEST).
  - Resistencia ante ataques de *Prompt Injection* y manipulación de offsets.
  - Puertas deterministas de elegibilidad y aislamiento de matching sin fugas.

### B. Pruebas de Aislamiento Multi-Tenant (`npm --prefix api run test:integration`)
- Ejecución sobre contenedor real de PostgreSQL 16 con RLS activado.
- Validación de que el Tenant A recibe códigos `403` o `404` ante intentos de manipulación de recursos del Tenant B.

### C. Pruebas End-to-End de Frontend (`npm --prefix frontend run test:e2e`)
- **6/6 Tests Aprobados en Playwright Chromium**:
  1. `catalog-and-navigation.spec.ts`: Carga de KPIs y navegación por el catálogo.
  2. `catalog-and-navigation.spec.ts`: Ficha de licitación de la DGT.
  3. `command-palette.spec.ts`: Búsqueda y selección por teclado (`Enter`).
  4. `command-palette.spec.ts`: Cierre accesible mediante `Escape`.
  5. `multi-tenant-dossier.spec.ts`: Aislamiento documental y 3 pestañas canónicas.
  6. `reanalysis-flow.spec.ts`: Detección de adenda v2 y reevaluación exitosa.

---

## 5. Conclusión

Con la documentación de este documento, **el Módulo 08 queda formalmente concluido, indexado y certificado**, cerrando el alcance del Producto Mínimo Viable (MVP) y sentando las bases operativas de LicitaIA.
