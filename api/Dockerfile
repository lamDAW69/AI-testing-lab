# =========================================================
# ETAPA 1: Construcción (Builder)
# =========================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias con npm ci para reproducibilidad exacta
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar TypeScript a JavaScript
COPY tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle
RUN npm run build

# Eliminar dependencias de desarrollo para aligerar la imagen
RUN npm prune --omit=dev

# =========================================================
# ETAPA 2: Producción (Runner Ligero y Seguro)
# =========================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Principio de menor privilegio: Crear usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar manifiestos y artefactos compilados desde el builder
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/drizzle ./drizzle

# Cambiar a usuario sin privilegios
USER appuser

EXPOSE 3000

CMD ["node", "dist/index.js"]
