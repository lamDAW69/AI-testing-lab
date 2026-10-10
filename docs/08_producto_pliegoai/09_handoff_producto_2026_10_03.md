# Handoff del producto Pliego AI 3 de octubre de 2026

Este documento permite retomar el trabajo sin perder el estado del producto, del despliegue ni de los cambios locales. La aplicación está publicada y visualmente renovada, pero el repositorio sigue teniendo cambios sin commit que hay que clasificar y validar antes de continuar con funcionalidades de datos reales.

## Estado del producto

Pliego AI es un SaaS B2B multi-tenant para identificar, analizar y decidir sobre licitaciones públicas. El frontend es React, TypeScript, Vite y Tailwind; se publica en Cloudflare Pages. La API TypeScript/Express, PostgreSQL y los procesos de ingesta viven en el VPS mediante Docker Compose. La autenticación se apoya en Supabase con JWT verificables.

Las reglas de `AGENTS.md` son obligatorias: toda operación privada debe aislarse por `tenant_id`, los JWT se verifican criptográficamente, las entradas se validan con Zod estricto y nunca se publican métricas ficticias ni controles visuales sin comportamiento real.

## Diseño y experiencia entregados

Se ha aplicado un sistema oscuro de superficies escalonadas inspirado en herramientas de trabajo de alta densidad, sin convertir la aplicación en un ERP genérico. Los tokens principales viven en `frontend/src/index.css`.

- La navegación autenticada comparte fondo oscuro, bordes finos, contraste alto, tipografía Geist y transiciones de ruta compatibles con `prefers-reduced-motion`.
- Inicio tiene jerarquía editorial, resumen factual del trabajo pendiente y flujos operativos conectados a rutas reales.
- Catálogo y Portfolio presentan sus filas como tablas densas en escritorio y como filas compactas de tres columnas por debajo de 1024 px. Ya no reservan las columnas ocultas de escritorio ni fuerzan scroll horizontal.
- Dossier se ha simplificado: el resumen es una única franja editorial y la pestaña de evidencias es una biblioteca de filas, no un mapa de tarjetas o un diagrama de entidades. Búsqueda, filtros, estados y acciones se conservan.
- Alertas, Configuración, Catálogo, Portfolio y Dossier usan `app-page-title`, con la misma escala, peso, tracking y altura de línea que el H1 de Inicio.
- Header y menú móvil son operables en pantallas pequeñas. En móvil el botón de búsqueda conserva nombre accesible y se reduce a icono para no comprimir los controles de alertas y cuenta.
- Los inputs y selects pasan a 16 px en móvil para evitar el zoom automático de iOS. Se respetan los safe areas del dispositivo.

Las rutas de aplicación comprobadas durante la revisión visual son Inicio, Catálogo, Portfolio, Alertas, Dossier, Configuración, detalle de licitación y detalle de análisis. Catálogo, Portfolio y Alertas se revisaron específicamente a 390 px de ancho; Dossier dispone de reglas responsive para su resumen y su lista de evidencias.

## Archivos de frontend más relevantes

| Área | Archivos principales | Motivo |
| --- | --- | --- |
| Sistema visual y responsive | `frontend/src/index.css` | Tokens, superficies, H1 compartido, filas responsive, safe areas y reducción de movimiento. |
| Shell y navegación | `frontend/src/components/layout/AppShell.tsx`, `Header.tsx`, `Sidebar.tsx` | Transición de ruta, menú móvil y activador de búsqueda accesible. |
| Vistas operativas | `frontend/src/pages/CatalogPage.tsx`, `PortfolioPage.tsx`, `AlertsPage.tsx`, `DossierPage.tsx`, `SettingsPage.tsx` | Jerarquía de página y adaptación visual de las rutas autenticadas. |
| Datos y detalles | `frontend/src/lib/data-context.tsx`, `frontend/src/pages/TenderDetailPage.tsx` | Adaptación del catálogo público y carga de documentos por licitación. Requiere validación con API real. |
| Tour y marca | `frontend/src/components/layout/ProductTourModal.tsx`, `SilkBackground.tsx`, `frontend/index.html` | Tour de demo y presentación visual. |

## Producción y despliegue

El proyecto de Cloudflare Pages se llama `licitaia-frontend` y tiene asociados `pliegoai.com`, `app.pliegoai.com` y `licitaia-frontend.pages.dev`.

El último despliegue de frontend comprobado es el de producción `eb8d2a14-c8a4-46fc-85a9-3438eb59928b`, disponible en `https://eb8d2a14.licitaia-frontend.pages.dev`. Se lanzó el 2 de octubre de 2026 desde el árbol de trabajo local, con `VITE_API_URL=https://api.pliegoai.com`. Después del despliegue se verificó que `https://pliegoai.com` servía los mismos assets generados.

Importante: el despliegue se etiquetó contra el commit `fd6b0ae2233e6d61f5a8881d814f714384ad3c1e` con `--commit-dirty=true`. El commit no contiene todos los cambios locales. Por tanto, la producción no es reproducible todavía mediante un commit limpio. Antes del siguiente despliegue, separar y versionar los cambios por alcance.

El workflow `.github/workflows/cd.yml` construye `frontend/dist`, publica Pages si están configurados los secretos de Cloudflare y despliega el backend en el VPS sólo cuando existen sus secretos. Los despliegues manuales anteriores afectaron únicamente a Pages; no se desplegó ni migró el backend.

## Validaciones realizadas

El 2 de octubre de 2026 se ejecutaron correctamente en `frontend/`:

```powershell
npm run lint
npm run build
npm run test:e2e
```

La suite Playwright terminó con 10 pruebas correctas. Durante las pruebas locales, Vite registró errores de proxy hacia `/api/*` porque la API no estaba levantada; el frontend siguió usando su fallback de demo. En el navegador de la demo no aparecieron errores ni advertencias de consola al revisar las rutas rediseñadas.

La compilación de producción advierte que el JavaScript principal supera 500 kB minificado. No bloquea el despliegue, pero conviene dividir las rutas o módulos pesados antes de ampliar la aplicación.

## Estado del árbol de trabajo

El árbol de trabajo no está limpio. Hay cambios de frontend, cambios sustanciales de ingesta PLACSP, una migración y pruebas nuevas sin commit. No se deben borrar ni resetear: pueden pertenecer a trabajo paralelo o a tareas pendientes.

Cambios de backend y datos detectados:

- `api/drizzle/0014_add_placsp_sync_and_publication_date.sql` y `api/drizzle/meta/_journal.json` incorporan estado de sincronización y fechas de publicación/actualización.
- `api/src/modules/procurement/connectors/placsp.connector.ts` y `scripts/run-ingest.ts` amplían la ingesta en vivo e histórica.
- Controlador, repositorio, esquema y servicio de procurement añaden listado de catálogo más rico, cursor/estado de sincronización y modo `historical`.
- `api/test/unit/placsp-connector.test.ts` y `api/test/unit/placsp-sync-state.test.ts` requieren ejecución y revisión antes de promover la ingesta.

Cambios adicionales de frontend que no deben suponerse revisados por completo:

- Soporte de tema con `frontend/src/lib/theme-context.tsx` y `frontend/src/components/ui/ThemeToggle.tsx` sin seguimiento de Git.
- Cambios en `data-context`, `TenderDetailPage`, `main.tsx`, Landing, tour, componentes UI y configuración de Tailwind.
- Directorios sin seguimiento `.agents/teamwork/` y `scratch/`. Confirmar su contenido y excluirlos del commit si son artefactos temporales.

## Trabajo pendiente priorizado

1. Crear commits limpios y separados: uno para el rediseño frontend y otro para la ingesta/migración PLACSP. No mezclar cambios de estilo, estado de datos y esquema de base de datos.
   `git diff --check` actualmente señala una línea en blanco final en `api/test/unit/placsp-connector.test.ts`; corregirla dentro del commit de ingesta.
2. Revisar la migración `0014` y ejecutar las pruebas de API en un entorno con PostgreSQL. Asegurar que las consultas y mutaciones nuevas conservan filtros por tenant cuando son privadas y que los recursos globales no exponen datos de tenants.
3. Validar la ingesta PLACSP con una ejecución controlada y pequeña. No lanzar rastreos históricos amplios en producción sin revisar límites, cursor, idempotencia y coste.
4. Levantar API y base de datos localmente para probar la aplicación contra datos reales, no sólo contra el fallback de demo. Verificar catálogo público, documentos de una licitación, portfolio, alertas, dossier y reanálisis.
5. Añadir o confirmar pruebas de fuga cross-tenant para cada endpoint privado modificado. Un tenant ajeno debe obtener 404 o 403.
6. Revisar CORS y cabeceras de la API desplegada. El frontend puede ser público, pero ningún endpoint autenticado debe permitir `Access-Control-Allow-Origin: *`.
7. Reducir el bundle principal con importaciones dinámicas por ruta y volver a medir la compilación.
8. Revisar la experiencia responsive de las rutas de detalle, onboarding, login y landing a 390 px, portátil y pantalla ultraancha. Las pantallas operativas principales ya están verificadas, pero no se ha completado una matriz visual de todos los flujos.

## Comandos útiles

```powershell
# Frontend
Set-Location frontend
npm run lint
npm run build
npm run test:e2e

# Build manual de Pages con la API pública
$env:VITE_API_URL = 'https://api.pliegoai.com'
npm run build
npm exec wrangler -- pages deploy dist --project-name=licitaia-frontend --branch=main

# API
Set-Location ../api
npm run typecheck
npm run test:unit
npm run test:integration
npm run ingest:placsp
```

No incluir secretos en comandos, documentos ni commits. Para producción, preferir una rama y CI con un commit limpio frente a volver a desplegar un árbol sucio.

## Punto de arranque recomendado

Empezar por el punto 1: revisar el diff, clasificar los cambios no relacionados y crear una base reproducible. Después levantar la API local y resolver cualquier diferencia entre los contratos reales y el fallback del frontend. Sólo entonces conviene ampliar la ingesta histórica o refinar más pantallas.
