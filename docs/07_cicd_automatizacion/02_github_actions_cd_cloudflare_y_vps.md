# Módulo 07.2 — CD: Despliegue Continuo a Cloudflare Pages y VPS Propio

El **Despliegue Continuo (CD)** automatiza la entrega del software: en cuanto un cambio se aprueba y pasa los tests en `main`, el Frontend se actualiza en el Edge de Cloudflare y la API se actualiza en tu servidor VPS sin intervención manual.

---

## 🚀 Flujo de Despliegue Automatizado

```
                       [Commit en rama main]
                                │
                                ▼
                       [Pasa el Pipeline CI]
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
    [Despliegue a Cloudflare]       [Despliegue al VPS Propio]
    - Compila Frontend              - Conexión SSH Segura con Llave
    - Sube a Cloudflare Pages       - git pull / docker pull
    - Purga de Caché CDN            - Migración de Base de Datos
                                    - docker compose up -d (Zero-Downtime)
```

---

## 🔑 Secretos Necesarios en GitHub Repository Settings

Ve a tu repositorio en GitHub: **Settings > Secrets and variables > Actions > New repository secret** o utiliza la CLI de GitHub (`gh secret set NOMBRE_SECRETO`):

### 1. Secretos para Frontend (Cloudflare Pages y Supabase Auth)
| Nombre del Secreto | Descripción | Comando GitHub CLI |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare con permisos `Cloudflare Pages: Edit`. | `gh secret set CLOUDFLARE_API_TOKEN` |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID de tu cuenta de Cloudflare (panel lateral de Workers & Pages). | `gh secret set CLOUDFLARE_ACCOUNT_ID` |
| `VITE_API_URL` | URL pública de la API en producción (ej: `https://api.pliegoai.com`). Si no se define, toma ese valor por defecto. | `gh secret set VITE_API_URL` |
| `SUPABASE_PROJECT_URL` | URL de tu instancia de Supabase (ej: `https://xyzcompany.supabase.co`). | `gh secret set SUPABASE_PROJECT_URL` |
| `SUPABASE_ANON_KEY` | Clave pública (`anon`/`public`) del proyecto Supabase. | `gh secret set SUPABASE_ANON_KEY` |

### 2. Secretos para Backend en VPS Propio (Docker & PostgreSQL)
| Nombre del Secreto | Descripción | Comando GitHub CLI |
| :--- | :--- | :--- |
| `VPS_HOST` | Dirección IP o dominio de tu servidor VPS (ej: `195.201.88.99`). | `gh secret set VPS_HOST` |
| `VPS_USERNAME` | Usuario SSH con permisos Docker en el VPS (ej: `deployer` o `root`). | `gh secret set VPS_USERNAME` |
| `VPS_SSH_KEY` | Clave privada SSH sin contraseña (formato OpenSSH, `ed25519` o `rsa`). | `gh secret set VPS_SSH_KEY < ~/.ssh/id_ed25519` |
| `VPS_SSH_PORT` | Puerto del servicio SSH (opcional, por defecto `22`). | `gh secret set VPS_SSH_PORT` |
| `VPS_APP_DIR` | Ruta absoluta del proyecto en el servidor (opcional, por defecto `/home/deployer/app`). | `gh secret set VPS_APP_DIR` |

---

## 📄 Archivo de Workflow de CD (`.github/workflows/cd.yml`)

El pipeline actual incluye salvaguardas condicionales automáticas: si los secretos de Cloudflare o VPS aún no están configurados, el workflow no falla; simplemente emite un aviso didáctico y se completa de forma limpia.

```yaml
name: CD - Despliegue Continuo a Producción

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  # TRABAJO 1: Desplegar Frontend a Cloudflare Pages
  deploy-frontend:
    name: Desplegar Frontend (Cloudflare Pages)
    runs-on: ubuntu-latest

    steps:
      - name: Clonar Repositorio
        uses: actions/checkout@v4

      - name: Configurar Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Instalar Dependencias del Frontend
        working-directory: ./frontend
        run: npm ci

      - name: Compilar Frontend (Build de Producción)
        working-directory: ./frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL || 'https://api.pliegoai.com' }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_PROJECT_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Comprobar credenciales de Cloudflare Pages
        id: check-cf
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
            echo "⚠️ CLOUDFLARE_API_TOKEN no configurado en Secrets. Se omite la subida hasta configurar los secretos del repositorio."
          else
            echo "Credenciales de Cloudflare detectadas."
          fi

      - name: Publicar en Cloudflare Pages con Wrangler
        if: ${{ env.CLOUDFLARE_API_TOKEN != '' }}
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy frontend/dist --project-name=licitaia-frontend

  # TRABAJO 2: Desplegar Backend al Hosting Propio (VPS)
  deploy-backend:
    name: Desplegar API en VPS Propio (Docker & PostgreSQL)
    runs-on: ubuntu-latest
    needs: deploy-frontend

    steps:
      - name: Comprobar credenciales de servidor VPS
        id: check-vps
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
        run: |
          if [ -z "$VPS_HOST" ]; then
            echo "⚠️ VPS_HOST no configurado en Secrets. Se omite el despliegue SSH hasta configurar los secretos del repositorio."
          else
            echo "Credenciales de VPS detectadas."
          fi

      - name: Ejecutar Despliegue Remoto vía SSH
        if: ${{ env.VPS_HOST != '' }}
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT || 22 }}
          script: |
            set -e
            echo "🚀 Iniciando despliegue de LicitaIA en VPS..."

            APP_DIR="${{ secrets.VPS_APP_DIR || '/home/deployer/app' }}"
            cd "$APP_DIR"

            echo "📥 Obteniendo cambios de git (rama main)..."
            git pull origin main

            echo "🐳 Construyendo imágenes Docker de producción..."
            docker compose -f docker-compose.prod.yml build api extraction-worker

            echo "🔄 Ejecutando migraciones de base de datos..."
            docker compose -f docker-compose.prod.yml up -d postgres
            docker compose -f docker-compose.prod.yml run --rm migrate

            echo "⚡ Actualizando servicios en segundo plano..."
            docker compose -f docker-compose.prod.yml up -d --remove-orphans

            docker image prune -f
            docker compose -f docker-compose.prod.yml ps
            echo "✅ Despliegue de Backend finalizado con éxito."
```

---

## 🎓 Estrategia de Cero Tiempo de Inactividad (Zero-Downtime)

1. **Aislamiento de Migraciones (`migrate`)**: Las operaciones DDL de migración se ejecutan en un contenedor efímero dedicado antes de levantar la nueva versión de la API, garantizando que el esquema de PostgreSQL esté siempre al día antes de que el tráfico empiece a llegar.
2. **Cuentas Segregadas de PostgreSQL**:
   - `ADMIN_DATABASE_URL` (`app_user`): Utilizado únicamente por `migrate` para cambios estructurales de tablas e índices.
   - `DATABASE_URL` (`app_runtime`): Rol de mínimo privilegio utilizado en tiempo de ejecución por `api` y `extraction-worker` con políticas RLS obligatorias y sin permisos de alteración de tablas.
3. **Caché Atómica de Cloudflare**: Cloudflare Pages intercambia los hashes de build en milisegundos de forma atómica en el Edge global. Ningún usuario experimenta inconsistencias o pantallas de error 404 durante una actualización.
