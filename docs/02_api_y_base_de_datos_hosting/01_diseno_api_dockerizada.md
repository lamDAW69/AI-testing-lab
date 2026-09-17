# Módulo 02.1 — Diseño de API Dockerizada y Arquitectura Limpia

En este módulo aprenderás a estructurar la API backend siguiendo el principio de **Arquitectura Limpia (Clean Architecture)** y a contenerizarla con **Docker** para que funcione exactamente igual en tu ordenador local y en cualquier servidor del mundo.

---

## 🏛️ Estructura Modular de la API

Una API profesional separa claramente las responsabilidades en capas para evitar el código espagueti y facilitar las pruebas:

```
api/
├── src/
│   ├── config/             # Variables de entorno y configuraciones validadas
│   │   └── env.ts
│   ├── middleware/         # Autenticación, Rate Limiting, CORS, Error Handler
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   └── error.middleware.ts
│   ├── modules/            # Módulos de negocio (cada uno con su controlador, servicio, repo)
│   │   ├── tenants/
│   │   ├── users/
│   │   └── products/
│   │       ├── products.controller.ts  # Recibe HTTP, valida esquemas
│   │       ├── products.service.ts     # Lógica de negocio
│   │       ├── products.repository.ts  # Consultas SQL seguras con tenant_id
│   │       └── products.schema.ts      # Esquemas Zod (Input/Output)
│   ├── db/                 # Conexión a PostgreSQL y cliente de migraciones
│   │   └── client.ts
│   └── index.ts            # Punto de entrada de la aplicación
├── Dockerfile              # Empaquetado multi-etapa para producción
├── docker-compose.yml      # Orquestación de API + PostgreSQL
└── package.json
```

---

## 🛡️ Validación Estricta con Zod (products.schema.ts)

Para evitar el ataque de **Mass Assignment** (donde un usuario envía campos no permitidos como `tenant_id` o `price: -100`):

```typescript
import { z } from 'zod';

// Esquema para crear un producto
export const CreateProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().max(500).optional(),
  priceCents: z.number().int().positive('El precio debe ser un entero positivo en centavos'),
  sku: z.string().min(3).max(50),
}).strict(); // .strict() RECHAZA cualquier campo adicional no especificado

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
```

---

## 📦 Dockerfile Multi-Etapa (Optimizado y Seguro)

Un Dockerfile multi-stage compila el código en una etapa temporal y copia solo los archivos estrictamente necesarios a una imagen final ligera y sin privilegios de `root` (principio de menor privilegio).

```dockerfile
# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar TypeScript
COPY . .
RUN npm run build

# Eliminar dependencias de desarrollo
RUN npm prune --production

# ETAPA 2: Producción (Runtime Ligero y Seguro)
FROM node:20-alpine AS runner
WORKDIR /app

# Configurar entorno de producción
ENV NODE_ENV=production
ENV PORT=3000

# Crear un usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Cambiar al usuario sin privilegios
USER appuser

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

---

## 🐳 docker-compose.yml para Desarrollo y Producción

Este archivo levanta de forma coordinada la base de datos PostgreSQL y la API en una red interna privada:

```yaml
version: '3.8'

services:
  # Base de Datos PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: app_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-app_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secreto_seguro_cambiar}
      POSTGRES_DB: ${DB_NAME:-app_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_internal_network
    # NOTA: En producción NO expongas el puerto 5432 a Internet.
    # Solo la API dentro de la red docker necesita hablar con Postgres.
    ports:
      - "127.0.0.1:5432:5432"

  # API Backend
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app_api
    restart: always
    depends_on:
      - postgres
    environment:
      PORT: 3000
      DATABASE_URL: postgresql://${DB_USER:-app_user}:${DB_PASSWORD:-secreto_seguro_cambiar}@postgres:5432/${DB_NAME:-app_db}
      SUPABASE_PROJECT_URL: ${SUPABASE_PROJECT_URL}
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - app_internal_network

volumes:
  postgres_data:
    driver: local

networks:
  app_internal_network:
    driver: bridge
```

---

## 🎓 Qué has aprendido aquí:

1. **Aislamiento de Red**: La base de datos no está expuesta a internet; solo es accesible por la API a través de la red privada interna de Docker (`app_internal_network`).
2. **Usuario no-root en Docker**: Si un atacante lograra ejecutar código dentro del contenedor de la API, solo tendría permisos limitados de `appuser`, no de administrador del sistema.
3. **Validación estricta con `.strict()`**: Evita que un atacante inyecte atributos ajenos al crear o editar entidades.
