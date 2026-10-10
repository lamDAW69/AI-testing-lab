# Fuente Oficial de Datos Públicos — Plataforma de Contratación del Sector Público (PLACSP)

> **Módulo:** Fase 2 — Ingesta de Datos Públicos  
> **Ámbito:** España (Estatal, Autonómico y Local)  
> **Estándar técnico:** CODICE (Componentes y Documentos Interoperables para la Contratación Electrónica) / eForms  
> **Identificador interno de fuente:** `ES_PLACSP`

---

## 1. Justificación de la Fuente Oficial

La **Plataforma de Contratación del Sector Público (PLACSP)**, gestionada por la Dirección General del Patrimonio del Estado (Ministerio de Hacienda), constituye el nodo central y oficial de publicación de licitaciones públicas en España conforme a la Ley 9/2017 de Contratos del Sector Público (LCSP).

### Ventajas Técnicas para PliegoAI:
1. **Publicación Centralizada**: Aglutina los anuncios de licitación y adjudicación de la Administración General del Estado, entidades locales, universidades públicas y comunidades autónomas que publican directamente o sincronizan sus perfiles de contratante.
2. **Estándares Abiertos e Interoperables**: La información se estructura bajo el modelo de datos **CODICE**, basado en sintaxis XML conforme a las especificaciones europeas eForms y OASIS UBL (*Universal Business Language*).
3. **Enlaces a Pliegos Originales**: Proporciona URLs canónicas a los documentos rectores de la licitación:
   - **PCAP**: Pliego de Cláusulas Administrativas Particulares (criterios de solvencia, requisitos jurídicos y límites económicos).
   - **PPT**: Pliego de Prescripciones Técnicas (especificaciones funcionales, tecnológicas y de equipo).

---

## 2. Puntos de Entrada y Formato de Difusión

La PLACSP ofrece servicios de difusión a través de canales de datos abiertos y sindicación:

| Canal | URL / Endpoint Oficial | Formato | Frecuencia |
|---|---|---|---|
| Feed de Licitaciones Publicadas | `https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom` | Feed ATOM con nodos CODICE XML | Diaria / Continua |
| Perfiles de Contratante | `https://contrataciondelestado.es/wps/portal/plataforma` | Perfil HTML / XML | Bajo demanda |

---

## 3. Modelo de Entidades y Mapeo Canónico

Para erradicar ambigüedades y garantizar cálculos reproducibles, los datos de la PLACSP se normalizan a las siguientes entidades globales:

```
┌─────────────────────────┐
│   procurement_sources   │ (ES_PLACSP)
└────────────┬────────────┘
             │ 1
             │ N
┌────────────┴────────────┐
│ contracting_authorities │ (Órganos convocantes: CIF, nombre, tipo)
└────────────┬────────────┘
             │ 1
             │ N
┌────────────┴────────────┐
│         tenders         │ (Expediente: importe en céntimos, CPV, plazos, estado)
└────────────┬────────────┘
             ├──────────────────────────┬──────────────────────────┐
             │ 1:N                      │ 1:N                      │ 1:N
┌────────────┴────────────┐┌────────────┴────────────┐┌────────────┴────────────┐
│       tender_lots       ││     tender_documents    ││       tender_events     │
│  (Lotes independientes) ││  (Metadatos de pliegos) ││  (Publicación, enmiendas)│
└─────────────────────────┘└────────────┬────────────┘└─────────────────────────┘
                                        │ 1:N
                           ┌────────────┴────────────┐
                           │ tender_document_versions│
                           │(URL, SHA-256 inmutable) │
                           └─────────────────────────┘
```

### 3.1 Normalización de Datos Críticos:
1. **Importes**: Se convierten siempre a enteros en céntimos de euro (`bigint` en base de datos) para evitar errores de redondeo de punto flotante.
   - `budgetAmountCents`: Presupuesto base de licitación sin impuestos.
   - `taxInclusiveAmountCents`: Importe total con IVA/impuestos.
2. **Estados Canónicos**:
   - `PUBLISHED`: Convocatoria abierta a presentación de ofertas.
   - `EVALUATION`: Plazo cerrado, ofertas en proceso de valoración técnica o económica.
   - `AWARDED`: Adjudicado provisional o definitivamente.
   - `RESOLVED`: Contrato formalizado o finalizado.
   - `CANCELLED`: Desierto, desistido o revocado.
3. **Códigos CPV**: Normalizados al código de 8 dígitos según el estándar del *Common Procurement Vocabulary* de la Unión Europea.
4. **Fechas**: Siempre procesadas en ISO-8601 con zona horaria UTC (`timestamp with time zone`).

---

## 4. Principio de Inmutabilidad e Idempotencia (Anti-Sobrescritura)

1. **Idempotencia de Ingesta**: Si el conector procesa dos veces consecutivas el mismo lote de expedientes idénticos, calcula el hash SHA-256 del contenido crudo (`rawPayloadHash`). Si coincide, la operación se omite (*no-op*), preservando la estabilidad del sistema.
2. **Inmutabilidad Documental**: Si un órgano convocante sube una enmienda o aclaración al pliego técnico (PPT), **nunca se sobrescribe el documento existente**. Se genera una nueva versión (`version_number = N + 1`) con su nuevo hash. Esto garantiza que cualquier requisito extraído por agentes en la Fase 3 mantenga su referencia documental válida e inalterable.
