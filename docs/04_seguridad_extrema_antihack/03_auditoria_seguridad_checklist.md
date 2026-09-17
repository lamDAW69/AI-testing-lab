# Módulo 04.3 — Checklist de Auditoría de Seguridad y Pentesting

Utiliza esta lista de verificación antes de lanzar cualquier nueva funcionalidad o despliegue a producción.

---

## 📋 Checklist Rápido de Pre-Producción

### 1. Autenticación y Autorización
- [ ] **Validación de Firma**: ¿Todos los endpoints protegidos verifican la firma criptográfica del JWT (JWKS) y su fecha de expiración?
- [ ] **Anti-BOLA/IDOR**: ¿Toda consulta a la base de datos incluye `WHERE tenant_id = $tenant`?
- [ ] **UUIDs**: ¿Todos los IDs expuestos en URLs son UUIDs no secuenciales?
- [ ] **BFLA (Roles)**: ¿Los endpoints administrativos (`/api/admin/...`, `/api/tenants/...`) comprueban que el rol sea `owner` o `admin`?
- [ ] **Tests de Aislamiento**: ¿Existe al menos un test automatizado que intente forzar el acceso con un token de otro tenant y verifique que responde `404`?

### 2. Entradas y Salidas de Datos
- [ ] **Validación de Esquemas**: ¿Todas las peticiones entrantes pasan por validadores Zod / Pydantic con `.strict()` activado?
- [ ] **Anti-SQLi**: ¿El 100% de las consultas a la base de datos están parametrizadas con placeholders (`$1, $2`)?
- [ ] **Paginación Obligatoria**: ¿Todos los endpoints que devuelven listas tienen límites máximos estrictos (ej: `LIMIT 50`) para evitar ataques DoS por consumo de memoria?
- [ ] **Filtrado de Respuestas**: ¿Se ocultan contraseñas, hashes o datos confidenciales antes de enviar la respuesta JSON?

### 3. Red e Infraestructura
- [ ] **CORS Restrictivo**: ¿Está `Access-Control-Allow-Origin` configurado explícitamente con el dominio de Cloudflare Pages en lugar de `*`?
- [ ] **Firewall VPS (UFW)**: ¿Está cerrado el puerto de PostgreSQL (5432) al tráfico público de internet?
- [ ] **HTTPS / TLS**: ¿El tráfico frontend y backend se transmite exclusivamente sobre HTTPS con TLS 1.2 o superior?
- [ ] **Cabeceras de Seguridad**: ¿Están presentes `Content-Security-Policy`, `X-Content-Type-Options: nosniff` y `X-Frame-Options: DENY`?

### 4. Secretos y Entorno
- [ ] **Zero Secrets en Git**: ¿Se ha comprobado que `.env` está en el `.gitignore` y que ninguna clave de API ni secreto de Supabase está subido a GitHub?
- [ ] **Service Role de Supabase Protegido**: ¿La clave con privilegios `service_role` de Supabase está ausente del código de frontend?
- [ ] **Manejo de Errores Limpio**: ¿Los errores en producción devuelven mensajes genéricos sin exponer rutas del servidor o trazas internas de la base de datos?

---

## 🛠️ Herramientas de Pentesting Recomendadas para Aprender

1. **OWASP ZAP (Zed Attack Proxy)**: Escáner gratuito de seguridad para lanzar ataques simulados contra tu API y detectar cabeceras faltantes o inyecciones.
2. **Postman / Insomnia**: Para probar manualmente alterar el `tenant_id` y los tokens JWT y verificar las respuestas HTTP.
3. **Semgrep**: Herramienta de análisis estático de código (SAST) que busca patrones de código vulnerable automáticamente.
