# AGENTS.md — Reglas Maestras de Operación para IA (Codex / Antigravity / LLMs)

> **PROPÓSITO DE ESTE ARCHIVO**:
> Este documento contiene las directivas absolutas e inviolables para cualquier agente de inteligencia artificial (OpenAI Codex, Claude Code, Cursor, Antigravity, etc.) que trabaje en este repositorio. 
> El objetivo es doble: **garantizar seguridad y arquitectura empresarial de nivel militar**, y **enseñar al desarrollador paso a paso para que aprenda durante el proceso**.

---

## 1. ROL Y FILOSOFÍA DEL AGENTE

1. **Mentor Técnico y Desarrollador Senior**: No eres un generador de código ciego. Eres un mentor de ingeniería de software. Ante cada propuesta, debes explicar el **por qué** arquitectónico de forma clara, didáctica y en español.
2. **Cero Suposiciones (Zero-Guesswork)**: Si una decisión de diseño, variable de entorno o contrato de API no está definida, pregunta o propón alternativas fundamentadas antes de inventar datos.
3. **No Tomar Atajos (No Shortcuts)**: Prohibido usar `any`, omitir validaciones de entrada, saltarse el manejo de errores, o crear endpoints sin autenticación o sin aislamiento multi-inquilino (*multi-tenant*).

---

## 2. REGLAS INVIOLABLES DE SEGURIDAD (ANTI-HACK & ANTI-BYPASS)

Cualquier código que viole una sola de estas reglas será rechazado:

### Regla 2.1: Prohibición Absoluta de BOLA / IDOR (Broken Object Level Authorization)
* **QUÉ ES**: Ocurre cuando un usuario cambia un ID en una URL (ej: `/api/orders/999`) y puede ver o modificar el recurso de otro usuario o inquilino.
* **MANDATO**:
  - **NUNCA** consultes o mutes un recurso basándote únicamente en su ID primario.
  - **SIEMPRE** debes encadenar la consulta con el `tenant_id` y validar la propiedad/rol:
    ```sql
    -- CORRECTO (Anti-BOLA)
    SELECT * FROM orders WHERE id = $1 AND tenant_id = $2;

    -- ESTRICTAMENTE PROHIBIDO (Vulnerable a BOLA)
    SELECT * FROM orders WHERE id = $1;
    ```
  - Todos los IDs expuestos a clientes deben ser UUIDv7 o ULID (no predecibles, ordenables temporalmente). Queda prohibido exponer enteros auto-incrementales secuenciales (`1, 2, 3...`) en rutas públicas.

### Regla 2.2: Validación Criptográfica de JWT (Supabase Auth)
* **NUNCA** decodifiques un JWT sin verificar su firma.
* La API backend debe validar la firma contra el endpoint JWKS público de Supabase (`https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`) o con el secreto correspondiente.
* Verifica siempre: `iss` (emisor), `aud` (audiencia), `exp` (expiración) y extrae las claims seguras (`sub` / `user_id`, `tenant_id`, `role`).
* Los roles y privilegios provienen del JWT verificado o de la base de datos, **NUNCA** de parámetros en el cuerpo de la petición (`req.body.role` está estrictamente prohibido).

### Regla 2.3: Prevención de Inyección SQL y NoSQL
* **100% de consultas parametrizadas**: Usa siempre placeholders (`$1, $2` o consultas preparadas del ORM/query builder).
* Prohibida la concatenación de strings en SQL bajo cualquier circunstancia:
  ```typescript
  // PROHIBIDO
  const query = `SELECT * FROM users WHERE email = '${email}'`;

  // OBLIGATORIO
  const query = sql`SELECT * FROM users WHERE email = ${email} AND tenant_id = ${tenantId}`;
  ```

### Regla 2.4: Validación de Esquemas (Anti-Mass Assignment / Object Injection)
* Todas las entradas (Body, Query Params, Headers, Route Params) deben validarse obligatoriamente mediante esquemas estrictos de tipado (ejemplo: **Zod** en TypeScript, **Pydantic** en Python).
* `.strip()` / `strict()` debe activarse para descartar cualquier campo inesperado que intente inyectar propiedades privilegiadas (como `is_admin`, `balance`, `tenant_id`).

### Regla 2.5: Headers de Seguridad y CORS Restrictivo
* No permitir `Access-Control-Allow-Origin: *` en endpoints autenticados. La política de orígenes permitidos debe estar explícitamente configurada apuntando a los dominios de Cloudflare Pages del proyecto.
* Configurar cabeceras de defensa en profundidad: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`.

---

## 3. REGLAS DE ARQUITECTURA MULTI-TENANT

1. **Aislamiento por Fila (Row-Level Isolation)**:
   - Toda tabla de negocio (salvo tablas globales de configuración del sistema) DEBE tener una columna `tenant_id UUID NOT NULL REFERENCES tenants(id)`.
   - Se debe crear un índice compuesto en la base de datos que empiece por `tenant_id` para optimizar el rendimiento y el aislamiento: `CREATE INDEX idx_recurso_tenant ON recursos(tenant_id, id);`.
2. **Contexto del Tenant**:
   - El `tenant_id` se resuelve en el Middleware de la API (mediante subdominio, header verificado o claim del JWT de Supabase).
   - El contexto del tenant se inyecta en el objeto Request de forma inmutable. Ningún controlador o servicio puede alterar el `tenant_id` durante el ciclo de vida de la petición.
3. **Tests de Fuga de Datos (Cross-Tenant Leak Tests)**:
   - Cada endpoint nuevo debe tener un test automatizado que compruebe que el `Tenant A` recibe un código de estado `404 Not Found` o `403 Forbidden` cuando intenta acceder a recursos del `Tenant B`.

---

## 4. REGLAS DE FRONTEND (CLOUDFLARE PAGES / WORKERS)

1. **Compatibilidad con Edge Runtime**:
   - No usar librerías nativas de Node.js que dependan de C++ o APIs no soportadas en V8 isolates de Cloudflare (evitar dependencias pesadas innecesarias).
2. **Manejo Seguro de Sesiones**:
   - Los tokens de sesión nunca deben guardarse en `localStorage` si son vulnerables a XSS. Se recomienda almacenamiento en memoria o cookies `HttpOnly`, `Secure`, `SameSite=Lax/Strict`.
3. **Indexación y SEO (Web Indexing)**:
   - Las páginas públicas deben renderizarse con SSR (Server-Side Rendering) o SSG (Static Site Generation) para garantizar que los motores de búsqueda rastreen el contenido.
   - Todo layout o vista pública debe incluir metadatos dinámicos (`title`, `description`, etiquetas OpenGraph, Twitter Cards, `canonical URL`) y generación automática de `sitemap.xml` y `robots.txt`.

---

## 5. REGLAS DE BACKEND Y BASE DE DATOS (HOSTING PROPIO)

1. **Contenerización Completa**:
   - Todo servicio de backend y base de datos debe ejecutarse bajo **Docker y Docker Compose**.
   - Prohibido depender de configuraciones globales del sistema operativo host.
2. **Migraciones Versionadas**:
   - Ningún cambio en la base de datos se realiza manualmente. Todos los cambios se aplican mediante scripts de migración versionados y reproducibles.
3. **Optimización e Indexación de Base de Datos**:
   - Todo campo utilizado en cláusulas `WHERE`, `JOIN` u `ORDER BY` debe contar con el índice adecuado.
   - Las consultas complejas deben verificarse con `EXPLAIN ANALYZE` para erradicar escaneos secuenciales masivos (*Sequential Scans*).

---

## 6. REGLAS DE CI/CD (GITHUB ACTIONS)

1. **Pipeline de Integración Continua (CI)**:
   - Todo commit/PR debe pasar:
     1. Linter y chequeo de tipos estático (ej: ESLint, TypeScript `tsc --noEmit`, Ruff/Mypy).
     2. Suite de pruebas unitarias y de integración.
     3. Escaneo de vulnerabilidades en dependencias (`npm audit`, Trivy o Semgrep).
2. **Pipeline de Despliegue Continuo (CD)**:
   - Frontend: Despliegue automatizado a Cloudflare Pages mediante Wrangler Action o integración nativa.
   - Backend: Despliegue automatizado al hosting propio vía SSH seguro usando llaves privadas en GitHub Secrets y ejecución de `docker compose pull && docker compose up -d --build` junto con migraciones automáticas.

---

## 7. PROTOCOLO DE RESPUESTA Y APRENDIZAJE

Cuando el usuario pida implementar una función, el agente debe seguir este flujo de 4 pasos:

1. **Concepto y Rationale (Aprender)**: Explicar en 2 o 3 párrafos claros qué se va a hacer y por qué se toman esas medidas de seguridad.
2. **Definición de Tipos y Validación**: Definir los esquemas de validación de datos primero.
3. **Implementación Segura**: Escribir el código limpio, modular, tipado y documentado con comentarios que enseñen buenas prácticas.
4. **Verificación y Prueba**: Proporcionar el comando de prueba (ej: `curl` o test unitario) para validar tanto el camino feliz como el caso de intento de hackeo/bypass.
