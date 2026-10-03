import { procurementService } from '../procurement.service.js';
import {
  placspConnector,
  RawPlacspEntry,
  PLACSP_OFFICIAL_FEED_URL,
  PageResult,
} from '../connectors/placsp.connector.js';
import { pool } from '../../../db/client.js';

/**
 * Fixture de expedientes reales representativos de contratación de servicios TIC
 * en la administración pública española (CPV 72262000, 72000000, etc.).
 */
export const SAMPLE_PLACSP_ENTRIES: readonly RawPlacspEntry[] = [
  {
    id: 'EXP-2026-TIC-001',
    title: 'Servicios de desarrollo evolutivo y mantenimiento de aplicaciones cloud en arquitectura abierta',
    summary: 'Contratación de servicios de ingeniería de software, pruebas automatizadas y soporte a la digitalización.',
    status: 'PUBLISHED',
    procedureType: 'OPEN',
    contractType: 'SERVICES',
    budgetAmountEur: 150000.0,
    taxInclusiveAmountEur: 181500.0,
    estimatedValueEur: 300000.0,
    cpvCode: '72262000',
    additionalCpvCodes: ['72260000', '72000000'],
    submissionDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-10T10:00:00.000Z',
    sourceUpdatedAt: '2026-09-10T10:00:00.000Z',
    authority: {
      name: 'Dirección General de Transformación Digital',
      taxId: 'S2800001B',
      sourceAuthorityId: 'DIR3-A01000001',
      buyerType: 'central',
      postalCode: '28071',
      city: 'Madrid',
    },
    lots: [
      {
        lotNumber: 1,
        title: 'Lote 1: Desarrollo frontend accesible y componentes web',
        description: 'Desarrollo de interfaces accesibles WCAG 2.1 AA.',
        budgetAmountEur: 70000.0,
        cpvCode: '72262000',
      },
      {
        lotNumber: 2,
        title: 'Lote 2: Backend microservicios y bases de datos relacionales',
        description: 'APIs seguras, arquitecturas multi-tenant y PostgreSQL.',
        budgetAmountEur: 80000.0,
        cpvCode: '72262000',
      },
    ],
    documents: [
      {
        type: 'PCAP',
        name: 'Pliego de Cláusulas Administrativas Particulares (PCAP)',
        url: 'https://contrataciondelestado.es/wps/pcap_exp_2026_tic_001.pdf',
        contentHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90',
        mimeType: 'application/pdf',
      },
      {
        type: 'PPT',
        name: 'Pliego de Prescripciones Técnicas (PPT)',
        url: 'https://contrataciondelestado.es/wps/ppt_exp_2026_tic_001.pdf',
        contentHash: 'f1e2d3c4b5a60918273645a4b3c2d1e0f1e2d3c4b5a60918273645a4b3c2d1e0',
        mimeType: 'application/pdf',
      },
    ],
  },
  {
    id: 'EXP-2026-TIC-002',
    title: 'Suministro y configuración de licencias de plataforma de análisis de datos y ciberseguridad',
    summary: 'Adquisición de software de monitorización y auditoría para entornos de producción.',
    status: 'PUBLISHED',
    procedureType: 'SIMPLIFIED_OPEN',
    contractType: 'SUPPLIES',
    budgetAmountEur: 45000.0,
    taxInclusiveAmountEur: 54450.0,
    cpvCode: '48000000',
    submissionDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-12T12:30:00.000Z',
    sourceUpdatedAt: '2026-09-12T12:30:00.000Z',
    authority: {
      name: 'Agencia Tributaria Municipal de Valencia',
      taxId: 'P4625000C',
      buyerType: 'local',
      postalCode: '46002',
      city: 'Valencia',
    },
    documents: [
      {
        type: 'PCAP',
        name: 'Pliego Administrativo Simplificado',
        url: 'https://contrataciondelestado.es/wps/pcap_exp_2026_tic_002.pdf',
        contentHash: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
        mimeType: 'application/pdf',
      },
    ],
  },
];

interface CliOptions {
  isLive: boolean;
  isHistorical: boolean;
  isFixture: boolean;
  resume: boolean;
  fromDate?: Date;
  maxPages?: number;
  maxItems?: number;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  let isLive = args.includes('--live');
  const isHistorical = args.includes('--historical');
  const isFixture = args.includes('--fixture');
  const resume = args.includes('--resume');

  let fromDate: Date | undefined;
  const fromArg = args.find((a) => a.startsWith('--from='));
  if (fromArg) {
    const rawDate = fromArg.split('=')[1];
    if (rawDate) {
      fromDate = new Date(`${rawDate}T00:00:00.000Z`);
    }
  } else if (isHistorical) {
    // Por defecto en histórico: 1 de septiembre de 2026
    fromDate = new Date('2026-09-01T00:00:00.000Z');
  }

  let maxPages: number | undefined;
  const maxPagesArg = args.find((a) => a.startsWith('--max-pages='));
  if (maxPagesArg) {
    const val = parseInt(maxPagesArg.split('=')[1] ?? '', 10);
    if (!isNaN(val) && val > 0) maxPages = val;
  }

  let maxItems: number | undefined;
  const maxItemsArg = args.find((a) => a.startsWith('--max-items='));
  if (maxItemsArg) {
    const val = parseInt(maxItemsArg.split('=')[1] ?? '', 10);
    if (!isNaN(val) && val > 0) maxItems = val;
  }

  // Si no se especifica ninguna bandera explícita, ver env o usar fixture por defecto seguro
  if (!isLive && !isHistorical && !isFixture) {
    if (process.env.INGEST_SOURCE === 'live') {
      isLive = true;
    }
  }

  return {
    isLive,
    isHistorical,
    isFixture: isFixture || (!isLive && !isHistorical),
    resume,
    fromDate,
    maxPages,
    maxItems: maxItems ?? parseInt(process.env.INGEST_MAX_ITEMS ?? '50', 10),
  };
}

async function main(): Promise<void> {
  const opts = parseArgs();

  console.log('══════════════════════════════════════════════════════════════════');
  console.log('🏛️  PIPELINE DE INGESTA OFICIAL PLACSP — PLIEGO AI (CPVs 72* / 48*)');
  console.log('══════════════════════════════════════════════════════════════════');
  console.log(`Modo:               ${opts.isHistorical ? 'HISTÓRICO (rel="next")' : opts.isLive ? 'EN VIVO (Live Top)' : 'FIXTURE LOCAL'}`);
  if (opts.fromDate) {
    console.log(`Límite temporal:    ${opts.fromDate.toISOString()}`);
  }
  if (opts.maxPages) {
    console.log(`Máximo de páginas:  ${opts.maxPages}`);
  }
  if (opts.resume) {
    console.log(`Reanudación cursor: ACTIVADA`);
  }
  console.log('──────────────────────────────────────────────────────────────────');

  let totalScanned = 0;
  let totalQualified = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let pagesProcessed = 0;

  if (opts.isHistorical) {
    const jobType = 'HISTORICAL_BACKFILL';
    let startUrl = PLACSP_OFFICIAL_FEED_URL;

    if (opts.resume) {
      try {
        const syncState = await procurementService.getSyncState('ES_PLACSP', jobType);
        if (syncState?.nextPageUrl) {
          startUrl = syncState.nextPageUrl;
          console.log(`📍 Reanudando desde cursor previo: ${startUrl}`);
        } else if (syncState?.currentPageUrl) {
          startUrl = syncState.currentPageUrl;
          console.log(`📍 Reanudando desde última página: ${startUrl}`);
        }
      } catch (err) {
        console.warn('⚠️ No se pudo cargar cursor persistente previo, iniciando desde el principio:', (err as Error).message);
      }
    }

    // Inicializar estado de sincronización
    try {
      await procurementService.upsertSyncState({
        sourceCode: 'ES_PLACSP',
        jobType,
        currentPageUrl: startUrl,
        cutoffDate: opts.fromDate,
        status: 'RUNNING',
        startedAt: new Date(),
        pagesProcessed: 0,
        tendersScanned: 0,
        tendersPersisted: 0,
      });
    } catch (err) {
      console.warn('⚠️ Nota: No se pudo guardar estado inicial en BD (¿BD no disponible?):', (err as Error).message);
    }

    const crawlResult = await placspConnector.crawlFeedToCutoff({
      startUrl,
      cutoffDate: opts.fromDate,
      maxPages: opts.maxPages,
      filterTicOnly: true,
      onPageProcessed: async (page: PageResult) => {
        pagesProcessed++;
        totalScanned += page.rawCount;
        totalQualified += page.qualifiedCount;

        const oldestStr = page.oldestDate ? page.oldestDate.toISOString() : 'N/A';
        const newestStr = page.newestDate ? page.newestDate.toISOString() : 'N/A';

        console.log(`📄 [Página ${pagesProcessed}] ${page.pageUrl}`);
        console.log(`   Rango temporal: ${oldestStr}  ──>  ${newestStr}`);
        console.log(`   Escaneados: ${page.rawCount} | TIC Calificados: ${page.qualifiedCount}`);

        if (page.tenders.length > 0) {
          try {
            const batchSummary = await procurementService.ingestBatch(page.tenders);
            totalInserted += batchSummary.inserted;
            totalUpdated += batchSummary.updated;
            totalSkipped += batchSummary.skipped;

            console.log(`   Persistencia DB: +${batchSummary.inserted} nuevos | ~${batchSummary.updated} enmiendas | =${batchSummary.skipped} omitidos`);
          } catch (dbErr) {
            console.error(`   ❌ Error al persistir lote en base de datos:`, (dbErr as Error).message);
          }
        } else {
          console.log(`   Persistencia DB: 0 licitaciones TIC en esta página`);
        }

        // Actualizar cursor persistente tras cada página
        try {
          await procurementService.upsertSyncState({
            sourceCode: 'ES_PLACSP',
            jobType,
            currentPageUrl: page.pageUrl,
            nextPageUrl: page.nextUrl,
            oldestProcessedDate: page.oldestDate,
            newestProcessedDate: page.newestDate,
            cutoffDate: opts.fromDate,
            pagesProcessed,
            tendersScanned: totalScanned,
            tendersPersisted: totalInserted + totalUpdated,
            status: page.hitCutoff ? 'COMPLETED' : 'RUNNING',
            completedAt: page.hitCutoff ? new Date() : null,
          });
        } catch {
          // Registro silencioso si la BD no está disponible
        }

        if (page.hitCutoff) {
          console.log(`🛑 Límite temporal alcanzado (${opts.fromDate?.toISOString()}). Deteniendo rastreo.`);
        }
      },
    });

    try {
      await procurementService.upsertSyncState({
        sourceCode: 'ES_PLACSP',
        jobType,
        currentPageUrl: crawlResult.lastPageUrl,
        nextPageUrl: crawlResult.nextPageUrl,
        oldestProcessedDate: crawlResult.oldestProcessedDate,
        newestProcessedDate: crawlResult.newestProcessedDate,
        cutoffDate: opts.fromDate,
        pagesProcessed,
        tendersScanned: totalScanned,
        tendersPersisted: totalInserted + totalUpdated,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch {
      // Ignorar si BD no disponible
    }

  } else if (opts.isLive) {
    const jobType = 'LIVE_SYNC';
    console.log(`📡 Descargando página superior del feed oficial en vivo...`);

    const xml = await placspConnector.fetchFeedPage(PLACSP_OFFICIAL_FEED_URL);
    const pageResult = placspConnector.parseFeedPage(xml, {
      maxItems: opts.maxItems,
      filterTicOnly: true,
      cutoffDate: opts.fromDate,
    });

    pagesProcessed = 1;
    totalScanned = pageResult.rawCount;
    totalQualified = pageResult.qualifiedCount;

    console.log(`✅ ${pageResult.rawCount} licitaciones escaneadas, ${pageResult.qualifiedCount} corresponden a TIC (CPVs 72* y 48*).`);

    if (pageResult.tenders.length > 0) {
      const summary = await procurementService.ingestBatch(pageResult.tenders);
      totalInserted = summary.inserted;
      totalUpdated = summary.updated;
      totalSkipped = summary.skipped;

      console.log(`📊 Persistencia DB: +${summary.inserted} nuevos | ~${summary.updated} enmiendas | =${summary.skipped} omitidos`);
      for (const r of summary.results) {
        console.log(`   * [${r.action}] Expediente: ${r.sourceTenderId} (ID: ${r.tenderId})`);
      }
    }

    try {
      await procurementService.upsertSyncState({
        sourceCode: 'ES_PLACSP',
        jobType,
        currentPageUrl: PLACSP_OFFICIAL_FEED_URL,
        nextPageUrl: pageResult.nextUrl,
        oldestProcessedDate: pageResult.oldestDate,
        newestProcessedDate: pageResult.newestDate,
        cutoffDate: opts.fromDate,
        pagesProcessed: 1,
        tendersScanned: totalScanned,
        tendersPersisted: totalInserted + totalUpdated,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch {
      // Continuar si BD no accesible
    }

  } else {
    // Modo Fixture Local
    console.log('🧪 Procesando expedientes desde fixture local de prueba...');
    const normalized = SAMPLE_PLACSP_ENTRIES.map((e) => placspConnector.normalizeEntry(e));
    pagesProcessed = 1;
    totalScanned = normalized.length;
    totalQualified = normalized.length;

    const summary = await procurementService.ingestBatch(normalized);
    totalInserted = summary.inserted;
    totalUpdated = summary.updated;
    totalSkipped = summary.skipped;

    console.log(`📊 Persistencia DB: +${summary.inserted} nuevos | ~${summary.updated} enmiendas | =${summary.skipped} omitidos`);
    for (const r of summary.results) {
      console.log(`   * [${r.action}] Expediente: ${r.sourceTenderId} (ID: ${r.tenderId})`);
    }
  }

  console.log('──────────────────────────────────────────────────────────────────');
  console.log('📊 RESUMEN FINAL DEL PROCESAMIENTO');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(`Páginas procesadas:    ${pagesProcessed}`);
  console.log(`Expedientes evaluados: ${totalScanned}`);
  console.log(`Calificados sector TIC: ${totalQualified} (100% CPVs 72* y 48*)`);
  console.log(`Nuevos insertados:     ${totalInserted}`);
  console.log(`Enmiendas/actualiz.:   ${totalUpdated}`);
  console.log(`Omitidos (idempot.):   ${totalSkipped}`);
  console.log('══════════════════════════════════════════════════════════════════');
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error crítico en pipeline de ingesta:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await pool.end();
    } catch {
      // Pool end safety
    }
  });
