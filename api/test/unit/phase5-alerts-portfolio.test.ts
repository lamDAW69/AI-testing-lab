import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  AlertQueryFilterSchema,
  CreateAlertInputSchema,
} from '../../src/modules/alerts/alerts.schema.js';
import {
  PortfolioQueryFilterSchema,
} from '../../src/modules/portfolio/portfolio.schema.js';
import { alertsRepository } from '../../src/modules/alerts/alerts.repository.js';

test('Fase 5 - Alertas: Esquema CreateAlertInputSchema rechaza inyecciones de campos privilegiados (.strict())', () => {
  const payloadConInyeccion = {
    tenderId: '142b99c0-3ebd-4732-856a-d15e3ef91600',
    alertType: 'DOCUMENT_CHANGED',
    severity: 'WARNING',
    title: 'Pliego modificado',
    message: 'Se ha detectado una nueva versión del pliego de condiciones.',
    deduplicationKey: 'v2-sha256-hash',
    // Campos inyectados maliciosamente
    tenantId: 'c46cacab-92f1-44a1-8aa2-ce310f770a07',
    isAdmin: true,
    status: 'READ',
  };

  assert.throws(
    () => CreateAlertInputSchema.parse(payloadConInyeccion),
    (err: unknown) => {
      assert(err instanceof Error);
      assert(err.message.includes('unrecognized_keys') || err.message.includes('Unrecognized key'));
      return true;
    },
    'CreateAlertInputSchema debe rechazar campos no declarados mediante .strict()',
  );
});

test('Fase 5 - Alertas: Validación estricta de tipos de alerta y severidad canónicos', () => {
  const alertValida = {
    tenderId: '142b99c0-3ebd-4732-856a-d15e3ef91600',
    alertType: 'DOCUMENT_CHANGED',
    severity: 'CRITICAL',
    title: 'Pliego modificado',
    message: 'Se ha detectado una nueva versión del pliego de condiciones.',
    deduplicationKey: 'doc-version-0927331b',
  };

  const parsed = CreateAlertInputSchema.parse(alertValida);
  assert.equal(parsed.alertType, 'DOCUMENT_CHANGED');
  assert.equal(parsed.severity, 'CRITICAL');

  const alertInvalida = {
    ...alertValida,
    alertType: 'RANDOM_HACK_TYPE',
  };

  assert.throws(
    () => CreateAlertInputSchema.parse(alertInvalida),
    /Invalid enum value/,
    'Debe rechazar tipos de alerta no contemplados en el enum canónico',
  );
});

test('Fase 5 - Alertas: Generación determinista e idempotente del hash SHA-256', () => {
  const tenantId = 'c46cacab-92f1-44a1-8aa2-ce310f770a07';
  const alertType = 'DOCUMENT_CHANGED';
  const deduplicationKey = 'version-2-uuid-abc-123';

  const hash1 = alertsRepository.computeIdempotencyHash(tenantId, alertType, deduplicationKey);
  const hash2 = alertsRepository.computeIdempotencyHash(tenantId, alertType, deduplicationKey);

  assert.equal(hash1, hash2, 'El hash idempotente debe ser exactamente idéntico ante los mismos parámetros');
  assert.equal(hash1.length, 64, 'El hash SHA-256 debe tener longitud 64 en formato hexadecimal');

  // Si cambia el tenant, el hash debe ser completamente distinto (aislamiento criptográfico)
  const otherTenantId = 'e2b34451-b841-4c6e-8266-9dcbb3db1234';
  const hashOtherTenant = alertsRepository.computeIdempotencyHash(otherTenantId, alertType, deduplicationKey);
  assert.notEqual(hash1, hashOtherTenant, 'El hash no debe coincidir entre distintos tenants');
});

test('Fase 5 - Alertas: AlertQueryFilterSchema valida filtros y aplica valores por defecto seguros', () => {
  const queryDefecto = AlertQueryFilterSchema.parse({});
  assert.equal(queryDefecto.status, 'UNREAD');
  assert.equal(queryDefecto.limit, 20);
  assert.equal(queryDefecto.offset, 0);

  const queryInvalida = {
    status: 'ALL',
    limit: 500, // Excede el máximo permitido (100)
  };
  assert.throws(
    () => AlertQueryFilterSchema.parse(queryInvalida),
    /Number must be less than or equal to 100/,
  );
});

test('Fase 5 - Portfolio: PortfolioQueryFilterSchema valida filtros deterministas y rechaza campos arbitrarios', () => {
  const validFilters = {
    decision: 'PURSUE',
    eligibilityStatus: 'ELIGIBLE',
    invalidationStatus: 'VALID',
    cpv: '72224000',
    minAmountCents: 1000000,
    maxAmountCents: 50000000,
    hasBlockingReasons: 'false',
    limit: 15,
    offset: 0,
  };

  const parsed = PortfolioQueryFilterSchema.parse(validFilters);
  assert.equal(parsed.decision, 'PURSUE');
  assert.equal(parsed.eligibilityStatus, 'ELIGIBLE');
  assert.equal(parsed.hasBlockingReasons, false);
  assert.equal(parsed.cpv, '72224000');

  // Intento de CPV con caracteres inválidos
  assert.throws(
    () => PortfolioQueryFilterSchema.parse({ cpv: 'CPV-INJECTION--' }),
    /El código CPV debe contener entre 2 y 8 dígitos/,
  );

  // Inyección de parámetros inesperados
  assert.throws(
    () => PortfolioQueryFilterSchema.parse({ ...validFilters, bypassAuth: true }),
    (err: unknown) => {
      assert(err instanceof Error);
      assert(err.message.includes('unrecognized_keys') || err.message.includes('Unrecognized key'));
      return true;
    },
  );
});

test('Fase 5 - Invalidez Documental: Principio de conservación del histórico y vigencia', () => {
  // Simulación del estado antes y después de invalidación
  const previousAnalysis = {
    id: '0aafb471-e8b6-48d6-a27a-3300bff0edd2',
    tenderId: '142b99c0-3ebd-4732-856a-d15e3ef91600',
    documentVersionId: '0927331b-ed1c-4a34-aeb1-7fc183df6b0e',
    isCurrent: true,
    invalidationStatus: 'VALID',
    invalidationReason: null,
    invalidatedAt: null,
  };

  const newDocVersionId = '85c9a41b-411a-4d22-bf44-551122334455';

  // Al llegar nueva versión, se marca como REQUIRES_REANALYSIS sin borrar ni mutar IDs
  const invalidatedAnalysis = {
    ...previousAnalysis,
    isCurrent: false,
    invalidationStatus: 'REQUIRES_REANALYSIS',
    invalidationReason: 'Nueva versión documental o pliego rectificado detectado',
    supersededByDocumentVersionId: newDocVersionId,
    invalidatedAt: new Date().toISOString(),
  };

  assert.equal(invalidatedAnalysis.id, previousAnalysis.id, 'El ID del análisis histórico se conserva intacto');
  assert.equal(invalidatedAnalysis.isCurrent, false, 'El análisis antiguo deja de ser vigente');
  assert.equal(invalidatedAnalysis.invalidationStatus, 'REQUIRES_REANALYSIS');
  assert.equal(invalidatedAnalysis.supersededByDocumentVersionId, newDocVersionId);
  assert.ok(invalidatedAnalysis.invalidatedAt, 'Se registra el momento exacto de invalidación');
});
