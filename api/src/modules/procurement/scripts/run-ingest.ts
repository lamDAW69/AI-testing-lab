import { procurementService } from '../procurement.service.js';
import { placspConnector, RawPlacspEntry } from '../connectors/placsp.connector.js';
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

async function main(): Promise<void> {
  const isLive = process.argv.includes('--live') || process.env.INGEST_SOURCE === 'live';
  console.log(`🔄 Iniciando ingesta oficial desde PLACSP (${isLive ? 'FEED REAL EN VIVO' : 'FIXTURE LOCAL'})...`);

  let tendersToIngest;
  if (isLive) {
    const maxItems = parseInt(process.env.INGEST_MAX_ITEMS ?? '20', 10);
    console.log(`📡 Descargando hasta ${maxItems} licitaciones del feed oficial de PLACSP...`);
    tendersToIngest = await placspConnector.fetchRealFeed(maxItems);
    console.log(`✅ ${tendersToIngest.length} licitaciones extraídas y normalizadas del feed oficial.`);
  } else {
    tendersToIngest = SAMPLE_PLACSP_ENTRIES.map((entry) => placspConnector.normalizeEntry(entry));
  }

  const summary = await procurementService.ingestBatch(tendersToIngest);

  console.log('📊 Resumen del job de ingesta:');
  console.log(`   - Total procesados: ${summary.total}`);
  console.log(`   - Nuevos insertados: ${summary.inserted}`);
  console.log(`   - Modificados/enmiendas: ${summary.updated}`);
  console.log(`   - Omitidos (sin cambios): ${summary.skipped}`);

  for (const r of summary.results) {
    console.log(`   * [${r.action}] Expediente: ${r.sourceTenderId} (ID: ${r.tenderId})`);
  }
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error crítico en job de ingesta:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
