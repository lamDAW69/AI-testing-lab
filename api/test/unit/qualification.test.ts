import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateDeterministicGates,
  type CompanyProfileForGates,
  type RequirementEvaluationForGates,
  type TenderContextForGates,
} from '../../src/modules/qualification/deterministic-gates.js';
import {
  QualificationMatcherAgent,
} from '../../src/modules/qualification/qualification-matcher.agent.js';
import {
  CreateAnalysisDecisionSchema,
  CreateDossierItemSchema,
  CreateOpportunityAnalysisSchema,
} from '../../src/modules/qualification/qualification.schema.js';

// ============================================================================
// 1. PRUEBAS DE PUERTAS DETERMINISTAS DE ELEGIBILIDAD
// ============================================================================

test('Puerta determinista: Plazo vencido marca POTENTIALLY_INELIGIBLE de forma inmediata', () => {
  const tender: TenderContextForGates = {
    status: 'PUBLISHED',
    submissionDeadline: new Date(Date.now() - 1000 * 60 * 60 * 24), // Ayer
    estimatedValueCents: 50_000_00,
    title: 'Licitación vencida',
  };

  const result = evaluateDeterministicGates({ tender });
  assert.equal(result.eligibilityStatus, 'POTENTIALLY_INELIGIBLE');
  assert.ok(result.blockingReasons.some((r) => r.includes('expirado')));
});

test('Puerta determinista: Expediente cancelado o suspendido genera inadmisión', () => {
  const tender: TenderContextForGates = {
    status: 'CANCELLED',
    submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    estimatedValueCents: 50_000_00,
    title: 'Licitación cancelada',
  };

  const result = evaluateDeterministicGates({ tender });
  assert.equal(result.eligibilityStatus, 'POTENTIALLY_INELIGIBLE');
  assert.ok(result.blockingReasons.some((r) => r.includes('no está activo')));
});

test('Puerta determinista: Presupuesto por encima del máximo asumible por la empresa bloquea la oportunidad', () => {
  const tender: TenderContextForGates = {
    status: 'PUBLISHED',
    submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    estimatedValueCents: 500_000_00, // 500.000 €
    title: 'Licitación de gran envergadura',
  };

  const profile: CompanyProfileForGates = {
    maxContractCents: 200_000_00, // Máximo 200.000 €
    minContractCents: 10_000_00,
    territories: [],
  };

  const result = evaluateDeterministicGates({ tender, profile });
  assert.equal(result.eligibilityStatus, 'POTENTIALLY_INELIGIBLE');
  assert.ok(result.blockingReasons.some((r) => r.includes('supera el límite máximo')));
});

test('Puerta determinista: Requisito obligatorio con NOT_SUPPORTED domina y bloquea el resultado global', () => {
  const tender: TenderContextForGates = {
    status: 'PUBLISHED',
    submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    estimatedValueCents: 50_000_00,
    title: 'Licitación con requisito excluyente',
  };

  const requirements: RequirementEvaluationForGates[] = [
    {
      requirementId: 'req-1',
      requirementType: 'MANDATORY',
      category: 'TECHNICAL',
      summary: 'Certificado específico de homologación de seguridad',
      status: 'NOT_SUPPORTED',
      hasEvidence: false,
    },
    {
      requirementId: 'req-2',
      requirementType: 'SCORABLE',
      category: 'TECHNICAL',
      summary: 'Plan de sostenibilidad ambiental valorable',
      status: 'SUPPORTED',
      hasEvidence: true,
    },
  ];

  const result = evaluateDeterministicGates({ tender, requirements });
  assert.equal(result.eligibilityStatus, 'POTENTIALLY_INELIGIBLE');
  assert.ok(result.blockingReasons.some((r) => r.includes('Incumplimiento de requisito obligatorio')));
});

test('Puerta determinista: Requisito no obligatorio con NOT_SUPPORTED NO bloquea elegibilidad global', () => {
  const tender: TenderContextForGates = {
    status: 'PUBLISHED',
    submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    estimatedValueCents: 50_000_00,
    title: 'Licitación con criterio baremable no cubierto',
  };

  const requirements: RequirementEvaluationForGates[] = [
    {
      requirementId: 'req-1',
      requirementType: 'SCORABLE',
      category: 'TECHNICAL',
      summary: 'Mejora en plazos de entrega',
      status: 'NOT_SUPPORTED',
      hasEvidence: false,
    },
  ];

  const result = evaluateDeterministicGates({ tender, requirements });
  assert.equal(result.eligibilityStatus, 'ELIGIBLE');
  assert.equal(result.blockingReasons.length, 0);
});

test('Puerta determinista: Requisito obligatorio en UNKNOWN deriva en NEEDS_EXPERT_REVIEW', () => {
  const tender: TenderContextForGates = {
    status: 'PUBLISHED',
    submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    estimatedValueCents: 50_000_00,
    title: 'Licitación con solvencia dudosa',
  };

  const requirements: RequirementEvaluationForGates[] = [
    {
      requirementId: 'req-1',
      requirementType: 'MANDATORY',
      category: 'ECONOMIC',
      summary: 'Seguro de responsabilidad civil de 1.000.000 €',
      status: 'UNKNOWN',
      hasEvidence: false,
    },
  ];

  const result = evaluateDeterministicGates({ tender, requirements });
  assert.equal(result.eligibilityStatus, 'NEEDS_EXPERT_REVIEW');
  assert.equal(result.blockingReasons.length, 0);
  assert.ok(result.warnings.some((w) => w.includes('sin evidencia concluyente')));
});

// ============================================================================
// 2. PRUEBAS DEL AGENTE DE CORRESPONDENCIA REQUISITO-EVIDENCIA
// ============================================================================

test('Matcher Agent: Dossier vacío se evalúa deterministamente como UNKNOWN sin llamadas externas', async () => {
  const agent = new QualificationMatcherAgent();
  const res = await agent.evaluateRequirement(
    {
      id: 'req-1',
      category: 'TECHNICAL',
      requirementType: 'MANDATORY',
      summary: 'Solvencia técnica específica',
      extractedText: 'El licitador deberá acreditar 3 contratos similares.',
      citations: [{ quotedText: '3 contratos similares' }],
    },
    [], // Dossier vacío
  );

  assert.equal(res.status, 'UNKNOWN');
  assert.equal(res.confidence, 100);
  assert.equal(res.agent.costMicrounits, 0);
  assert.equal(res.evidences.length, 0);
  assert.ok(res.rationale.includes('no contiene documentos'));
});

// ============================================================================
// 3. PRUEBAS DE ESQUEMAS ZOD (.strict() Anti-Mass Assignment)
// ============================================================================

test('Anti-Mass Assignment: CreateOpportunityAnalysisSchema rechaza inyecciones de campos privilegiados', () => {
  const valid = {
    idempotencyKey: '00000000-0000-0000-0000-000000000001',
    tenderId: '00000000-0000-0000-0000-000000000002',
    documentVersionId: '00000000-0000-0000-0000-000000000003',
  };
  assert.doesNotThrow(() => CreateOpportunityAnalysisSchema.parse(valid));

  const injected = {
    ...valid,
    tenantId: '00000000-0000-0000-0000-000000000999', // Intento de inyectar tenant
    status: 'COMPLETED',                             // Intento de saltarse el worker
    eligibilityStatus: 'ELIGIBLE',                    // Intento de forzar elegibilidad
  };
  assert.throws(() => CreateOpportunityAnalysisSchema.parse(injected));
});

test('Anti-Mass Assignment: CreateAnalysisDecisionSchema valida decisiones canónicas', () => {
  assert.doesNotThrow(() =>
    CreateAnalysisDecisionSchema.parse({
      decision: 'PURSUE',
      rationale: 'Cumplimos todos los requisitos técnicos y el margen es atractivo.',
    }),
  );

  assert.throws(() =>
    CreateAnalysisDecisionSchema.parse({
      decision: 'INVALID_DECISION',
      rationale: 'Texto corto',
    }),
  );
});

test('Anti-Mass Assignment: CreateDossierItemSchema valida categorías permitidas y rechaza campos extras', () => {
  const validItem = {
    category: 'TECHNICAL',
    title: 'Experiencia en proyectos similares',
    description: 'Contrato ejecutado con la administración durante 2024.',
  };
  assert.doesNotThrow(() => CreateDossierItemSchema.parse(validItem));

  const invalidItem = {
    ...validItem,
    category: 'HACK_CATEGORY',
  };
  assert.throws(() => CreateDossierItemSchema.parse(invalidItem));
});
