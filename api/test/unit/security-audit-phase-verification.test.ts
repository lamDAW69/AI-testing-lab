import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isTicCpv,
  isTicTender,
  extractCpvList,
  placspConnector,
} from '../../src/modules/procurement/connectors/placsp.connector.js';
import {
  PlacspTenderInputSchema,
  TenderQueryFilterSchema,
} from '../../src/modules/procurement/procurement.schema.js';
import {
  CreateOpportunityAnalysisSchema,
  CreateAnalysisDecisionSchema,
} from '../../src/modules/qualification/qualification.schema.js';
import { CreateAlertInputSchema } from '../../src/modules/alerts/alerts.schema.js';

test('SEGURIDAD: Anti-Mass Assignment (.strict()) rechaza campos inyectados en todos los esquemas', () => {
  // 1. Intento de inyectar tenant_id o roles en creación de análisis
  const maliciousAnalysis = {
    tenderId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    documentVersionId: '018f4a12-892a-7921-98a1-2d4e8b1e4f2b',
    // Inyección de campos privilegiados
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f99',
    role: 'SUPERADMIN',
    bypassGates: true,
  };
  const analysisResult = CreateOpportunityAnalysisSchema.safeParse(maliciousAnalysis);
  assert.equal(analysisResult.success, false, 'Debe rechazar campos privilegiados no autorizados');

  // 2. Intento de forzar decisión con campos maliciosos
  const maliciousDecision = {
    decision: 'PURSUE',
    rationale: 'Aprobación válida por comité',
    overrideDeterministicGates: true,
    isVerified: true,
  };
  const decisionResult = CreateAnalysisDecisionSchema.safeParse(maliciousDecision);
  assert.equal(decisionResult.success, false, 'Debe rechazar campos arbitrarios en decisiones');

  // 3. Intento de inyectar alertas arbitrarias
  const maliciousAlert = {
    type: 'NEW_TENDER_MATCH',
    severity: 'INFO',
    title: 'Nueva oportunidad',
    message: 'Mensaje de alerta legítimo',
    isAdminBroadcast: true,
  };
  const alertResult = CreateAlertInputSchema.safeParse(maliciousAlert);
  assert.equal(alertResult.success, false, 'Debe rechazar campos no reconocidos en alertas');
});

test('SEGURIDAD: CPV Sanitizer y Anti-Poisoning rechaza datos maliciosos o no TIC', () => {
  // Rechazo de inyecciones SQL / caracteres no numéricos en CPVs
  const sqlInjectionNode = { 'cbc:ItemClassificationCode': "72000000' OR '1'='1" };
  const extracted = extractCpvList(sqlInjectionNode);
  assert.deepEqual(extracted, ['72000000'], 'Solo debe conservar dígitos limpios normalizados');

  // Asegurar que códigos ajenos al sector TIC NUNCA son aceptados como TIC
  const nonTicCodes = [
    '45000000', // Obras de construcción
    '45210000', // Edificación de viviendas
    '90511100', // Recogida de basuras
    '90910000', // Limpieza de edificios
    '34114200', // Vehículos de policía
    '85131000', // Odontología
    '64110000', // Correos y envíos
    '00000000', // Código inválido/nulo
    '',
    undefined,
  ];

  for (const code of nonTicCodes) {
    assert.equal(
      isTicCpv(code),
      false,
      `El código CPV ${code} no debe ser clasificado como TIC bajo ninguna circunstancia`
    );
  }

  // Comprobar que códigos genuinos sí se validan
  const validTicCodes = ['72000000', '72262000', '72250000', '48000000', '48218000'];
  for (const code of validTicCodes) {
    assert.equal(isTicCpv(code), true, `El código TIC ${code} debe ser aceptado`);
  }
});

test('SEGURIDAD: Determinismo Criptográfico del Hash SHA-256 en licitaciones', () => {
  const baseTender = placspConnector.normalizeEntry({
    id: 'EXP-SEC-001',
    title: 'Desarrollo de microservicios cloud para la administración',
    budgetAmountEur: 100000,
    cpvCode: '72262000',
    authority: { name: 'Órgano de prueba' },
    documents: [
      { type: 'PCAP', name: 'PCAP.pdf', url: 'https://contrataciondelestado.es/pcap.pdf' },
    ],
  });

  const hash1 = placspConnector.computePayloadHash(baseTender);
  const hash2 = placspConnector.computePayloadHash(baseTender);

  // Determinismo estricto
  assert.equal(hash1, hash2, 'El hash SHA-256 debe ser estrictamente determinista');

  // Sensibilidad al menor cambio (tamper detection)
  const modifiedTender = { ...baseTender, budgetAmountCents: 10000001 };
  const hashModified = placspConnector.computePayloadHash(modifiedTender);
  assert.notEqual(hash1, hashModified, 'Cualquier variación en presupuesto debe cambiar el hash');
});

test('SEGURIDAD: TenderQueryFilterSchema sanitiza y rechaza parámetros de búsqueda maliciosos', () => {
  const validQuery = {
    limit: '20',
    page: '1',
    cpv: '72',
    search: 'cloud',
  };
  const parsed = TenderQueryFilterSchema.safeParse(validQuery);
  assert.equal(parsed.success, true);

  // Inyección de parámetros desconocidos
  const maliciousQuery = {
    ...validQuery,
    select: '* from users--',
    dropTable: 'true',
  };
  const maliciousParsed = TenderQueryFilterSchema.safeParse(maliciousQuery);
  assert.equal(maliciousParsed.success, false, 'Debe rechazar queries con parámetros no declarados');
});
