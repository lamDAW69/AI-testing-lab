# Pliego AI — Guía de Diseño Visual: Pestaña de Alertas

> **Objetivo:** Definir el lenguaje visual, tokens, anatomía de componentes y reglas de interacción para la pestaña de **Alertas**, alineándola estrictamente con los estándares editoriales, multi-tenant y de glassmorphism implementados en **Inicio, Catálogo, Portfolio y Dossier**.
>
> **Referencia visual:** Fondo translúcido 3D, superficies reflectantes con bisel especular interior, tipografía editorial *Newsreader* para títulos, badges semánticos rigurosos y separación nítida entre severidades.

---

## 1. Principio Rector de Alertas

Las alertas en Pliego AI **no son notificaciones sociales ni notificaciones genéricas de marketing**. Son **alertas operativas de contratación pública** con impacto directo en:

1. **Vigencia del análisis**: Si se publica una adenda o rectificación en PLACSP, el análisis previo queda invalidado.
2. **Plazos perentorios**: Fechas límite de presentación de ofertas que no admiten prórrogas extemporáneas.
3. **Bloqueos y solvencia**: Requisitos añadidos que exigen garantías o certificados no presentes en el dossier.

```text
CRITICIDAD REAL
→ REGLAS DE NEGOCIO
→ TRANSPARENCIA GLASSMORPHISM
→ TIPOGRAFÍA EDITORIAL
→ ACCIÓN DIRECTA (UN CLIC)
```

---

## 2. Composición y Jerarquía Visual

La vista de Alertas sigue la misma estructura de 4 niveles que Portfolio y Catálogo:

```text
1. HEADER EDITORIAL (Breadcrumb + Título Serif + Botón Lote)
   ↓
2. FILA DE KPIs OPERATIVOS (4 tarjetas .glass-soft con badges cuadrados)
   ↓
3. BARRA DE CONTROL (Segmentos de píldoras + Búsqueda contextual)
   ↓
4. BANDEJA DE ALERTAS (Feed estructurado en tarjetas .surface con bordes semánticos)
```

---

## 3. Header y Navegación Contextual

### 3.1. Breadcrumb
Permite orientación espacial dentro del AppShell:
```html
<nav class="breadcrumb">
  <a href="/app/inicio">Inicio</a>
  <span>›</span>
  <span>Alertas</span>
</nav>
```

### 3.2. Título de Página
- **Tipografía**: `--font-editorial` (*Newsreader* o *Instrument Serif*).
- **Tamaño**: `clamp(36px, 4vw, 48px)`, `font-weight: 400`, `tracking-tight`.
- **Contador dot-matrix opcional**: Si existen alertas críticas no leídas, se añade un badge en la misma línea con fuente pixelada o monoespaciada:
  ```html
  <span class="badge-critical-unread">4 sin leer</span>
  ```
- **Subtítulo descriptivo**: `text-xs sm:text-sm text-[#69666d]`.

### 3.3. Acción de Lote (Top-Right)
- Botón *"Marcar todas como leídas"* condicionado por el rol del usuario (`canPerformAction('manage_alerts')`).
- Estilo: Botón outline con fondo `bg-white/70`, borde `border-[rgba(30,24,38,0.08)]`, hover luminoso y micro-icono `CheckCheck`.

---

## 4. Fila de KPIs Operativos (4 Métricas en `.glass-soft`)

Se disponen en un grid de 4 columnas (2 en tablet, 1 en mobile) utilizando la clase `.glass-soft` con esquinas redondeadas de 18px:

| Métrica | Icono | Contenedor de Icono | Tipografía | Subtexto explicativo |
| :--- | :--- | :--- | :--- | :--- |
| **Total Alertas** | `Bell` o `Layers` | `bg-white/80 border-[rgba(30,24,38,0.06)]` | 24px Bold Tabular | Total monitorizadas |
| **Críticas / Adendas** | `ShieldAlert` | `bg-[#ffeded] border-[#fcd2d2] text-[#e44848]` | 24px Bold Tabular | Invalidan análisis |
| **Plazos Próximos** | `Clock` | `bg-[#fff3db] border-[#ffe2a8] text-[#ca8517]` | 24px Bold Tabular | < 5 días hábiles |
| **Resueltas / Leídas** | `CheckCircle2` | `bg-[#e8f7ef] border-[#c2ebd5] text-[#218a58]` | 24px Bold Tabular | Atendidas por el equipo |

---

## 5. Segmentación Rápida y Búsqueda Contextual

A diferencia de un formulario tradicional, la selección se divide en **Segmentos Rápidos (Fila 1)** y **Búsqueda en tiempo real**:

### 5.1. Píldoras de Segmento
- `Todas {total}`
- `No leídas {unread}` (con badge lila suave o rojo si hay críticas)
- `Críticas / Adendas {critical}` (badge `#ffeded` con texto `#e44848`)
- `Plazos y prórrogas {warnings}`
- `Informativas {info}`

### 5.2. Input de Búsqueda Glassmorphism
- Ubicado a la derecha de los segmentos (en desktop).
- Estilo: `bg-white/70 focus:bg-white border border-[rgba(30,24,38,0.06)] focus:border-[#685cff] rounded-[11px]`.
- Filtra instantáneamente por expediente (`EXP-2026/...`), órgano de contratación, título o palabras clave del mensaje.

---

## 6. Anatomía de la Tarjeta de Alerta (`.surface`)

Cada tarjeta de alerta debe estructurarse para permitir una lectura rápida en 3 segundos:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [SEVERIDAD] · [TIPO DE EVENTO]        [EXP-2026/00941]    Hace 2 horas │
│                                                                        │
│ Título de la Alerta (Semibold #171719)                                 │
│ Mensaje descriptivo con el impacto directo en el expediente...         │
│                                                                        │
│ ⚠️ Invalida análisis vigente: Requiere reanálisis documental           │
│                                                                        │
│ Licitación: Suministro de servidores...             [Abrir Oportunidad →]│
│                                                     [Marcar como leída]│
└────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Jerarquía de Severidades

1. **`CRITICAL` (Adendas en PLACSP / Rectificaciones de pliegos)**:
   - **Borde lateral**: Barra izquierda de 4px en `#e44848` (`--danger`).
   - **Badge**: Fondo `#ffeded`, texto `#e44848`, borde `#fcd2d2`.
   - **Icono**: `ShieldAlert` o `AlertTriangle`.
   - **Efecto operativo**: Muestra el aviso *"Invalida análisis previo — Requiere reanálisis inmediato"*.

2. **`WARNING` (Plazos próximos / Advertencias de solvencia)**:
   - **Borde lateral**: Barra izquierda de 4px en `#ca8517` (`--warning`).
   - **Badge**: Fondo `#fff3db`, texto `#ca8517`, borde `#ffe2a8`.
   - **Icono**: `Clock` o `AlertTriangle`.
   - **Efecto operativo**: Avisa de plazos perentorios o decisiones pendientes.

3. **`INFO` (Actualizaciones / Análisis completados)**:
   - **Borde lateral**: Barra izquierda de 4px en `#685cff` (`--primary`).
   - **Badge**: Fondo `#eeeaff`, texto `#685cff`, borde `#d5ccfe`.
   - **Icono**: `FileText` o `BellRing`.

### 6.2. Enlace al Expediente y Acciones
- **Expediente público**: Mostrado en formato píldora monoespaciada `font-mono text-xs text-[#69666d] bg-white/80 border border-[rgba(30,24,38,0.06)]`.
- **Botón Principal**: `Button variant="primary" size="sm"` con flecha `ArrowRight` ("Abrir Oportunidad"). Al hacer clic, navega a `/app/portfolio/:tenderId` y marca la alerta como leída automáticamente.
- **Botón Secundario**: *"Marcar como leída"* (oculto si ya ha sido leída).

---

## 7. Estado Leído / No Leído

- **Alerta No Leída**:
  - Opacidad: `100%`.
  - Sombra: `shadow-[0_12px_32px_-6px_rgba(35,25,45,0.04)]`.
  - Punto indicador lumínico (`w-2 h-2 rounded-full bg-[#685cff]`) en la esquina superior izquierda.
- **Alerta Leída**:
  - Opacidad reducida: `opacity-75 hover:opacity-100 transition-opacity`.
  - Texto secundario y fecha en `#929097`.
  - Botón de marcar leída sustituido por check discreto *"Leída"*.

---

## 8. Empty State de Alertas ("Bandeja al Día")

Cuando el usuario no tiene alertas pendientes en el filtro activo:
- Contenedor con clase `.surface` o `.glass-soft`.
- Icono `CheckCircle2` o `Sparkles` en círculo suave `#e8f7ef` con texto `#218a58`.
- Título editorial: *"Bandeja de alertas al día"*.
- Subtítulo: *"No tienes alertas pendientes de revisión en este filtro. Pliego AI monitoriza continuamente la Plataforma de Contratación del Sector Público."*

---

## 9. Checklist de Aceptación Visual

- [x] Título principal con tipografía editorial (*Newsreader*) y breadcrumbs funcionales.
- [x] 4 tarjetas de KPIs con clase `.glass-soft`, iconos cuadrados y valores numéricos tabulares.
- [x] Segmentación rápida con píldoras de conteo y badge dinámico para alertas no leídas.
- [x] Tarjetas de alertas con clase `.surface`, biseles especulares y bordes semánticos según severidad.
- [x] Indicador visible de `"Requiere reanálisis"` cuando una adenda invalida el análisis vigente.
- [x] Enlace directo de apertura hacia la oportunidad en Portfolio con navegación SPA y marcaje automático.
- [x] Empty state limpio y elegante.
- [x] Plena compatibilidad con la imagen de fondo 3D de cristal y adaptabilidad responsive (desktop, tablet, mobile).
