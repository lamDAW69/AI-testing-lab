# Módulo 06.1 — Indexación Web y SEO Técnico en el Edge (Cloudflare)

Cuando hablamos de **indexación** en desarrollo web, el primer pilar fundamental es la **indexación en motores de búsqueda (SEO)**: garantizar que Google, Bing y los rastreadores web puedan descubrir, leer y clasificar tu contenido público sin fricción.

---

## 🔍 ¿Por qué las SPAs tradicionales fallan en Indexación?

En una SPA (Single Page Application) tradicional de React o Vue:
1. El servidor envía un archivo HTML prácticamente vacío: `<div id="root"></div>` con un archivo JavaScript pesado.
2. Los bots de búsqueda (como Googlebot) deben descargar, compilar y ejecutar el JavaScript para ver el contenido.
3. Si el bot tiene un tiempo de espera ajustado (*crawl budget*) o no ejecuta JavaScript moderno, tu página indexará una pantalla en blanco.

---

## ⚡ La Solución: SSR / SSG en el Edge de Cloudflare

Con frameworks modernos como **Astro** o **Next.js**:
* **SSG (Static Site Generation)**: Las páginas públicas (landing, blog, documentación, catálogo público) se compilan previamente a HTML puro estático. Cuando un bot llega, recibe el contenido completo en menos de 30 milisegundos.
* **SSR (Server-Side Rendering)**: Para páginas con datos dinámicos que cambian con frecuencia, Cloudflare Worker renderiza el HTML en el servidor antes de enviarlo al cliente.

---

## 📑 Los 4 Elementos Obligatorios para una Indexación Perfecta

### 1. Metadatos Dinámicos y OpenGraph en el `<head>`
Toda página pública debe contener etiquetas descriptivas únicas y etiquetas canónicas para evitar contenido duplicado:

```html
<head>
  <!-- Metadatos Básicos -->
  <title>Trastero Seguro — Alquiler de Trasteros Inteligentes</title>
  <meta name="description" content="Encuentra y gestiona tu espacio de almacenamiento privado con acceso 24/7 y seguridad biométrica." />
  <link rel="canonical" href="https://tu-dominio.com/trasteros/madrid-centro" />

  <!-- OpenGraph (Para cuando se comparte en WhatsApp, Twitter, LinkedIn) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Trastero Seguro — Alquiler de Trasteros" />
  <meta property="og:description" content="Espacio de almacenamiento privado con acceso 24/7." />
  <meta property="og:image" content="https://tu-dominio.com/og-image.jpg" />
  <meta property="og:url" content="https://tu-dominio.com/trasteros/madrid-centro" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

### 2. Datos Estructurados Schema.org (JSON-LD)
Los datos estructurados permiten que Google entienda exactamente qué representa la página y muestre *Rich Snippets* (estrellas de valoración, precios, disponibilidad):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trastero Mediano 5m²",
  "image": "https://tu-dominio.com/img/trastero-5m.jpg",
  "description": "Espacio ventilado con alarma individual.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "65.00",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 3. Generación Dinámica de `sitemap.xml`
El sitemap es el mapa que le dice a los motores de búsqueda todas las URLs que existen en tu sitio:

```typescript
// Ejemplo en Astro / Cloudflare: src/pages/sitemap.xml.ts
export async function GET() {
  const products = await fetchPublicProducts(); // Consulta a la API pública

  const urls = products.map((p) => `
    <url>
      <loc>https://tu-dominio.com/productos/${p.slug}</loc>
      <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://tu-dominio.com/</loc><priority>1.0</priority></url>
      ${urls}
    </urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
```

### 4. Archivo `robots.txt`
Indica qué partes del sitio rastrear y cuáles proteger de los bots:

```text
# public/robots.txt
User-agent: *
# Prohibir el rastreo del panel privado y endpoints de API
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Indicar la ubicación del sitemap
Sitemap: https://tu-dominio.com/sitemap.xml
```

---

## ⏱️ Optimización de Core Web Vitals en Cloudflare
Cloudflare Pages optimiza automáticamente:
1. **LCP (Largest Contentful Paint)**: Compresión HTTP/3 y Brotli activadas por defecto.
2. **CLS (Cumulative Layout Shift)**: Reserva de dimensiones de imágenes y fuentes web servidas desde el CDN sin saltos visuales.
