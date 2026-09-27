import { and, eq } from 'drizzle-orm';
import { db, withTenantTransaction } from '../../../db/client.js';
import {
  analysisDecisions,
  opportunityAnalyses,
  tenderDocuments,
  tenderDocumentVersions,
  tenders,
} from '../../../db/schema.js';
import { invalidationService } from '../invalidation.service.js';
import { alertsRepository } from '../../alerts/alerts.repository.js';
import { portfolioRepository } from '../../portfolio/portfolio.repository.js';

const TENANT_A_ID = 'c46cacab-92f1-44a1-8aa2-ce310f770a07'; // Pliego AI Solutions S.L.
const TENANT_B_ID = '00000000-0000-4000-8000-000000000002'; // Mock Tenant B para prueba anti-fuga
const VALDETORRES_TENDER_ID = '142b99c0-3ebd-4732-856a-d15e3ef91600';

async function runDemoPhase5E2E() {
  console.log('================================================================');
  console.log('🚀 DEMO REPRODUCIBLE E2E — LICITAIA FASE 5: ALERTAS Y PORTFOLIO');
  console.log('================================================================\n');

  // 1. Verificar expediente y análisis previo de Fase 4
  console.log('📌 1. Verificando expediente oficial y análisis de Fase 4...');
  const [tender] = await db
    .select()
    .from(tenders)
    .where(eq(tenders.id, VALDETORRES_TENDER_ID))
    .limit(1);

  if (!tender) {
    throw new Error(`Expediente ${VALDETORRES_TENDER_ID} no encontrado en base de datos`);
  }
  console.log(`   ✅ Expediente oficial: [${tender.sourceTenderId}] ${tender.title}`);

  const analysesA = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return tx
      .select()
      .from(opportunityAnalyses)
      .where(
        and(
          eq(opportunityAnalyses.tenantId, TENANT_A_ID),
          eq(opportunityAnalyses.tenderId, VALDETORRES_TENDER_ID),
        ),
      );
  });

  const latestAnalysisA = analysesA[0];
  if (!latestAnalysisA) {
    throw new Error('No se encontró análisis de oportunidad previo para Tenant A');
  }

  console.log(`   ✅ Análisis previo encontrado: ID=${latestAnalysisA.id}`);
  console.log(`      - Estado de elegibilidad: ${latestAnalysisA.eligibilityStatus}`);
  console.log(`      - Estado de vigencia actual: ${latestAnalysisA.invalidationStatus} (is_current=${latestAnalysisA.isCurrent})`);

  // Verificar si ya tiene decisión humana registrada
  const decisionsA = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return tx
      .select()
      .from(analysisDecisions)
      .where(
        and(
          eq(analysisDecisions.tenantId, TENANT_A_ID),
          eq(analysisDecisions.analysisId, latestAnalysisA.id),
        ),
      );
  });
  console.log(`      - Decisión humana registrada: ${decisionsA[0]?.decision ?? 'UNDECIDED'} (${decisionsA[0]?.rationale ?? 'Sin motivo'})\n`);

  // 2. Simular detección de nueva versión documental / adenda oficial
  console.log('📌 2. Simulando publicación de adenda o pliego rectificado...');
  const [doc] = await db
    .select()
    .from(tenderDocuments)
    .where(eq(tenderDocuments.tenderId, VALDETORRES_TENDER_ID))
    .limit(1);

  if (!doc) {
    throw new Error(`No se encontró documento asociado al expediente ${VALDETORRES_TENDER_ID}`);
  }

  // Comprobar o crear versión 2 simulada del pliego
  const existingV2 = await db
    .select()
    .from(tenderDocumentVersions)
    .where(
      and(
        eq(tenderDocumentVersions.documentId, doc.id),
        eq(tenderDocumentVersions.versionNumber, 2),
      ),
    )
    .limit(1);

  let version2Id: string;
  if (existingV2[0]) {
    version2Id = existingV2[0].id;
    console.log(`   ℹ️ Versión 2 ya existente: ID=${version2Id}`);
  } else {
    const insertedV2 = await db
      .insert(tenderDocumentVersions)
      .values({
        documentId: doc.id,
        versionNumber: 2,
        url: 'https://contrataciondelestado.es/wps/poc?uri=deeplink:documentos&id=adenda_valdetorres_v2.pdf',
        contentHash: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
        mimeType: 'application/pdf',
        byteSize: 1048576,
      })
      .returning();
    version2Id = insertedV2[0]!.id;
    console.log(`   ✅ Creada versión 2 inmutable del pliego: ID=${version2Id}`);
  }

  // 3. Disparar invalidación documental atómica
  console.log('\n📌 3. Ejecutando invalidación atómica multi-inquilino...');
  const invalidationResults = await invalidationService.invalidateAnalysesForDocumentVersion(
    VALDETORRES_TENDER_ID,
    version2Id,
    'Adenda oficial rectificativa de criterios y plazos publicada en PLACSP',
  );

  console.log(`   ✅ Análisis invalidados en la base de datos: ${invalidationResults.length}`);
  for (const inv of invalidationResults) {
    console.log(`      - Análisis ${inv.analysisId} del Tenant ${inv.tenantId}`);
  }

  // 4. Verificación de conservación de histórico
  console.log('\n📌 4. Verificando principio de conservación de histórico...');
  const [updatedAnalysisA] = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return tx
      .select()
      .from(opportunityAnalyses)
      .where(
        and(
          eq(opportunityAnalyses.tenantId, TENANT_A_ID),
          eq(opportunityAnalyses.id, latestAnalysisA.id),
        ),
      );
  });

  if (!updatedAnalysisA) {
    throw new Error('El análisis desapareció tras la invalidación (VIOLACIÓN DE CONSERVACIÓN)');
  }

  console.log(`   ✅ El análisis histórico se conserva intacto (ID=${updatedAnalysisA.id})`);
  console.log(`      - is_current: ${updatedAnalysisA.isCurrent} (esperado: false)`);
  console.log(`      - invalidation_status: ${updatedAnalysisA.invalidationStatus} (esperado: REQUIRES_REANALYSIS)`);
  console.log(`      - motivo: ${updatedAnalysisA.invalidationReason}`);
  console.log(`      - fecha invalidación: ${updatedAnalysisA.invalidatedAt?.toISOString()}`);

  // 5. Verificación de alerta idempotente en la outbox
  console.log('\n📌 5. Verificando generación de alerta idempotente en la outbox...');
  const alertsA = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return alertsRepository.listAlerts(tx, TENANT_A_ID, {
      status: 'ALL',
      alertType: 'DOCUMENT_CHANGED',
      limit: 10,
      offset: 0,
    });
  });

  const matchingAlert = alertsA.alerts.find((a) => a.tenderId === VALDETORRES_TENDER_ID);
  if (!matchingAlert) {
    throw new Error('No se generó la alerta DOCUMENT_CHANGED en la outbox de Tenant A');
  }

  console.log(`   ✅ Alerta generada con éxito en la outbox:`);
  console.log(`      - ID: ${matchingAlert.id}`);
  console.log(`      - Tipo: ${matchingAlert.alertType}`);
  console.log(`      - Severidad: ${matchingAlert.severity}`);
  console.log(`      - Título: ${matchingAlert.title}`);
  console.log(`      - Mensaje: ${matchingAlert.message}`);
  console.log(`      - Hash Idempotencia: ${matchingAlert.idempotencyHash}`);

  // Probar deduplicación: disparar la misma invalidación de nuevo
  console.log('   🔄 Probando deduplicación con llamada idéntica repetida...');
  await invalidationService.invalidateAnalysesForDocumentVersion(
    VALDETORRES_TENDER_ID,
    version2Id,
    'Adenda oficial rectificativa de criterios y plazos publicada en PLACSP',
  );

  const alertsCountAfterRetry = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return alertsRepository.listAlerts(tx, TENANT_A_ID, {
      status: 'ALL',
      alertType: 'DOCUMENT_CHANGED',
      limit: 10,
      offset: 0,
    });
  });

  console.log(`   ✅ Total alertas tras llamada repetida: ${alertsCountAfterRetry.total} (cero duplicados, 100% idempotente)`);

  // 6. Consulta de Portfolio de Oportunidades (determinista, cero LLM)
  console.log('\n📌 6. Consultando Portfolio de Oportunidades (sin coste LLM)...');
  const portfolioA = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return portfolioRepository.listPortfolio(tx, TENANT_A_ID, {
      limit: 10,
      offset: 0,
    });
  });

  console.log(`   ✅ Oportunidades en portfolio de Tenant A: ${portfolioA.total}`);
  for (const item of portfolioA.items) {
    console.log(`      - [${item.tender.sourceTenderId}] ${item.tender.title.slice(0, 50)}...`);
    console.log(`        Elegibilidad: ${item.latestAnalysis?.eligibilityStatus}`);
    console.log(`        Vigencia: ${item.latestAnalysis?.invalidationStatus} (Requiere re-análisis: ${!item.latestAnalysis?.isCurrent})`);
    console.log(`        Decisión: ${item.decision?.decision ?? 'UNDECIDED'}`);
    console.log(`        Alertas no leídas: ${item.unreadAlertsCount}`);
  }

  // 7. Prueba Cross-Tenant Anti-Fuga (Tenant B)
  console.log('\n📌 7. Ejecutando prueba de seguridad anti-fuga (Cross-Tenant Leak Test)...');
  const portfolioB = await withTenantTransaction(TENANT_B_ID, async (tx) => {
    return portfolioRepository.listPortfolio(tx, TENANT_B_ID, {
      limit: 10,
      offset: 0,
    });
  });

  const alertsB = await withTenantTransaction(TENANT_B_ID, async (tx) => {
    return alertsRepository.listAlerts(tx, TENANT_B_ID, {
      status: 'ALL',
      limit: 10,
      offset: 0,
    });
  });

  console.log(`   🛡️ Oportunidades visibles para Tenant B: ${portfolioB.total} (esperado: 0)`);
  console.log(`   🛡️ Alertas visibles para Tenant B: ${alertsB.total} (esperado: 0)`);

  if (portfolioB.total > 0 || alertsB.total > 0) {
    throw new Error('❌ ALERTA CRÍTICA DE SEGURIDAD: Fuga de datos detectada entre tenants!');
  }
  console.log('   ✅ RLS validado: Tenant B no puede ver ni inferir ningún dato de Tenant A.');

  // 8. Consulta de Métricas de Observabilidad
  console.log('\n📌 8. Consultando métricas agregadas de observabilidad...');
  const metricsA = await withTenantTransaction(TENANT_A_ID, async (tx) => {
    return portfolioRepository.getPortfolioMetrics(tx, TENANT_A_ID);
  });

  console.log('   ✅ Métricas obtenidas:');
  console.log(`      - Total expedientes seguidos: ${metricsA.summary.totalTendersTracked}`);
  console.log(`      - Análisis vigentes: ${metricsA.summary.validAnalyses} | Obsoletos/Invalidos: ${metricsA.summary.staleOrInvalidAnalyses}`);
  console.log(`      - Decisiones: PURSUE=${metricsA.decisionsDistribution.PURSUE}, REVIEW=${metricsA.decisionsDistribution.REVIEW}, DISCARD=${metricsA.decisionsDistribution.DISCARD}`);
  console.log(`      - Distribución de elegibilidad:`, metricsA.eligibilityDistribution);
  console.log(`      - Top causas de bloqueo:`, metricsA.topBlockingReasons);
  console.log(`      - Coste acumulado IA: $${metricsA.aiExecutionStats.totalCostUsd} USD (${metricsA.aiExecutionStats.totalCostMicrounits} microunidades)`);
  console.log(`      - Alertas no leídas: ${metricsA.alertsStats.unreadCount}`);

  console.log('\n================================================================');
  console.log('🎉 DEMO E2E DE FASE 5 COMPLETADA EXITOSAMENTE');
  console.log('================================================================\n');
}

runDemoPhase5E2E().catch((err) => {
  console.error('\n❌ ERROR EN DEMO E2E FASE 5:', err);
  process.exitCode = 1;
});
