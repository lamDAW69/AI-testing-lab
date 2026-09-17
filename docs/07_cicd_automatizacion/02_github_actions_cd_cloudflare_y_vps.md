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

Ve a tu repositorio en GitHub: **Settings > Secrets and variables > Actions > New repository secret** y añade:

| Nombre del Secreto | Descripción |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Token generado en Cloudflare con permisos de edición en Cloudflare Pages. |
| `CLOUDFLARE_ACCOUNT_ID` | Identificador de tu cuenta de Cloudflare (aparece en la URL de tu panel). |
| `VPS_HOST` | Dirección IP o dominio de tu servidor VPS (ej: `142.93.120.45`). |
| `VPS_USERNAME` | Usuario de despliegue en el VPS (ej: `deployer`). |
| `VPS_SSH_KEY` | Clave privada SSH (formato OpenSSH) generada exclusivamente para despliegues. |
| `VPS_SSH_PORT` | Puerto SSH (por defecto `22` o el puerto personalizado del servidor). |

---

## 📄 Archivo de Workflow de CD (`.github/workflows/cd.yml`)

```yaml
name: CD - Despliegue Continuo a Producción

on:
  push:
    branches: [ main ]

jobs:
  # TRABAJO 1: Desplegar Frontend a Cloudflare Pages
  deploy-frontend:
    name: Desplegar Frontend (Cloudflare Pages)
    runs-on: ubuntu-latest

    steps:
      - name: Clonar Repositorio
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar Dependencias del Frontend
        working-directory: ./frontend
        run: npm ci

      - name: Compilar Frontend (Build de Producción)
        working-directory: ./frontend
        env:
          PUBLIC_API_URL: https://api.tu-dominio.com
          PUBLIC_SUPABASE_URL: https://tu-proyecto.supabase.co
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Publicar en Cloudflare Pages con Wrangler
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy frontend/dist --project-name=app-frontend

  # TRABAJO 2: Desplegar Backend al Hosting Propio (VPS)
  deploy-backend:
    name: Desplegar API en VPS Propio
    runs-on: ubuntu-latest
    needs: deploy-frontend

    steps:
      - name: Ejecutar Despliegue Remoto vía SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT || 22 }}
          script: |
            set -e # Detener el script si algún comando falla
            echo "🚀 Iniciando despliegue en VPS..."

            # 1. Navegar al directorio del proyecto
            cd /home/deployer/app

            # 2. Descargar últimos cambios del repositorio
            git pull origin main

            # 3. Reconstruir y levantar los contenedores en segundo plano
            docker compose -f docker-compose.prod.yml build api
            docker compose -f docker-compose.prod.yml up -d --no-deps api

            # 4. Ejecutar migraciones pendientes de base de datos
            docker compose -f docker-compose.prod.yml exec -T api npm run db:migrate

            # 5. Limpiar imágenes antiguas no utilizadas para no saturar el disco
            docker image prune -f

            echo "✅ Despliegue completado con éxito."
```

---

## 🎓 Estrategia de Cero Tiempo de Inactividad (Zero-Downtime)

1. **`--no-deps` en Docker Compose**: Al levantar la nueva versión del contenedor de la API, Docker levanta el nuevo proceso mientras el anterior sigue atendiendo peticiones hasta que el nuevo pasa el chequeo de salud (*Healthcheck*).
2. **Migraciones Compatibles Hacia Atrás**:
   - Nunca borres una columna en la misma versión donde eliminas su uso en el código.
   - Paso 1: Crea la nueva columna.
   - Paso 2: Despliega la API que escribe en la nueva columna.
   - Paso 3: En un despliegue posterior, elimina la columna antigua.
3. **Caché Instantánea de Cloudflare**: Cloudflare Pages actualiza los enlaces atómicos de despliegue en milisegundos, por lo que los usuarios nunca experimentan pantallas de error 404 durante una actualización.
