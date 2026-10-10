# PliegoAI — Wireframe funcional y requisitos del frontend

> **Estado:** especificación previa a la implementación
> **Ámbito:** aplicación privada de PliegoAI en Cloudflare Pages
> **No es:** un diseño visual final, una guía de estilos ni una ampliación del contrato de API.

---

## 1. Objetivo

El frontend debe permitir que una persona de una organización use, entienda y audite el ciclo ya construido en el backend:

```text
Catálogo público → análisis del tenant → requisitos y evidencias → decisión → portfolio y alertas
```

La prioridad no es producir una interfaz decorativa. Es evitar que una causa bloqueante, una incertidumbre o una modificación documental se oculten detrás de una puntuación agregada. Toda conclusión debe conducir al requisito, a su cita oficial y, cuando exista, a la evidencia privada que la respalda.

La aplicación se servirá inicialmente desde **Cloudflare Pages**. El panel autenticado no necesita indexación SEO; las futuras páginas públicas de marketing sí deberán usar SSG o SSR y sus metadatos correspondientes.

## 2. Arquitectura de navegación

La aplicación privada vivirá bajo `app.pliegoai.com`. El dominio raíz `pliegoai.com` queda reservado para la página pública/marketing. El frontend nunca almacena secretos de servidor ni llama a rutas internas de la API.

```text
/login
/recuperar-acceso

/app
├── /inicio                 Resumen operativo y alertas prioritarias
├── /catalogo               Expedientes públicos y filtros deterministas
├── /oportunidades/:id      Ficha de expediente y acceso al análisis propio
├── /portfolio              Oportunidades ya analizadas por el tenant
├── /portfolio/:tenderId    Detalle de oportunidad, análisis y decisión
├── /alertas                Bandeja persistente de alertas
├── /dossier                Perfil, certificaciones y evidencias empresariales
└── /configuracion          Cuenta, organización y miembros (solo cuando exista API)
```

`/app` debe exigir una sesión válida. Si una persona pertenece a más de una organización, la cabecera `X-Tenant-ID` solo se enviará tras seleccionar una membresía que el backend haya validado; nunca se tomará de la URL ni de un campo editable.

## 3. Estructura persistente de la aplicación

Este es el wireframe estructural de escritorio. En móvil, la barra lateral se convierte en menú accesible y las columnas pasan a una sola columna, sin perder alertas, bloqueos ni acciones.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Logo PliegoAI │ Organización activa ▾ │ Buscar… │ Alertas (n) │ Perfil ▾  │
├───────────────┬────────────────────────────────────────────────────────────┤
│ Inicio        │ Breadcrumb / título / estado de carga                       │
│ Catálogo      ├────────────────────────────────────────────────────────────┤
│ Portfolio     │ Contenido específico de la ruta                             │
│ Alertas       │                                                            │
│ Dossier       │ - filtros y búsqueda cuando apliquen                        │
│               │ - datos, estados y paginación                              │
│ ───────────   │ - errores recuperables y estados vacíos                     │
│ Configuración │                                                            │
│ Cerrar sesión │                                                            │
└───────────────┴────────────────────────────────────────────────────────────┘
```

Elementos obligatorios en todas las rutas autenticadas:

- Organización activa y rol actual visibles, sin permitir inventar o editar el `tenant_id`.
- Indicador de alertas no leídas que lleva a la bandeja filtrada.
- Estado explícito de carga, error y ausencia de datos; nunca una página aparentemente vacía que parezca un resultado válido.
- Cierre de sesión visible.
- Mensajes de éxito o fallo que no incluyan JWT, errores internos, documentos completos ni datos de otra organización.

## 4. Pantallas y contenidos

### 4.1 Acceso y selección de organización

```text
┌──────────────────────── Acceso a PliegoAI ────────────────────────┐
│ Correo electrónico                                                  │
│ Contraseña / enlace seguro de acceso                                │
│ [Iniciar sesión]                                                    │
│                                                                     │
│ Tras iniciar: si hay varias organizaciones, seleccionar una         │
│ membresía válida antes de entrar al panel.                          │
└───────────────────────────────────────────────────────────────────┘
```

Debe incluir:

- Estados de sesión expirada, enlace de acceso caducado y cuenta sin membresía.
- Selección de organización solo a partir de las membresías devueltas por un servicio autenticado. **La API actual todavía no expone un endpoint de membresías**, por lo que esta pantalla queda marcada como dependencia de backend antes de implementarla para usuarios multi-tenant.
- Sin mensajes que revelen si existe una cuenta para un correo concreto durante recuperación de acceso.

### 4.2 Inicio

Propósito: orientar a la persona antes de abrir una oportunidad concreta.

```text
┌──────────────────────────── Inicio ───────────────────────────────┐
│ [Alertas no leídas] [Requieren reanálisis] [Plazos próximos]       │
├───────────────────────────┬────────────────────────────────────────┤
│ Acciones prioritarias      │ Actividad reciente                      │
│ • Adenda: reanalizar ...   │ • Análisis completado                   │
│ • Plazo ajustado ...       │ • Decisión registrada                   │
│ [Ver alertas]              │ [Ver portfolio]                         │
├───────────────────────────┴────────────────────────────────────────┤
│ Oportunidades a revisar (tabla reducida del portfolio)             │
└───────────────────────────────────────────────────────────────────┘
```

Debe consumir agregados de portfolio y alertas. No debe ejecutar IA ni crear análisis al cargar. Si no hay oportunidades, el estado vacío debe dirigir primero a **Catálogo** y después a **Dossier**, explicando por qué la evidencia empresarial mejora la precalificación.

### 4.3 Catálogo de licitaciones

Propósito: buscar expedientes públicos antes de que una organización decida analizarlos.

```text
┌──────────────────────────── Catálogo ─────────────────────────────┐
│ Buscar por texto… [CPV] [Territorio] [Importe] [Plazo] [Estado]    │
├───────────────────────────────────────────────────────────────────┤
│ Expediente | Órgano | Importe | Fecha límite | Estado | [Ver]      │
│ ...                                                               │
│ Paginación                                                         │
└───────────────────────────────────────────────────────────────────┘
```

- Solo filtros soportados por `GET /api/public/tenders`; las etiquetas no deben sugerir filtros inexistentes.
- La vista es de datos públicos. Aun así, las acciones de crear o ejecutar análisis requieren sesión y rol `owner`, `admin` o `analyst`.
- Cada fila abre `/oportunidades/:id`; no debe exponer rutas de administración de ingesta ni el secreto de ingesta.

### 4.4 Ficha de expediente y creación de análisis

Propósito: mostrar los datos oficiales antes de consumir recursos de IA del tenant.

```text
┌──────────────────── Expediente: título / referencia ──────────────┐
│ Estado oficial · Órgano · Importe · Fecha límite · CPV             │
│ [Documentos y versiones] [Eventos] [Abrir análisis de mi empresa] │
├─────────────────────────────┬─────────────────────────────────────┤
│ Resumen oficial              │ Antes de analizar                    │
│ lotes, descripción, plazos   │ versión documental seleccionada       │
│                              │ dossier: completo / pendiente         │
└─────────────────────────────┴─────────────────────────────────────┘
```

- Documentos: nombre, tipo, fecha de obtención, versión y hash. El hash es evidencia de inmutabilidad, no un enlace de descarga por sí mismo.
- Al pulsar **Abrir análisis**, seleccionar una versión documental concreta y crear una clave de idempotencia UUID en el cliente para `POST /api/qualification/analyses`.
- La confirmación debe explicar que el análisis usa únicamente la evidencia de la organización activa y puede consumir presupuesto de IA. No se afirma elegibilidad jurídica.
- Si existe un análisis vigente, la ruta debe enlazarlo en vez de crear duplicados.

### 4.5 Portfolio

Propósito: es la vista de trabajo diaria de oportunidades ya analizadas.

```text
┌──────────────────────────── Portfolio ────────────────────────────┐
│ [Decisión] [Elegibilidad] [Vigencia] [CPV] [Importe] [Plazo]       │
│ [Con bloqueos] Buscar…                                             │
├───────────────────────────────────────────────────────────────────┤
│ Oportunidad │ Elegibilidad │ Decisión │ Plazo │ Evidencia │ Estado │
│ ...                                                               │
│ Paginación                                                         │
└───────────────────────────────────────────────────────────────────┘
```

Columnas mínimas:

- Expediente, órgano y referencia.
- Elegibilidad potencial y motivo bloqueante resumido, si existe.
- Decisión humana actual (`UNDECIDED`, `PURSUE`, `REVIEW`, `DISCARD`).
- Fecha límite y estado de plazo.
- Cobertura de evidencia, sin transformarla en una garantía de cumplimiento.
- Vigencia del análisis (`VALID`, `STALE`, `REQUIRES_REANALYSIS`).

Los filtros corresponden exactamente a `GET /api/portfolio`: decisión, elegibilidad, vigencia, CPV, rango de importe, intervalo de plazo, bloqueos, búsqueda y paginación. Consultar o filtrar el portfolio no activa un modelo de IA.

### 4.6 Detalle de oportunidad y análisis

Esta es la pantalla central del producto. Debe usar jerarquía visual de riesgo: los bloqueos y cambios documentales se ven antes que los indicadores favorables.

```text
┌──────────────────── Oportunidad / análisis ───────────────────────┐
│ [REQUIRES_REANALYSIS]  Fecha límite: 12 días  [Ver expediente]     │
│ Elegibilidad: NECESITA REVISIÓN / POTENCIALMENTE INELEGIBLE        │
│ Bloqueos: • garantía provisional sin evidencia                     │
│ [Reanalizar] [Pursue] [Review] [Discard]                           │
├───────────────────────────────┬───────────────────────────────────┤
│ 7 dimensiones explicables      │ Decisión y auditoría              │
│ Elegibilidad potencial          │ decisión actual / autor / fecha   │
│ Encaje técnico                  │ motivo obligatorio                 │
│ Encaje económico                │ historial de decisiones            │
│ Capacidad operativa             │                                   │
│ Riesgo contractual              │                                   │
│ Plazo                           │                                   │
│ Cobertura de evidencia          │                                   │
├───────────────────────────────────────────────────────────────────┤
│ Requisitos evaluados                                                │
│ [Estado] requisito | obligatoriedad | confianza | cita | evidencia │
│ Al abrir: cita literal + versión documental + evidencia vinculada  │
└───────────────────────────────────────────────────────────────────┘
```

Reglas funcionales:

- Mostrar siempre el análisis, su versión documental, fecha y estado de invalidez. Un análisis `STALE` o `REQUIRES_REANALYSIS` no puede presentarse como vigente.
- Las siete dimensiones se presentan por separado; no se mostrará un porcentaje global ni una recomendación opaca.
- Para cada requisito: estado, obligatoriedad, confianza, razonamiento, cita literal verificable, versión de documento y evidencias asociadas. Si no hay evidencia, mostrar `UNKNOWN`, no “incumple”.
- `NOT_SUPPORTED` en un requisito obligatorio y los motivos objetivos del plazo deben permanecer visibles aunque otras dimensiones sean altas.
- La acción **Reanalizar** debe dejar claro qué versión se usará. Solo roles `owner`, `admin` y `analyst` pueden crear, ejecutar o reejecutar análisis.
- Las acciones **Pursue**, **Review** y **Discard** abren un modal con motivo obligatorio de 5 a 5.000 caracteres y muestran la versión del análisis a la que se aplica. La decisión no modifica el resultado del agente.
- El botón de decisión debe estar oculto o deshabilitado para `reviewer`, `viewer` y `member`, con una explicación de permiso. El backend sigue siendo la autoridad definitiva.

### 4.7 Bandeja de alertas

```text
┌──────────────────────────── Alertas ──────────────────────────────┐
│ [No leídas] [Severidad] [Tipo]                                    │
├───────────────────────────────────────────────────────────────────┤
│ CRITICAL · Cambio documental · Expediente X · hace 2 h             │
│ Mensaje resumido              [Abrir oportunidad] [Marcar leída]   │
│ WARNING  · Plazo próximo ...                                      │
│ Paginación                                                         │
└───────────────────────────────────────────────────────────────────┘
```

- Filtros: estado, severidad, tipo y expediente, igual que `GET /api/alerts`.
- Una alerta se abre en la oportunidad correspondiente; no se elimina como manera de ocultar la invalidez del análisis.
- `owner`, `admin` y `analyst` pueden marcar una alerta como leída, marcarlas todas o descartarlas. Los demás roles son de solo lectura.
- El producto actual ofrece bandeja interna persistente; no debe prometer correo, notificaciones push ni entrega externa.

### 4.8 Dossier de empresa

```text
┌──────────────────────────── Dossier ──────────────────────────────┐
│ Perfil de empresa [Editar]                                         │
│ servicios/CPV · territorios · rango económico · capacidad          │
├─────────────────────────────┬─────────────────────────────────────┤
│ Certificaciones              │ Evidencias                          │
│ nombre · emisor · vigencia   │ categoría · título · vigencia        │
│ estado: DECLARED/…           │ referencia documental                │
│ [Añadir]                     │ [Añadir evidencia]                  │
└─────────────────────────────┴─────────────────────────────────────┘
```

- Separar claramente `DECLARED`, `VERIFIED`, `EXPIRED`, `PENDING_REVIEW` y `REJECTED`. La edición de usuario solo puede declarar; la UI nunca permite marcar manualmente una evidencia como verificada.
- Validar importes, CPV, fechas y límites en el cliente para una experiencia clara, pero tratar la validación Zod del backend como obligatoria.
- Crear y editar perfil/certificaciones/evidencias solo para `owner`, `admin` y `analyst`; los demás pueden ver lo autorizado por la API.
- No se prevé todavía subida de binarios desde el navegador: se mostrarán referencias documentales existentes. La carga de archivos requiere un contrato específico con validación MIME, tamaño, sellado y almacenamiento aislado antes de añadirse al frontend.

### 4.9 Configuración

En la primera entrega solo contendrá cuenta, sesión y la organización activa en modo lectura. La gestión de miembros, invitaciones, roles, retención o eliminación de datos **no debe aparecer como acción** hasta existir endpoints autenticados y pruebas anti-BOLA para esas operaciones.

## 5. Matriz de permisos de interfaz

| Acción | owner/admin/analyst | reviewer | viewer/member |
|---|---:|---:|---:|
| Ver catálogo público | Sí | Sí | Sí |
| Ver portfolio, alertas, análisis y dossier | Sí | Sí | Sí |
| Crear/ejecutar/reanalizar análisis | Sí | No | No |
| Registrar decisión | Sí | No | No |
| Editar perfil, certificaciones y evidencias | Sí | No | No |
| Marcar/descartar alertas | Sí | No | No |

La matriz solo mejora la experiencia; cada petición sigue enviándose al backend, que vuelve a comprobar JWT, membresía, rol, tenant y RLS. No basta con ocultar un botón.

## 6. Contrato del frontend con la API existente

| Vista | Rutas API previstas |
|---|---|
| Catálogo y ficha pública | `GET /api/public/tenders`, `GET /api/public/tenders/:id` |
| Portfolio e inicio | `GET /api/portfolio`, `GET /api/portfolio/metrics`, `GET /api/portfolio/:tenderId` |
| Alertas | `GET /api/alerts`, `GET /api/alerts/stats`, `PATCH /api/alerts/:id/read`, `POST /api/alerts/mark-all-read`, `PATCH /api/alerts/:id/dismiss` |
| Dossier | `GET/PUT /api/dossier/profile`, `GET/POST/PATCH/DELETE /api/dossier/certifications`, `GET/POST /api/qualification/dossier` |
| Análisis y decisiones | `POST /api/qualification/analyses`, `POST /api/qualification/analyses/:id/run`, `GET /api/qualification/analyses/:id`, `POST /api/qualification/analyses/:id/decision` |
| Requisitos | `GET /api/requirements`, `GET /api/requirements/:id` |

Las rutas que todavía falten para un flujo concreto se documentarán como dependencia y no se simularán con datos falsos en producción.

## 7. Seguridad y comportamiento obligatorio

1. **Sesión:** adoptar el patrón BFF mediante Pages Functions/Worker: cookie `HttpOnly`, `Secure`, `SameSite=Lax` o `Strict`, y el Worker adjunta el `Authorization: Bearer` al VPS. El navegador no conserva el JWT en `localStorage` ni `sessionStorage`.
2. **Tenant:** el Worker/BFF solo reenvía `X-Tenant-ID` de una membresía confirmada; el usuario no puede modificarlo desde URL, formulario o almacenamiento local.
3. **CORS y CSP:** autorizar `https://app.pliegoai.com` en la API, definir CSP con `connect-src` limitado a Supabase, el BFF y los orígenes necesarios, y publicar `_headers` con HSTS, `frame-ancestors 'none'`, `nosniff` y `Referrer-Policy` restrictiva.
4. **Errores:** 401 redirige a inicio de sesión; 403 informa de falta de permiso; 404 no revela si el recurso existe en otro tenant; 429 informa del límite de trabajo y ofrece reintentar; 5xx muestra identificador de correlación, no detalles internos.
5. **Datos no confiables:** títulos, citas y documentos procedentes de licitaciones se renderizan como texto, nunca HTML. Ninguna instrucción incluida en un pliego altera la interfaz ni dispara acciones.
6. **Acciones costosas:** crear/executar/reanalizar requiere confirmación, idempotency key y estado visible (`PROCESSING`, éxito o fallo). No reintentar automáticamente una acción que pueda aumentar coste.
7. **Accesibilidad:** navegación por teclado, foco visible, etiquetas de formulario, contraste suficiente, estados que no dependan solo del color y texto alternativo donde corresponda.

## 8. Estados transversales que deben diseñarse antes del código

| Situación | Comportamiento esperado |
|---|---|
| Primera organización sin dossier | Explicar que se puede explorar catálogo, pero la cobertura será limitada; enlazar a Dossier. |
| Sin resultados del catálogo | Mantener filtros visibles y ofrecer limpiarlos. |
| Sin oportunidades en portfolio | Enlazar a Catálogo y describir cómo abrir un primer análisis. |
| Análisis `PROCESSING` | Indicador persistente, refresco controlado y prohibición de duplicar la ejecución. |
| Análisis inválido | Banner prioritario con motivo y acceso a reanálisis; conservar el histórico. |
| Requisito `UNKNOWN` | Decir “falta evidencia o revisión”, no “no cumple”. |
| API no disponible | Estado recuperable, reintento manual y sin inventar datos cacheados como actuales. |
| Sesión expirada | Cierre local y retorno seguro a `/login`; no perder datos de un formulario no enviado sin avisar. |

## 9. Orden de implementación recomendado

1. **Base segura:** proyecto de Cloudflare Pages, Pages Function/BFF, Supabase Auth, sesión con cookie HttpOnly, guardas de rutas, selección de tenant y cabeceras.
2. **Lectura de valor:** layout, catálogo, detalle de expediente, portfolio y alertas en modo lectura. Es suficiente para validar que el contrato de API es correcto sin permitir mutaciones.
3. **Trabajo del tenant:** dossier, creación y ejecución de análisis, seguimiento de estado y detalle de requisitos con citas/evidencias.
4. **Decisión controlada:** modal de decisión con motivo, permisos por rol, manejo de análisis invalidado y auditoría visible.
5. **Calidad de entrega:** pruebas de componentes, pruebas de integración BFF/API, caso e2e con dos tenants, revisión de CSP, accesibilidad y despliegue preview/producción en Cloudflare Pages.

## 10. Criterio de aceptación del wireframe

El diseño de interfaz estará listo para pasar a implementación cuando podamos recorrer sin ambigüedad este caso:

1. Una persona inicia sesión y entra en una organización válida.
2. Encuentra un expediente en el catálogo y consulta sus documentos/versiones.
3. Crea y ejecuta un análisis usando la evidencia de su dossier.
4. Entiende bloqueos, incertidumbres, siete dimensiones, citas y evidencias sin un score mágico.
5. Toma una decisión autorizada con motivo y trazabilidad.
6. Recibe una alerta por cambio documental, entiende que el análisis ha quedado inválido y lo reanaliza.
7. Un usuario de otra organización no puede inferir ni visualizar datos, filtros, alertas o resultados del primer tenant.

La siguiente tarea tras aprobar este documento es la **Fase de base segura del frontend**: elegir el framework concreto y crear el proyecto Cloudflare Pages con el BFF y autenticación antes de construir pantallas de negocio.
