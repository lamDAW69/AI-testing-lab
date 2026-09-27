# LicitaIA — Definición de producto

> **Estado:** especificación funcional inicial  
> **Versión:** 1.0  
> **Tipo:** SaaS B2B multi-tenant de apoyo a la decisión  
> **Mercado inicial:** pymes españolas de servicios tecnológicos  
> **Principio rector:** la decisión final siempre pertenece a una persona autorizada.

---

## 1. Qué es LicitaIA

**LicitaIA monitoriza licitaciones públicas y contrasta sus requisitos con las capacidades y evidencias documentales de cada empresa.** El resultado es una precalificación explicable que permite decidir si una oportunidad debe perseguirse, revisarse o descartarse.

No es un buscador de PDFs, un chatbot aislado ni un generador automático de ofertas. El producto mantiene de forma persistente:

1. Expedientes públicos, documentos y modificaciones.
2. Requisitos extraídos con referencias a su fuente.
3. El dossier verificable y privado de cada empresa.
4. Hallazgos, responsables, plazos y decisiones humanas.

La promesa de producto es:

> **Antes de invertir horas en una licitación, LicitaIA muestra qué requisitos parece cumplir la empresa, cuáles no, qué información falta y en qué documento se apoya cada conclusión.**

LicitaIA nunca garantizará que una empresa pueda presentarse o vaya a ganar; tampoco sustituirá la revisión jurídica, administrativa o técnica especializada.

---

## 2. Problema que ataca

La información sobre contratación pública es pública, pero convertirla en decisiones empresariales sigue siendo caro y lento. Una pyme debe localizar oportunidades, descargar anuncios, pliegos y anexos, interpretar requisitos dispersos y contrastarlos con datos internos normalmente repartidos entre personas, correos y carpetas.

Las preguntas que LicitaIA debe ayudar a responder son:

- ¿Esta oportunidad es compatible con nuestro negocio?
- ¿Qué condiciones obligatorias cumplen nuestras evidencias?
- ¿Qué requisito parece bloqueante?
- ¿Qué información falta para decidir con seguridad?
- ¿Qué plazo queda y qué cambió desde la última revisión?
- ¿Merece la pena asignar tiempo del equipo a esta oferta?

El coste actual se distribuye entre búsqueda manual, lectura documental, coordinación interna, errores tardíos y tiempo invertido en oportunidades que nunca fueron viables.

El volumen no es hipotético: OIReScon registró para 2024 más de 200.000 expedientes y más de 113.000 millones de euros de presupuesto base de licitación. Las instituciones europeas también señalan complejidad administrativa, baja capacidad interna y diversidad de plataformas como barreras particulares para las pymes.

Fuentes de contexto:

- [OIReScon — Cifras de la contratación pública en 2024](https://www.hacienda.gob.es/rsc/oirescon/informe-anual-supervision-2025/ias2025-modulo1.pdf)
- [Comisión Europea — Necesidades de las pymes en contratación pública](https://single-market-economy.ec.europa.eu/publications/analysis-smes-needs-public-procurement_en)
- [Tribunal de Cuentas Europeo — Contratación pública en la UE](https://www.eca.europa.eu/ECAPublications/SR-2023-28/SR-2023-28_EN.pdf)

---

## 3. Base teórica y principios

### Reducción de costes de búsqueda y evaluación

El éxito no se mide por resúmenes producidos por IA, sino por el tiempo que una empresa deja de dedicar a buscar y descartar oportunidades inadecuadas.

### Asimetría de capacidad, no de acceso

Las condiciones son públicas, pero una gran empresa suele tener más personal especializado que una pyme para interpretarlas. LicitaIA reduce esa desventaja organizando información; no modifica ni rebaja requisitos legales.

### Racionalidad limitada

Una empresa no puede estudiar todas las publicaciones. El sistema debe priorizar y hacer visible la incertidumbre, no aparentar certeza absoluta.

### Decisiones basadas en evidencia

```text
Requisito del expediente
        +
Evidencia del dossier empresarial
        +
Regla aplicada
        =
Conclusión provisional, explicable y revisable
```

### Principios no negociables

1. Evidencia antes que elocuencia.
2. Ausencia de evidencia no equivale a incumplimiento.
3. Elegibilidad y atractivo comercial son dimensiones separadas.
4. Fechas, permisos, importes, estados y reglas simples se resuelven con código determinista.
5. La IA no decide permisos ni el `tenant_id`.
6. La persona autorizada decide `perseguir`, `revisar` o `descartar`.
7. La información privada de un tenant nunca alimenta resultados de otro.
8. Cada conclusión debe poder reconstruirse por versión de documento, fuente y ejecución.
9. Ante baja confianza, la respuesta correcta es “requiere revisión”, no una invención.

---

## 4. Segmento inicial y usuarios

### Cliente ideal inicial

Consultoras tecnológicas, agencias digitales y pymes españolas de servicios informáticos, de 10 a 100 personas, que pueden trabajar para administraciones pero carecen de un departamento completo de licitaciones. Es una hipótesis de mercado que se validará antes de escalar.

### Personas usuarias

| Persona | Necesidad principal |
|---|---|
| Responsable comercial o gerente | Detectar oportunidades y decidir dónde invertir recursos. |
| Responsable administrativo | Mantener certificados, solvencia y evidencias actualizados. |
| Responsable técnico | Evaluar alcance, equipo y requisitos técnicos. |
| Revisor o asesor externo | Validar casos críticos y dejar observaciones. |
| Administrador del tenant | Gestionar miembros, roles y políticas. |

### Jobs to be done

- “Avísame de oportunidades compatibles.”
- “Dime qué requisito podría excluirnos y cítalo.”
- “Indica qué documento nuestro demuestra que cumplimos.”
- “No ocultes lo que todavía desconoces.”
- “Ayúdame a descartar temprano sin perder una buena oportunidad.”
- “Controla cambios y fechas sin depender de una hoja de cálculo.”

---

## 5. Alcance de producto

### Incluido en el MVP

- Autenticación, organizaciones, membresías y roles.
- Perfil privado y dossier verificable de cada empresa.
- Ingesta incremental de una fuente oficial española.
- Catálogo de expedientes, lotes, documentos y versiones.
- Filtros deterministas por CPV, territorio, importe, fecha, estado y procedimiento.
- Extracción de requisitos con citas de fuente.
- Comparación requisito-evidencia por tenant.
- Precalificación explicable con revisión humana.
- Decisión `PURSUE`, `REVIEW` o `DISCARD` con auditoría.
- Alertas de plazos y modificaciones relevantes.
- Suite automatizada de aislamiento cross-tenant.

### Excluido del MVP

- Presentación automática de ofertas o firma electrónica.
- Garantía de elegibilidad o adjudicación.
- Asesoramiento jurídico automático.
- Fijación automática de precios.
- Generación integral de memorias técnicas.
- Cobertura de todos los portales españoles y europeos.
- Entrenamiento cruzado con datos privados de tenants.
- Acciones autónomas irreversibles.

---

## 6. Flujo funcional

```text
Fuente oficial → ingesta y versionado → filtros deterministas
       ↓
análisis documental → requisitos citados → comparación con dossier del tenant
       ↓
precalificación explicable → revisión humana → decisión y seguimiento
```

### 6.1 Onboarding del tenant

1. El usuario inicia sesión mediante Supabase Auth.
2. Crea una organización o acepta una invitación.
3. El backend valida el JWT y resuelve membresía y `tenant_id`.
4. El usuario recibe un rol: `owner`, `admin`, `analyst`, `reviewer` o `viewer`.
5. El contexto de tenant queda inmutable durante la petición.

### 6.2 Dossier empresarial

Cada empresa registra y mantiene:

- Servicios, actividades y CPV de interés.
- Ámbitos geográficos y rangos económicos.
- Proyectos previos y experiencia acreditada.
- Certificaciones, vigencias y documentos.
- Equipo, tecnologías y capacidad operativa.
- Preferencias comerciales y restricciones internas.

Cada dato tendrá estado explícito: `VERIFIED`, `DECLARED`, `EXPIRED`, `PENDING_REVIEW` o `REJECTED`.

### 6.3 Ingesta pública

El conector:

1. Consulta la fuente oficial según una programación definida.
2. Normaliza identificadores, estados, plazos, lotes y órganos.
3. Detecta duplicados y modificaciones de forma idempotente.
4. Conserva URL, fecha de obtención, hash y versión de cada documento.
5. No sobrescribe silenciosamente contenido ya analizado.

Los datos del expediente son globales y públicos. Las evaluaciones, notas, preferencias y documentos empresariales son privados por tenant.

### 6.4 Análisis y decisión

1. Los filtros estructurados descartan oportunidades claramente incompatibles.
2. Se clasifican los documentos y se extraen requisitos con su cita exacta.
3. Se buscan evidencias únicamente dentro del tenant que analiza la oportunidad.
4. Se generan hallazgos provisionales y riesgos visibles.
5. Un usuario revisa información crítica o incierta.
6. Un rol autorizado toma la decisión y la justifica.
7. Si el expediente cambia, se invalida y recalcula solo lo afectado.

---

## 7. Marco de precalificación

### 7.1 Separación esencial

LicitaIA no utilizará un único “score mágico”. Mostrará por separado:

| Dimensión | Pregunta que responde |
|---|---|
| Elegibilidad potencial | ¿Hay un requisito obligatorio aparentemente bloqueante? |
| Encaje técnico | ¿El alcance coincide con experiencia, servicios y equipo? |
| Encaje económico | ¿Importe y condiciones están dentro de límites definidos? |
| Capacidad operativa | ¿La empresa puede atender plazos y territorio? |
| Riesgo contractual | ¿Hay garantías, penalizaciones o condiciones relevantes? |
| Plazo | ¿Queda tiempo suficiente para una revisión seria? |
| Cobertura | ¿Cuántos requisitos relevantes tienen evidencia suficiente? |

### 7.2 Estados de un requisito

- `SUPPORTED`: existe evidencia suficiente de cumplimiento aparente.
- `NOT_SUPPORTED`: la evidencia disponible parece insuficiente o incompatible.
- `UNKNOWN`: falta información para concluir.
- `CONFLICTING`: hay evidencias contradictorias.
- `NOT_APPLICABLE`: no aplica, con motivo registrado.
- `NEEDS_EXPERT_REVIEW`: requiere interpretación especializada.

`SUPPORTED` no significa validación jurídica definitiva.

### 7.3 Puertas obligatorias

Una recomendación automática nunca podrá ser positiva si existe:

- Plazo de presentación vencido.
- Expediente cancelado o suspendido.
- Requisito obligatorio con estado `NOT_SUPPORTED`.
- Prohibición o incompatibilidad confirmada.
- Importe o capacidad fuera de límites explícitos de la empresa.
- Requisito crítico pendiente de revisión obligatoria.

En estos casos se mostrará `POTENTIALLY_INELIGIBLE` o `NEEDS_EXPERT_REVIEW`.

### 7.4 Estados globales y decisiones humanas

Estados de análisis:

- `NOT_ANALYZED`
- `PROCESSING`
- `NEEDS_INFORMATION`
- `NEEDS_EXPERT_REVIEW`
- `POTENTIALLY_ELIGIBLE`
- `POTENTIALLY_INELIGIBLE`
- `ANALYSIS_FAILED`

Decisiones humanas independientes:

- `UNDECIDED`
- `PURSUE`
- `REVIEW`
- `DISCARD`

Toda decisión almacenará responsable, momento, motivo estructurado, comentario y versión del análisis utilizada.

---

## 8. Diseño de agentes

### Cuándo usar IA

La IA interpreta texto no estructurado, relaciona posibles evidencias y revisa razonamientos. El software convencional controla autorización, aislamiento, persistencia, fechas, importes, estados y cálculos verificables.

### Agentes previstos

| Agente | Responsabilidad | Límite |
|---|---|---|
| Clasificador documental | Identificar tipo y estructura del documento. | No decide permisos ni propiedad. |
| Extractor de requisitos | Extraer requisitos, tipo, obligatoriedad y cita. | Puede responder `UNKNOWN`; no inventa datos. |
| Correspondencia de evidencia | Relacionar requisito con dossier del tenant. | Solo accede al tenant activo. |
| Analista de riesgos | Señalar plazos, penalizaciones, garantías y dependencias. | No emite dictamen jurídico. |
| Revisor | Detectar citas ausentes, contradicciones y exceso de confianza. | No toma decisión final. |
| Orquestador | Coordinar trabajos, presupuesto y reintentos. | No amplía permisos ni cambia el tenant. |

### Contratos de salida obligatorios

Toda salida de agente debe:

- Validarse contra un esquema Zod estricto.
- Usar enumeraciones cerradas.
- Incluir referencias internas a documento, versión y fragmento.
- Registrar versión de prompt, modelo, herramientas, duración y coste.
- Rechazar campos inesperados antes de persistirse.

### Acciones prohibidas

- Elegir o modificar `tenant_id`.
- Ejecutar SQL arbitrario.
- Acceder a almacenamiento sin una herramienta acotada.
- Asignar roles o permisos.
- Presentar ofertas o firmar documentos.
- Afirmar elegibilidad jurídica definitiva.
- Inventar certificados, experiencia, importes o fechas.
- Usar información privada de otro tenant.

---

## 9. Modelo conceptual de datos

### Datos globales públicos

- `procurement_sources`
- `contracting_authorities`
- `tenders`
- `tender_lots`
- `tender_documents`
- `tender_document_versions`
- `tender_events`
- `cpv_codes`

### Datos privados por tenant

- `tenants`, `tenant_members`
- `company_profiles`, `company_services`, `company_projects`
- `company_certifications`, `company_evidence`
- `saved_searches`
- `tenant_tender_matches`, `qualification_runs`
- `requirements`, `requirement_evidence_links`
- `reviews`, `go_no_go_decisions`, `tasks`, `notifications`
- `audit_events`

Cada tabla privada de negocio incluirá `tenant_id UUID NOT NULL`, consultas parametrizadas e índice compuesto que comience por `tenant_id`. Los IDs expuestos serán UUIDv7 o ULID, no enteros secuenciales.

---

## 10. Seguridad multi-tenant

### Controles de acceso

- JWT firmado y validado mediante JWKS, incluyendo `iss`, `aud` y `exp`.
- Tenant resuelto por identidad y membresía verificadas, nunca desde el body.
- Contexto inmutable inyectado por middleware.
- Consultas siempre filtradas por `tenant_id`.
- PostgreSQL RLS como segunda barrera.
- Recursos privados de otros tenants responden `404` o `403` sin confirmar su existencia.

### Herramientas de agentes

Las herramientas estarán limitadas, por ejemplo:

```text
searchTenantEvidence(tenantContext, requirementId)
getTenderDocument(tenderId, documentVersionId)
saveQualificationDraft(tenantContext, qualificationId, validatedDraft)
```

No existirá una herramienta genérica como `executeSql`.

### Archivos y prompt injection

Los documentos se consideran contenido no confiable. El sistema aplicará validación de MIME y tamaño, hash, análisis de seguridad, almacenamiento aislado y URLs firmadas temporales. Los prompts delimitarán los documentos como datos y las herramientas quedarán restringidas por código.

### Tests obligatorios

- El Tenant A intenta leer, editar o enlazar datos del Tenant B.
- Se intenta modificar `tenant_id` en ruta, body, query o headers.
- Un rol `viewer` intenta aprobar una decisión.
- Un agente solicita evidencia sin tenant válido.
- Un documento intenta inducir exfiltración mediante prompt injection.

La condición de éxito es **cero fugas**.

---

## 11. Requisitos funcionales y aceptación

| ID | Requisito | Prioridad | Criterio de aceptación |
|---|---|---|---|
| RF-01 | Auth, tenants, membresías y roles. | Must | Un miembro de A no accede a recursos de B aunque conozca el ID. |
| RF-02 | Dossier empresarial con evidencia y vigencias. | Must | Ningún dato declarado se muestra como verificado sin revisión o documento. |
| RF-03 | Ingesta oficial idempotente y versionada. | Must | Procesar dos veces el mismo elemento no duplica el expediente. |
| RF-04 | Catálogo y filtros deterministas. | Must | Los resultados son reproducibles sin intervención del modelo. |
| RF-05 | Expediente, lotes, documentos y versiones. | Must | Se identifica la versión exacta analizada. |
| RF-06 | Extracción de requisitos con citas. | Must | Ningún requisito crítico persiste sin fuente o estado no verificable. |
| RF-07 | Precalificación requisito-evidencia. | Must | Un bloqueo obligatorio no queda oculto por una puntuación media. |
| RF-08 | Revisión y decisión auditables. | Must | Hay autor, fecha, motivo y versión de análisis. |
| RF-09 | Alertas de oportunidad, cambio y vencimiento. | Should | Una actualización no genera alertas duplicadas. |
| RF-10 | Auditoría de mutaciones y ejecuciones IA. | Must | Se puede reconstruir un análisis sin exponer secretos. |

---

## 12. Calidad, operaciones y costes

### Rendimiento y resiliencia

- API ordinaria: objetivo inicial p95 inferior a 800 ms, sin servicios externos.
- Análisis de IA: asíncrono, visible, reanudable e idempotente.
- Paginación en listados e índices comprobados con `EXPLAIN ANALYZE`.
- Reintentos con backoff, trabajos fallidos aislados y copias de seguridad verificadas.
- Una caída de fuente externa no impide consultar datos ya importados.

### Observabilidad

- Logs estructurados sin documentos completos, tokens ni secretos.
- Correlation ID entre petición, job y ejecución de agente.
- Métricas de ingesta, fallo, latencia, coste y calidad.
- Trazas de los pasos de IA y alertas ante trabajos atascados.

### Control de costes de IA

- Filtros deterministas antes de cualquier modelo.
- Reutilización de extracción de documentos públicos.
- Presupuesto por tenant y por tipo de análisis.
- Caché solo de datos no privados.
- Registro de coste por ejecución.

---

## 13. Evaluación de IA

Se construirá un dataset versionado de expedientes revisados manualmente que incluya requisitos esperados, obligatoriedad, citas correctas, casos ambiguos, modificaciones, contradicciones y ataques de prompt injection.

Métricas mínimas:

- Precisión y recall de extracción de requisitos.
- Exactitud de clasificación obligatorio/valorable.
- Porcentaje de conclusiones con cita válida.
- Exactitud de correspondencia requisito-evidencia.
- Tasa de alucinación y uso correcto de `UNKNOWN`.
- Tiempo y coste por expediente.
- Cero recuperaciones de evidencia cross-tenant.

No fijaremos una cifra de precisión sin un dataset etiquetado real. Sería una falsa certeza.

---

## 14. Métricas de producto

### Métrica principal

**Oportunidades cualificadas y revisadas por tenant y semana.**

### Métricas de valor

- Tiempo desde publicación a primera alerta relevante.
- Tiempo de precalificación con y sin LicitaIA.
- Porcentaje de recomendaciones aceptadas.
- Descartes tempranos por requisito detectado.
- Cobertura de evidencia en oportunidades activas.
- Oportunidades perdidas por aviso tardío.

### Métricas de confianza

- Correcciones humanas por análisis.
- Requisitos críticos omitidos.
- Citas inválidas.
- Análisis reabiertos tras un cambio de expediente.
- Incidentes de seguridad o privacidad.

No se optimizarán de forma aislada el número de alertas, los tokens consumidos ni el tiempo de permanencia en la aplicación.

---

## 15. Plan por fases

### Fase 0 — Validación

Entrevistar a 10-15 pymes y asesores, observar procesos reales y reunir expedientes de muestra autorizados. La pregunta clave será: “Cuéntame la última licitación que analizaste, cómo la encontraste, cuándo decidiste descartarla y cuánto tiempo empleaste”.

### Fase 1 — Fundamentos seguros

Auth, tenants, roles, PostgreSQL con RLS, auditoría, dossier básico y tests anti-BOLA/cross-tenant.

### Fase 2 — Datos públicos

Conector oficial inicial, normalización, documentos, versiones, buscador y jobs idempotentes.

### Fase 3 — Análisis documental

Extracción estructurada con citas, revisión humana, dataset de evaluación y observabilidad de IA.

### Fase 4 — Precalificación

Correspondencia requisito-evidencia, puertas obligatorias, encaje comercial y decisión Go/No-Go.

### Fase 5 — Alertas y portfolio

Alertas, panel de métricas, caso reproducible, CI completo y demo que muestre aislamiento, agentes y evaluación.

---

## 16. Definición de terminado del MVP

El MVP estará listo cuando pueda demostrarse, de extremo a extremo, que:

1. Dos tenants operan sin fugas verificables.
2. Se ingiere una licitación real desde una fuente oficial.
3. Se conservan expediente, documentos, hashes y versiones.
4. Se extraen requisitos estructurados con citas o se marcan como no verificables.
5. Cada tenant recibe una evaluación basada exclusivamente en su dossier.
6. Un requisito bloqueante no se oculta por un score positivo.
7. Un revisor autorizado corrige y toma una decisión auditable.
8. Una modificación invalida o recalcula los hallazgos afectados.
9. Las ejecuciones de IA registran modelo, versión, coste, tiempo y resultados validados.
10. Lint, tipos, tests, tests cross-tenant y análisis de seguridad pasan en CI.

---

## 17. Riesgos y preguntas abiertas

| Riesgo | Mitigación |
|---|---|
| Parecido a plataformas consolidadas | Diferenciar por precalificación explicable, evidencia y arquitectura segura; no replicar todo el ciclo. |
| Extracción imperfecta de pliegos | Citas, esquema estricto, dataset de evaluación y revisión humana. |
| Exceso de confianza | Estados `UNKNOWN`, cobertura y límites visibles. |
| Dossier desactualizado | Vigencias, responsables, recordatorios y revisión. |
| Coste elevado de modelos | Filtrado, caché pública, presupuestos y procesamiento bajo demanda. |
| Fuga entre tenants | Tenant context, consultas parametrizadas, RLS, storage aislado y tests específicos. |
| Dependencia de una fuente externa | Conectores desacoplados, versionado y reintentos. |
| Interpretación jurídica incorrecta | Producto de apoyo a decisión, no dictamen jurídico. |

Decisiones que requieren validación antes de implementar:

1. Subsector tecnológico inicial.
2. Fuente oficial y subconjunto de datos de la primera integración.
3. Documentos empresariales aceptados inicialmente.
4. Requisitos que obligan revisión experta.
5. Canal de notificación inicial.
6. Retención y eliminación de documentos privados.
7. Si el objetivo es exclusivamente portfolio o prueba con usuarios reales.

---

## 18. Definición final

> **LicitaIA es un SaaS multi-tenant de precalificación de contratación pública. Monitoriza oportunidades oficiales, extrae requisitos verificables y los contrasta con el dossier privado de cada empresa. Produce una evaluación explicable de elegibilidad potencial, encaje y riesgo, con evidencia, incertidumbre visible y decisión humana final.**

Será útil si reduce el tiempo invertido en oportunidades inadecuadas sin ocultar incertidumbre, comprometer datos entre tenants ni sustituir decisiones que requieren responsabilidad humana.
