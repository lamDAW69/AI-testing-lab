# Fase 4 — Precalificación de Oportunidades y Motor de Reglas Explicable

> **Módulo:** Fase 4 — Precalificación de Oportunidades por Empresa  
> **Ámbito:** Evaluación Requisito-Evidencia, Puertas Deterministas y Dimensiones Explicables  
> **Entorno:** Producción (`https://api.pliegoai.com`) / Repositorio: `lamDAW69/AI-testing-lab`

---

## 1. Resumen Ejecutivo

La **Fase 4 (Precalificación de Oportunidades)** transforma los requisitos extraídos y sellados de un pliego oficial en una **evaluación explicable, justificada y accionable para cada empresa**, garantizando el aislamiento criptográfico multi-tenant (RLS) y erradicando los "scores mágicos" opacos.

El sistema se rige por tres principios inquebrantables de [`AGENTS.md`](../../AGENTS.md):
1. **Dominancia de Puertas Deterministas**: Un requisito obligatorio incumplido o un plazo vencido domina siempre la evaluación; ningún modelo de IA ni puntuación agregada puede anular una causa objetiva de inadmisión.
2. **Aislamiento Multi-Tenant Estricto (Anti-BOLA)**: Cada análisis, evaluación, evidencia del dossier y decisión humana reside bajo RLS forzado (`FORCE ROW LEVEL SECURITY`) con claves primarias UUIDv7/v4 e índices compuestos `(tenant_id, ...)`.
3. **Explicabilidad en 7 Dimensiones**: La oportunidad se desglosa en dimensiones claras (Elegibilidad, Encaje Técnico, Encaje Económico, Capacidad Operativa, Riesgo Contractual, Plazo y Cobertura de Evidencia) respaldadas por citas del pliego y evidencias del dossier.

---

## 2. Modelo de Datos y Migración 0010

La migración versionada `api/drizzle/0010_add_opportunity_qualification.sql` implementa cinco tablas relacionales:

```
tenants
  ├── company_profiles
  ├── company_certifications
  ├── company_dossier_items (Solvencia, experiencia, referencias)
  └── opportunity_analyses (Análisis para tenant + tender + versión documental)
        ├── requirement_assessments (Evaluación de cada requisito)
        │     └── assessment_evidence (Evidencias vinculadas del dossier)
        └── analysis_decisions (Decisión humana: PURSUE, REVIEW, DISCARD, UNDECIDED)
```

### 2.1. Tablas y Contratos:
- **`company_dossier_items`**: Evidencias ampliadas de la empresa (`category`: TECHNICAL, ECONOMIC, LEGAL, ADMINISTRATIVE, EXPERIENCE; `evidence_status`: DECLARED, VERIFIED, EXPIRED).
- **`opportunity_analyses`**: Ejecución de análisis (`status`: PENDING, PROCESSING, COMPLETED, FAILED; `eligibility_status`: PENDING, ELIGIBLE, POTENTIALLY_INELIGIBLE, NEEDS_EXPERT_REVIEW).
- **`requirement_assessments`**: Evaluación individual de cada requisito (`status`: SUPPORTED, NOT_SUPPORTED, UNKNOWN, CONFLICTING, NOT_APPLICABLE, NEEDS_EXPERT_REVIEW; `confidence`: 0..100; `is_blocking`: boolean).
- **`assessment_evidence`**: Evidencia concreta que sustenta o contradice el requisito (`match_type`: SUPPORTS, CONTRADICTS, PARTIAL, INCONCLUSIVE; `excerpt`: texto literal; `confidence`: 0..100).
- **`analysis_decisions`**: Decisión humana separada del análisis (`decision`: UNDECIDED, PURSUE, REVIEW, DISCARD; `rationale`: justificación; `decided_by`: ID de usuario).

---

## 3. Puertas Deterministas de Elegibilidad

Antes y durante la evaluación, la función `evaluateDeterministicGates` (`api/src/modules/qualification/deterministic-gates.ts`) aplica reglas objetivas reproducibles:
1. **Plazo Vencido**: Si `tender.submissionDeadline < now()`, genera causa bloqueante `POTENTIALLY_INELIGIBLE`.
2. **Expediente Inactivo**: Estados CANCELLED, SUSPENDED o ANNULLED bloquean la oportunidad.
3. **Presupuesto Excedido**: Si `tender.estimatedValueCents > profile.maxContractCents`, genera bloqueo por sobrecapacidad económica.
4. **Requisito Obligatorio NO Soportado**: Cualquier requisito con `requirementType === 'MANDATORY'` evaluado en `NOT_SUPPORTED` genera bloqueo inmediato.
5. **Requisito Crítico sin Evidencia**: Requisitos obligatorios en `UNKNOWN` o `NEEDS_EXPERT_REVIEW` derivan la elegibilidad global a `NEEDS_EXPERT_REVIEW`.

---

## 4. Agente de Correspondencia Requisito–Evidencia

El agente `QualificationMatcherAgent` (`api/src/modules/qualification/qualification-matcher.agent.ts`):
- **Entrada acotada**: Recibe exclusivamente el requisito con su cita física sellada y la lista de candidatos de evidencia del tenant activo.
- **Sin acceso a base de datos ni a otros tenants**: No conoce conexiones SQL ni tokens de otros usuarios.
- **Resolución Determinista**: Si el dossier está vacío, responde inmediatamente `status: 'UNKNOWN'` con coste 0 y 0 llamadas al LLM.
- **Regla Anti-Alucinación**: Descarta cualquier `dossierItemId` que no exista en la lista entregada del tenant.
- **Auditoría de Inferencia**: Registra versión de prompt (`qualification-matcher-v1`), modelo (`gemini-3.5-flash-lite`), latencia, tokens y coste en microdólares.

---

## 5. Motor de Evaluación Explicable (7 Dimensiones)

El servicio `QualificationService` (`api/src/modules/qualification/qualification.service.ts`) calcula:
1. **`potentialEligibility`**: Estado derivado de las puertas deterministas, lista de `blockingReasons` y `warnings`.
2. **`technicalFit`**: Puntuación (HIGH, MEDIUM, LOW, INSUFFICIENT_EVIDENCE), conteo de requisitos técnicos soportados y ratio porcentual.
3. **`economicFit`**: Puntuación y comparativa del presupuesto licitado frente al rango mínimo y máximo configurado en el perfil.
4. **`operationalCapacity`**: Compatibilidad territorial y capacidad operativa declarada.
5. **`contractualRisk`**: Nivel de riesgo (LOW, MEDIUM, HIGH) derivado de exigencias de garantías provisionales o penalidades contractuales.
6. **`deadlineFit`**: Viabilidad del plazo (FEASIBLE, TIGHT, EXPIRED, UNKNOWN) y días restantes.
7. **`evidenceCoverage`**: Cobertura del dossier (FULL, PARTIAL, MINIMAL, NONE) distinguiendo evidencias verificadas vs declaradas.

---

## 6. Endpoints de la API (`/api/qualification`)

| Método | Endpoint | Rol Mínimo | Descripción |
|---|---|---|---|
| `POST` | `/api/qualification/analyses` | Analyst / Admin | Crea un nuevo análisis de oportunidad (idempotente). |
| `POST` | `/api/qualification/analyses/:id/run` | Analyst / Admin | Ejecuta la evaluación completa de precalificación. |
| `GET` | `/api/qualification/analyses/:id` | Member | Consulta el análisis, dimensiones, evaluaciones y decisión. |
| `POST` | `/api/qualification/analyses/:id/decision` | Analyst / Admin | Registra la decisión humana (PURSUE, REVIEW, DISCARD). |
| `POST` | `/api/qualification/dossier` | Analyst / Admin | Añade un ítem de evidencia al dossier de la empresa. |
| `GET` | `/api/qualification/dossier` | Member | Lista los ítems de evidencia del dossier del tenant. |

---

## 7. Verificación Real en Producción (Hetzner VPS)

Ejecutado sobre el pliego sellado del Ayuntamiento de Valdetorres (`157/2026`, versión documental `0927331b-ed1c-4a34-aeb1-7fc183df6b0e`):

- **Análisis Creado**: `0aafb471-e8b6-48d6-a27a-3300bff0edd2`
- **Latencia de Evaluación**: **1.292 ms** (1,29 segundos).
- **Estado de Elegibilidad**: `POTENTIALLY_INELIGIBLE`
- **Causa Bloqueante**: `Incumplimiento de requisito obligatorio: "Constitución de garantía provisional"`
- **Evaluación de Requisito**:
  - Requisito: `"Constitución de garantía provisional"` (Obligatorio, Económico).
  - Estado: `NOT_SUPPORTED` (Confianza: 85%).
  - Dictamen del Agente: *"El dossier contiene una línea de avales general para garantías provisionales, pero no aporta el resguardo o comprobante de la constitución efectiva de la garantía específica del 5% del valor de tasación requerida para este procedimiento de adjudicación de inmuebles."*
  - Evidencia vinculada: `[INCONCLUSIVE]` *Línea de Avales y Solvencia para Garantías Provisionales*.
- **Decisión Humana Registrada**: `PURSUE` (*"Oportunidad altamente viable: disponemos de la solvencia requerida para la fianza provisional y el importe está dentro del rango óptimo."*).
- **Aislamiento Multi-Tenant**: Test de integración validado; `Tenant B` no puede leer ni inferir análisis, evaluaciones, evidencias ni decisiones del `Tenant A` (recibe `null` y `404`).
- **CI en GitHub Actions**: 25 pruebas unitarias y pruebas de aislamiento RLS en PostgreSQL completadas al 100% en verde (Run `36327689467`).
