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

---

## 8. REGLAS ANTI-SLOP Y FIDELIDAD DE DATOS (ZERO-FICTITIOUS METRICS)

1. **Prohibición Absoluta de Métricas y Porcentajes Inventados**:
   - Queda estrictamente prohibido incrustar porcentajes fijos, barras de progreso o donas SVG con valores hardcodeados de mockups (ej: "82% de cobertura", "78% de éxito", "12,5 M€ ficticios").
   - Toda cifra o indicador visual debe derivarse matemáticamente del estado real (`data-context` / API). Si una métrica no tiene sentido estadístico en un contexto global (como la cobertura documental antes de evaluar un pliego específico), se debe mostrar el **recuento factual verificable** (ej: "X acreditaciones registradas") en lugar de un porcentaje arbitrario.
2. **Erradicación de Componentes Inertes o Promesas Falsas**:
   - Prohibido dejar componentes visuales que simulen capacidades inexistentes en el backend (ej: cajas de chatbot genérico sin backend conversacional conectado, zonas *drag & drop* de subida de PDF sin endpoint de ingesta, o botones interactivos con `onClick` vacíos).
   - Todo componente interactivo debe estar conectado a un handler real o eliminarse de la vista.
3. **Alineación Semántica de Pestañas (No-Duplication)**:
   - Cada pestaña en una vista debe representar una entidad diferenciada del modelo de datos.
   - Prohibido crear pestañas redundantes (ej: tener "Capacidades" y "Experiencia" renderizando la misma lista de evidencias). Las subdivisiones dentro de una colección deben modelarse como **chips de filtro por categoría** (`category`).

---

## 9. PARIDAD DE ENUMS Y AUTORIDAD DE ESTADOS (CANONICAL ENUM PARITY)

1. **Paridad Canónica Frontend-Backend**:
   - Los tipos y badges de estado en el cliente deben mantener paridad estricta con los enums canónicos de la base de datos (`api/src/db/schema.ts`):
     - Elegibilidad: `POTENTIALLY_ELIGIBLE`, `NEEDS_REVIEW`, `POTENTIALLY_INELIGIBLE` (admitiendo alias de backend como `ELIGIBLE`).
     - Decisión: `PURSUE`, `REVIEW`, `DISCARD`, `UNDECIDED`.
     - Validez: `VALID`, `REQUIRES_REANALYSIS`, `STALE`.
     - Severidad y tipo de alertas: `CRITICAL`, `WARNING`, `INFO`; `DOCUMENT_CHANGE`, `DEADLINE_APPROACHING`, `NEW_TENDER_MATCH`.
2. **Principio de Autoridad en Declaraciones**:
   - Los operadores y usuarios del cliente solo tienen autorización para registrar datos con estado inicial `DECLARED` o `PENDING_REVIEW`.
   - Prohibido que una acción de usuario en el frontend asigne directamente el estado `VERIFIED`. La verificación es una potestad exclusiva de validadores oficiales o del motor de análisis del backend.

---

## 10. SEPARACIÓN DE IDENTIDADES: USUARIO VS. ENTIDAD JURÍDICA (TENANT)

1. **Aislamiento de Responsabilidades**:
   - **Cuenta de Usuario (Configuración / Settings)**: Gestiona la identidad personal autenticada del operador (`auth.users` / Supabase Auth: correo electrónico, nombre, contraseña, preferencias personales).
   - **Dossier de Empresa (Dossier)**: Gestiona la entidad jurídica mercantil que licita (`company_profiles`, `company_certifications`, `company_dossier_items`: CIF/NIF, solvencia técnica, solvencia económica, certificaciones ENS/ISO).
2. **Prohibición de Duplicidad Funcional**:
   - No duplicar formularios de edición corporativa dentro del perfil de usuario personal ni viceversa.

---

## 11. PROTOCOLO DE PRUEBAS EN ENTORNO LOCAL (WINDOWS / POWERSHELL)

1. **Scripts Limpios vs. Comandos Inline**:
   - Al ejecutar pruebas automatizadas o diagnósticos con Node.js desde PowerShell, **nunca** usar sentencias inline extensas `node -e "..."` con comillas dobles anidadas, ya que PowerShell corrompe las comillas y genera errores de sintaxis (`SyntaxError: Invalid or unexpected token`).
   - Se debe escribir un archivo de script temporal (`.mjs` o `.js`) en el directorio de `scratch/` y ejecutarlo de forma limpia con `node <ruta_al_script>`.
2. **Verificación de Consola y Rutas**:
   - Toda refactorización de frontend debe verificar que no se introducen `console.error` ni advertencias de React Router en consola (usar flags de futuro `v7_relativeSplatPath` y `v7_startTransition`).

---

## 12. PROTOCOLO OBLIGATORIO PARA AUTH, DEMO Y CORREO TRANSACCIONAL

Estas reglas nacen de incidencias reales de login, demo, altas y recuperación de contraseña. Son obligatorias antes de declarar una entrega de autenticación como correcta.

1. **Rutas y contratos canónicos**:
   - Las rutas técnicas de autenticación se escriben en inglés: `/login`, `/signup`, `/forgot-password` y `/reset-password`.
   - Todo valor usado como `redirectTo` debe corresponder exactamente a una ruta registrada en React Router y a una URL incluida en la allow-list de Supabase Auth. Verificar ambas cosas antes de desplegar.
   - Los textos pueden estar en español, pero no se traducen las rutas, nombres de métodos de Supabase ni contratos técnicos.

2. **Recuperación de contraseña segura**:
   - La solicitud usa `supabase.auth.resetPasswordForEmail` con una URL de retorno permitida y siempre muestra una respuesta no enumerativa: nunca confirma si un correo existe.
   - El cambio final sólo se hace en `/reset-password`, usando la sesión de recuperación validada por Supabase y `updateUser({ password })`. Exigir 12 caracteres como mínimo y confirmación local de la contraseña.
   - Los errores del proveedor se traducen a mensajes accionables sin devolver texto crudo ni revelar usuarios, sesiones, tokens o configuración.

3. **Demo aislada de Auth real**:
   - La demo es una identidad efímera explícita, nunca un alias de credenciales arbitrarias ni de un usuario real.
   - Un callback asíncrono de Supabase sin sesión no puede sobrescribir una identidad demo elegida explícitamente.
   - Un `401` de la API para el token efímero de demo no puede cerrar la demo; el mismo `401` sí debe cerrar una sesión real. Cubrir ambos casos con pruebas.
   - Las pruebas no pueden depender de `navigator.webdriver`: añadir al menos un caso que lo fuerce a `undefined` y reproduzca el comportamiento de un navegador real.

4. **Correo transaccional y pruebas de producción**:
   - Antes de probar confirmaciones o recuperación en producción, comprobar `Authentication > URL Configuration`, las plantillas, el proveedor SMTP y las cuotas de envío.
   - El SMTP predeterminado de Supabase es sólo para pruebas, tiene entrega best-effort y una cuota muy baja. Está prohibido declararlo apto para producción. Configurar SMTP propio antes de habilitar flujos de alta o recuperación para usuarios reales.
   - Usar una cuenta de prueba autorizada y un buzón accesible; no usar dominios ficticios ni asumir que el mensaje llegó. Verificar la recepción, el enlace de un solo uso, el cambio de contraseña y el login posterior.
   - Si se alcanza una cuota, mostrar un mensaje explícito de límite temporal, no un error genérico. No reintentar automáticamente ni disparar múltiples correos.

5. **Criterio de salida y despliegue**:
   - Para cambios de Auth: ejecutar pruebas unitarias de utilidades/validación, E2E de rutas y formularios, chequeo de tipos y build.
   - Las pruebas de integración de API requieren `TEST_ADMIN_DATABASE_URL` y `TEST_RUNTIME_DATABASE_URL` de una base de datos de pruebas aislada. Está prohibido sustituirlas por credenciales de producción, omitir el fallo o afirmar que integración pasó si esas variables no existen.
   - Tras el CD, validar sobre `https://pliegoai.com` el bundle recién publicado y el flujo afectado. Un test local verde no sustituye esta comprobación.
   - Si el cambio sólo toca frontend, el pipeline debe seguir informar del resultado de ambos jobs; no afirmar que backend cambió si no contiene modificación funcional.
