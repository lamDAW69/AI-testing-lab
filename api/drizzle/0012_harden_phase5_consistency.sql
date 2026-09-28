-- Normaliza posibles análisis vigentes duplicados conservando únicamente el
-- más reciente por tenant y expediente.
WITH ranked_current AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY tenant_id, tender_id
           ORDER BY created_at DESC, id DESC
         ) AS position
  FROM opportunity_analyses
  WHERE is_current = true
)
UPDATE opportunity_analyses AS analysis
SET is_current = false,
    invalidation_status = 'STALE',
    invalidation_reason = COALESCE(
      analysis.invalidation_reason,
      'Sustituido por un análisis posterior del mismo expediente'
    ),
    invalidated_at = COALESCE(analysis.invalidated_at, now()),
    updated_at = now()
FROM ranked_current
WHERE analysis.id = ranked_current.id
  AND ranked_current.position > 1;

--> statement-breakpoint
-- La base de datos impide que una carrera entre peticiones deje dos análisis
-- vigentes para la misma oportunidad y organización.
CREATE UNIQUE INDEX "uq_opportunity_analyses_tenant_tender_current"
  ON "opportunity_analyses" ("tenant_id", "tender_id")
  WHERE "is_current" = true;
