# Módulo 03.2 — Gestión Segura del Estado de Sesión en Frontend

En este módulo aprenderás cómo gestionar los tokens de autenticación de Supabase en el frontend de forma segura, evitando que un script malicioso (Cross-Site Scripting - XSS) robe la sesión de tus usuarios.

---

## ⚠️ El Gran Dilema: ¿Dónde guardar el Token JWT?

| Ubicación | Vulnerabilidad Principal | Nivel de Riesgo |
| :--- | :--- | :--- |
| **`localStorage` / `sessionStorage`** | Cualquier script XSS (ej: librería externa comprometida) puede leer `localStorage.getItem('token')` y enviarlo a un servidor atacante. | **ALTO** ❌ |
| **Memoria JavaScript (React State / Store)** | Desaparece al recargar la página. Inmune a lectura directa persistente de XSS. | **MEDIO** 🟡 |
| **Cookie `HttpOnly`, `Secure`, `SameSite=Lax`** | Inaccesible mediante `document.cookie` desde JavaScript. Inmune a XSS directo de robo de credenciales. Requiere protección CSRF si se usa cookie como auth directa. | **SEGURO** ✅ |

---

## 🛡️ Enfoque 1: Almacenamiento en Memoria con Refresco Automático (Recomendado para SPAs)

En este modelo:
1. El **Access Token** (de vida corta, ej: 15 minutos) se almacena únicamente en una variable de memoria dentro del cliente (Store / Context).
2. El **Refresh Token** se intercambia silenciosamente con el SDK de Supabase antes de que expire.

```typescript
// src/lib/api-client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl = import.meta.env.PUBLIC_API_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente HTTP personalizado que inyecta automáticamente el JWT válido
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // 1. Obtener la sesión activa de Supabase (el SDK gestiona el refresco automático)
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Sesión no activa. Redirigiendo a login...');
  }

  const token = session.access_token;

  // 2. Preparar headers
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  // 3. Ejecutar la petición a tu API en hosting propio
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Si la API propia rechaza el token, forzar cierre de sesión
    await supabase.auth.signOut();
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada');
  }

  return response;
}
```

---

## 🛡️ Enfoque 2: Patrón BFF (Backend-For-Frontend) con Cloudflare Workers

Para máxima seguridad en aplicaciones de misión crítica:
1. El frontend desplegado en Cloudflare Pages solo habla con una función Worker intermediaria (`/api/auth/...`).
2. El Worker recibe las credenciales, llama a Supabase Auth, y guarda el token en una cookie `HttpOnly; Secure; SameSite=Strict; Path=/`.
3. Cuando el navegador hace peticiones, la cookie viaja encriptada hacia el Worker, quien adjunta la cabecera `Authorization: Bearer <token>` antes de redirigir la llamada al VPS.
4. **Resultado**: El código JavaScript del navegador jamás tiene acceso al token JWT crudo.

---

## 🎓 Resumen de Buenas Prácticas:

1. **Tokens de Acceso de Vida Corta**: Configura en Supabase que el Access Token dure entre 15 y 30 minutos. Si un token llega a ser interceptado, caducará rápidamente.
2. **Cierre de Sesión Limpio**: Asegúrate de que el botón de *Logout* limpie tanto el estado local como la sesión en el servidor (`supabase.auth.signOut()`).
3. **CORS Restrictivo**: Recuerda que tu API en el VPS solo debe aceptar peticiones provenientes del dominio de tu frontend (`Access-Control-Allow-Origin: https://app.tu-dominio.com`), rechazando cualquier origen desconocido.
