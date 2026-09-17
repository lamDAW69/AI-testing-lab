# Módulo 04.2 — OWASP API Top 10 y Prevención de Bypasses

El proyecto debe implementar defensa en profundidad contra los 10 riesgos más críticos catalogados por la **OWASP (Open Web Application Security Project)** para APIs web.

---

## 🛡️ Matriz de Mitigación OWASP API Top 10

| Vulnerabilidad OWASP | En qué consiste | Cómo la neutraliza nuestra arquitectura |
| :--- | :--- | :--- |
| **API1: BOLA (Broken Object Level Authorization)** | Modificar IDs para acceder a recursos de otros. | Cláusula obligatoria `WHERE id = $1 AND tenant_id = $2` + RLS en Postgres + UUIDs. |
| **API2: Broken Authentication** | Robar o falsificar tokens, contraseñas débiles o falta de validación de firma. | Supabase Auth gestiona MFA/hashing. Backend valida firma asimétrica (JWKS) en cada petición. |
| **API3: Broken Object Property Level Authorization (Mass Assignment)** | Inyectar campos ocultos (ej: `is_admin: true`). | Validación de esquemas estrictos con **Zod `.strict()`** o **Pydantic**. Todo campo desconocido es descartado. |
| **API4: Unrestricted Resource Consumption (DoS)** | Saturar el servidor con peticiones masivas o consultas pesadas. | Paginación obligatoria en endpoints de lista (`limit` máx. 100), Rate Limiting en Cloudflare y en API. |
| **API5: Broken Function Level Authorization (BFLA)** | Usuarios normales invocando endpoints de administrador (`DELETE /api/tenants`). | Middleware de control de acceso basado en roles (RBAC) validando roles (`owner`, `admin`) antes de la lógica. |
| **API6: Unrestricted Access to Sensitive Business Flows** | Bots abusando de flujos de negocio (ej: compra masiva, scraping de precios). | Cloudflare Turnstile (Captcha invisible) + Rate Limiter adaptativo. |
| **API7: Server Side Request Forgery (SSRF)** | Hacer que el servidor haga peticiones a IPs internas (`http://localhost:5432` o metadata de nube). | No permitir URLs arbitrarias provistas por usuarios; si se requieren webhooks, validar contra lista blanca de dominios y bloquear IPs privadas RFC1918. |
| **API8: Security Misconfiguration** | Dejar puertos abiertos, mensajes de error con stack traces en producción, CORS abierto. | UFW cerrando puertos en VPS, `NODE_ENV=production` ocultando stack traces, CORS whitelist restrictivo. |
| **API9: Improper Inventory Management** | Dejar APIs antiguas (v1) sin parches accesibles públicamente. | Versionado estricto de rutas (`/api/v1/...`) y deprecación formal con cabeceras `Sunset`. |
| **API10: Unsafe Consumption of APIs** | Confiar ciegamente en datos devueltos por APIs de terceros. | Validación de esquemas de respuesta en cualquier cliente HTTP saliente. |

---

## 🛑 Anatomía de los Intentos de Bypass Más Comunes

### 1. Bypass por Manipulación de Cabeceras (`X-Forwarded-For`, `X-User-Id`)
* **El Ataque**: El atacante envía cabeceras como `X-Original-User-Id: 0000-admin` esperando que la API las use directamente para saltarse la autenticación.
* **La Defensa**: La API backend **NUNCA** lee cabeceras de usuario inventadas. La identidad proviene **únicamente** del token criptográfico firmado por Supabase en el encabezado `Authorization: Bearer <jwt>`.

### 2. Bypass por Confusión de Tipos (Type Juggling / Parameter Pollution)
* **El Ataque**: Enviar `id: ["1", "2"]` o un objeto `{ $ne: null }` para burlar consultas en MongoDB o SQL.
* **La Defensa**: Validación estricta con esquemas tipados (Zod) que comprueban que `id` sea una cadena con formato UUID válido antes de que toque la base de datos.

### 3. Inyección SQL (SQLi)
* **El Ataque**: Enviar `' OR 1=1 --` en un campo de búsqueda para vaciar la base de datos.
* **La Defensa**: **100% de consultas parametrizadas**. Queda terminantemente prohibida la interpolación directa de variables en cadenas SQL.

```typescript
// 🛡️ Middleware para Sanitizar y Prevenir Errores con Stack Traces
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[SERVER_ERROR]', err); // Log interno para el desarrollador

  // Si es un error de validación de Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Los datos enviados no cumplen con el formato requerido',
      issues: err.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
    });
  }

  // En producción NUNCA revelar detalles de la base de datos o librerías
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado. Por favor intenta más tarde.'
  });
}
```
