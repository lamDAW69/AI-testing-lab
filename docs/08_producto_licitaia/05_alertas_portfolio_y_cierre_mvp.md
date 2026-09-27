# LicitaIA — Fase 5: Alertas, Portfolio y Cierre del MVP

> **Documento de Arquitectura y Operación de Producto**  
> **Fecha**: Septiembre 2026  
> **Estado**: Implementado y Verificado en Producción  
> **Cumplimiento**: [AGENTS.md](../../AGENTS.md) — Seguridad Multi-Tenant, Zero-IDOR, RLS Forzado y Validación Zod Estricta.

---

## 1. Resumen Ejecutivo de la Fase 5

La Fase 5 cierra el ciclo funcional del Producto Mínimo Viable (MVP) de **LicitaIA**, resolviendo el ciclo de vida documental y la explotación de negocio por parte de las empresas licitadoras:

1. **Invalidez por cambio documental**: Detección de nuevas versiones de pliegos, adendas o modificaciones de estado/plazo sin pérdida de histórico. Los análisis existentes pasan a `REQUIRES_REANALYSIS` o `STALE`.
2. **Cola persistente de alertas (Outbox)**: Sistema de notificaciones desacoplado y duradero con deduplicación por hash criptográfico SHA-256 e idempotencia a nivel de base de datos (`ON CONFLICT DO NOTHING`).
3. **Portfolio de oportunidades**: Vista agregada y determinista de todas las oportunidades analizadas y seguidas por cada tenant. **Cero consumo de tokens LLM al filtrar o consultar**.
4. **Métricas y observabilidad**: Agregados estratégicos (distribución de decisiones, elegibilidad, top bloqueos, latencias y consumo de tokens/costes en USD) sin exponer información confidencial ni datos personales (PII).
5. **Aislamiento multi-inquilino de nivel militar**: Todas las nuevas tablas y vistas operan bajo `ROW LEVEL SECURITY (RLS)` forzado con políticas estrictas basadas en `app.current_tenant_id`.

---

## 2. Invalidez Documental y Conservación de Histórico (5.1)

### 2.1 Principio de No Sobrescritura
En contratación pública, un análisis previo nunca debe ser borrado cuando el órgano convocante publica una adenda o pliego rectificado. El análisis histórico constituye una evidencia jurídica y técnica del estado del pliego en la fecha en que la empresa evaluó su participación.

Por ello, la tabla `opportunity_analyses` se ha ampliado con:
- `is_current BOOLEAN DEFAULT true NOT NULL`
- `invalidation_status VARCHAR(32) DEFAULT 'VALID' NOT NULL` (`VALID`, `STALE`, `REQUIRES_REANALYSIS`)
- `invalidation_reason TEXT`
- `superseded_by_document_version_id UUID REFERENCES tender_document_versions(id)`
- `invalidated_at TIMESTAMP WITH TIME ZONE`

### 2.2 Funciones Atómicas `SECURITY DEFINER`
Para invalidar análisis de todos los inquilinos afectados sin romper el aislamiento RLS durante la ingesta pública de PLACSP, se han creado dos funciones en PostgreSQL:
1. `public.invalidate_analyses_for_document_version(p_tender_id uuid, p_new_document_version_id uuid, p_reason text)`
2. `public.invalidate_analyses_for_tender_change(p_tender_id uuid, p_reason text, p_new_status varchar, p_new_deadline timestamptz)`

Estas funciones actualizan atómicamente los análisis vigentes y generan de forma inmediata un evento de alerta en `opportunity_alerts` para cada tenant que analizaba el expediente.

---

## 3. Cola Persistente de Alertas / Outbox (5.2)

### 3.1 Modelo de Datos (`opportunity_alerts`)
```sql
CREATE TABLE opportunity_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES opportunity_analyses(id) ON DELETE SET NULL,
  alert_type VARCHAR(50) NOT NULL, -- NEW_OPPORTUNITY, DOCUMENT_CHANGED, DEADLINE_APPROACHING, ANALYSIS_COMPLETED, ANALYSIS_FAILED, DOSSIER_EXPIRED
  severity VARCHAR(20) DEFAULT 'INFO' NOT NULL, -- INFO, WARNING, CRITICAL
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  status VARCHAR(20) DEFAULT 'UNREAD' NOT NULL, -- UNREAD, READ, DISMISSED
  idempotency_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uq_opportunity_alerts_tenant_idempotency ON opportunity_alerts (tenant_id, idempotency_hash);
```

### 3.2 Deduplicación Criptográfica
El hash de idempotencia se calcula como:
$$\text{idempotency\_hash} = \text{SHA-256}(\text{tenant\_id} \mathbin{\Vert} \text{alert\_type} \mathbin{\Vert} \text{deduplication\_key})$$

Si el worker o el feed de PLACSP reintenta el procesamiento de la misma versión o enmienda, la inserción se resuelve mediante `ON CONFLICT (tenant_id, idempotency_hash) DO NOTHING`, garantizando que el usuario nunca reciba alertas duplicadas.

### 3.3 Endpoints de Alertas (`/api/alerts`)
- `GET /api/alerts`: Listado filtrado por estado (`UNREAD`, `READ`, `DISMISSED`, `ALL`), severidad o tipo, con paginación protegida.
- `GET /api/alerts/stats`: Conteo rápido de alertas no leídas y distribución por tipo y severidad.
- `PATCH /api/alerts/:id/read`: Marca una alerta como leída registrando la marca temporal `read_at`.
- `POST /api/alerts/mark-all-read`: Marca en bloque todas las alertas pendientes del tenant.
- `PATCH /api/alerts/:id/dismiss`: Archiva/descarta la alerta.

---

## 4. Portfolio de Oportunidades (5.3)

### 4.1 Arquitectura Determinista sin Coste LLM
A diferencia de la fase de extracción o precalificación, la consulta del portfolio no realiza llamadas a modelos de lenguaje. Se ejecuta mediante consultas relacionales ultra-optimizadas con índices compuestos en `(tenant_id, eligibility_status)` y `(tenant_id, is_current)`.

### 4.2 Endpoints del Portfolio (`/api/portfolio`)
- `GET /api/portfolio`: Consulta agregada que devuelve para cada expediente:
  - Información oficial del expediente (código, título, presupuesto, CPV, órgano de contratación, fecha límite).
  - Estado del último análisis de oportunidad (`eligibilityStatus`, `invalidationStatus`, `isCurrent`, `blockingReasons`, `dimensions`).
  - Decisión humana (`PURSUE`, `REVIEW`, `DISCARD`, `UNDECIDED`), con motivo, autor y fecha.
  - Conteo de alertas no leídas asociadas al expediente.
- `GET /api/portfolio/:tenderId`: Detalle unificado de la oportunidad.

### 4.3 Filtros Soportados
- `decision`: `UNDECIDED`, `PURSUE`, `REVIEW`, `DISCARD`.
- `eligibilityStatus`: `ELIGIBLE`, `POTENTIALLY_INELIGIBLE`, `NEEDS_EXPERT_REVIEW`, `PENDING`.
- `invalidationStatus`: `VALID`, `STALE`, `REQUIRES_REANALYSIS`.
- `cpv`: Prefijo o código CPV exacto de 2 a 8 dígitos.
- `minAmountCents` y `maxAmountCents`: Rango presupuestario en céntimos enteros exactos.
- `deadlineBefore` y `deadlineAfter`: Rango de fecha límite de presentación.
- `hasBlockingReasons`: Booleano para aislar oportunidades con causas bloqueantes.
- `search`: Búsqueda textual por referencia o palabras clave en el título.

---

## 5. Métricas y Observabilidad (5.4)

El endpoint `GET /api/portfolio/metrics` consolida el reporting operacional del tenant:
- **Resumen de cartera**: Total de licitaciones seguidas, análisis vigentes vs. invalidados por adenda.
- **Distribución de decisiones**: Porcentaje y volumen en `PURSUE`, `REVIEW`, `DISCARD` y `UNDECIDED`.
- **Distribución de elegibilidad**: Volúmenes de idoneidad técnica/económica.
- **Top causas de bloqueo**: Las 5 causas bloqueantes más recurrentes en los pliegos analizados (ej: falta de clasificación, garantía provisional excesiva, solvencia técnica insuficiente).
- **Costes y consumo de IA**: Número de evaluaciones realizadas, coste acumulado en microunidades y USD (calculado a partir de los eventos de ejecución de Gemini 3.5 Flash Lite) y latencia media por evaluación.
- **Salud de alertas**: Alertas no leídas agrupadas por severidad (`CRITICAL`, `WARNING`, `INFO`).

---

## 6. Demostración E2E y Pruebas Anti-Fuga (5.5)

El script `npm run demo:phase5` (`api/src/modules/qualification/scripts/demo-phase5-e2e.ts`) valida de extremo a extremo:
1. Inspección del expediente sellado de Valdetorres (`157/2026`).
2. Existencia de análisis de precalificación y decisión humana (`PURSUE`).
3. Registro de una adenda oficial simulada (versión 2 inmutable del pliego).
4. Disparo de la función de invalidación atómica.
5. Verificación de que el análisis anterior pasa a `REQUIRES_REANALYSIS` (`is_current = false`) manteniendo su ID e histórico intactos.
6. Generación de alerta única `DOCUMENT_CHANGED` en la outbox.
7. Comprobación de deduplicación idempotente ante reintentos.
8. Verificación anti-fuga (Cross-Tenant): `Tenant B` recibe 0 oportunidades y 0 alertas, certificando que las políticas RLS impiden cualquier filtración horizontal de información.
