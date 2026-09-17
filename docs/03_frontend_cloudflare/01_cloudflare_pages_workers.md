# Módulo 03.1 — Frontend en Cloudflare Pages y Workers

En este módulo aprenderás por qué Cloudflare Pages es la plataforma ideal para servir el frontend de tu aplicación, cómo aprovechar su red de distribución global (Edge CDN) y cómo configurar cabeceras de seguridad estrictas.

---

## ⚡ ¿Por qué Cloudflare Pages?

1. **Latencia Cercana a Cero**: El frontend se distribuye a más de 300 ciudades en todo el mundo. Los usuarios descargan HTML, CSS y JS desde el centro de datos más cercano a su ubicación física.
2. **Mitigación DDoS Ilimitada**: Cloudflare detiene ataques volumétricos automáticamente antes de que toquen tu servidor VPS.
3. **Soporte de Edge SSR y SSG**: Permite desplegar frameworks modernos como Astro, Next.js (OpenNext), SvelteKit o Nuxt con renderizado en el servidor para máxima indexabilidad (SEO).

---

## 🛠️ Opciones de Frameworks Recomendadas

1. **Astro + React / Vue / Svelte (Altamente Recomendado)**:
   - Rendimiento extremo (Zero JS por defecto en páginas estáticas de marketing/documentación).
   - Modo híbrido (SSR en rutas de autenticación y panel de control, SSG en páginas públicas para indexación).
   - Adaptador oficial: `@astrojs/cloudflare`.
2. **Next.js (con OpenNext / Cloudflare Pages)**:
   - Estándar de la industria para aplicaciones SaaS complejas.
3. **Vite + React SPA**:
   - Para paneles privados donde la indexación SEO no es prioritaria.

---

## 🛡️ Configuración de Cabeceras de Seguridad (`_headers`)

Cloudflare Pages permite definir cabeceras HTTP de seguridad global creando un archivo simple llamado `_headers` en la carpeta `public/` (o raíz de distribución):

```text
# public/_headers
/*
  # Evita que el sitio sea embebido en iframes (Anti-Clickjacking)
  X-Frame-Options: DENY
  # Evita que el navegador intente adivinar el tipo MIME (Anti-MIME Sniffing)
  X-Content-Type-Options: nosniff
  # Política de Referrer para no filtrar URLs con tokens
  Referrer-Policy: strict-origin-when-cross-origin
  # Control estricto de permisos del navegador (Micrófono, Cámara, Geolocalización)
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()
  # Fuerza HTTPS durante al menos 1 año
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  # Content Security Policy (Ajusta los dominios según tus necesidades)
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.tu-dominio.com; font-src 'self' data:; frame-ancestors 'none';
```

---

## 📦 Configuración de `wrangler.toml` (Cloudflare CLI)

Si utilizas Cloudflare Workers o Pages Functions para funciones auxiliares en el Edge:

```toml
name = "frontend-app"
compatibility_date = "2024-09-01"
pages_build_output_dir = "./dist"

[vars]
ENVIRONMENT = "production"
PUBLIC_API_URL = "https://api.tu-dominio.com"
PUBLIC_SUPABASE_URL = "https://tu-proyecto.supabase.co"
```

---

## 🚀 Despliegue con Wrangler CLI

Para desplegar manualmente desde tu terminal:
```bash
# Instalar Wrangler globalmente o usar npx
npm install -g wrangler

# Iniciar sesión en Cloudflare
wrangler login

# Desplegar la carpeta de salida
wrangler pages deploy dist --project-name=frontend-app
```
*(Nota: Más adelante en el Módulo 07 automatizaremos esto al 100% mediante GitHub Actions).*
