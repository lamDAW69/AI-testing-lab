# Módulo 07.1 — CI: Integración Continua, Pruebas y Seguridad Automatizada

La **Integración Continua (CI)** garantiza que ningún código roto, sin tipar o con vulnerabilidades de seguridad conocidas llegue jamás a la rama principal (`main`).

En este módulo aprenderás cómo estructurar un pipeline de CI profesional con **GitHub Actions**.

---

## 🚦 Las 3 Fases de un Pipeline de CI Robusto

```
   [Push o Pull Request]
             │
             ▼
 ┌───────────────────────┐
 │ 1. Chequeo de Calidad │ ──► Linting (ESLint), Formato y Tipos Estáticos (tsc --noEmit)
 └───────────┬───────────┘
             │
             ▼
 ┌───────────────────────┐
 │ 2. Auditoría Security │ ──► Escaneo de dependencias (npm audit) y SAST (Semgrep)
 └───────────┬───────────┘
             │
             ▼
 ┌───────────────────────┐
 │ 3. Suite de Pruebas   │ ──► Tests unitarios y de aislamiento multi-tenant con Postgres real
 └───────────────────────┘
```

---

## 📄 Archivo de Workflow de GitHub Actions (`.github/workflows/ci.yml`)

Guarda este archivo en tu repositorio en `.github/workflows/ci.yml`:

```yaml
name: CI - Integración Continua y Calidad

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # TRABAJO 1: Verificación de Código y Seguridad Estática
  quality-and-security:
    name: Lint, Types & Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: Clonar Repositorio
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar Dependencias
        run: npm ci

      - name: Verificación de Tipos TypeScript
        run: npm run typecheck # ejecuta: tsc --noEmit

      - name: Linter de Código
        run: npm run lint

      - name: Auditoría de Vulnerabilidades en Dependencias
        run: npm audit --audit-level=high

      - name: Escaneo de Seguridad SAST con Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/javascript

  # TRABAJO 2: Pruebas Automatizadas con Base de Datos PostgreSQL
  test-suite:
    name: Pruebas Unitarias y Multi-Tenant
    runs-on: ubuntu-latest
    needs: quality-and-security

    # Levanta una instancia real de PostgreSQL en memoria para los tests
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Clonar Repositorio
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar Dependencias
        run: npm ci

      - name: Aplicar Migraciones en Base de Datos de Test
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm run db:migrate

      - name: Ejecutar Pruebas Automatizadas
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
          NODE_ENV: test
          SUPABASE_PROJECT_URL: https://mock-project.supabase.co
        run: npm run test:coverage
```

---

## 🎓 Qué has aprendido aquí:

1. **Servicios Epímeros en GitHub**: En lugar de hacer *mocks* falsos de la base de datos que ocultan errores de SQL, el workflow levanta un contenedor real de PostgreSQL (`services: postgres`) donde se prueban las migraciones y las políticas de RLS reales.
2. **Semgrep para Análisis Estático**: Analiza el código buscando patrones de inyección SQL o consultas sin `tenant_id` antes de que se fusionen en la rama principal.
3. **Bloqueo de PRs Inseguros**: Si una prueba falla o hay una vulnerabilidad crítica en una librería, GitHub bloquea el merge automáticamente.
