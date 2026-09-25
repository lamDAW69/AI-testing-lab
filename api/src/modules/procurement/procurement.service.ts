import { PlacspTenderInput, TenderQueryFilter } from './procurement.schema.js';
import { procurementRepository, IngestResult } from './procurement.repository.js';
import { placspConnector } from './connectors/placsp.connector.js';

export interface IngestionBatchSummary {
  readonly total: number;
  readonly inserted: number;
  readonly updated: number;
  readonly skipped: number;
  readonly results: readonly IngestResult[];
}

export class ProcurementService {
  /**
   * Procesa un lote de expedientes oficiales de forma estrictamente idempotente.
   */
  async ingestBatch(tendersInput: readonly PlacspTenderInput[]): Promise<IngestionBatchSummary> {
    // 1. Garantizar la existencia de la fuente oficial en el catálogo
    const source = await procurementRepository.ensureSource(
      'ES_PLACSP',
      'Plataforma de Contratación del Sector Público (España)',
      'https://contrataciondelestado.es',
    );

    const results: IngestResult[] = [];
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const tenderData of tendersInput) {
      // 2. Garantizar el órgano convocante
      const authority = await procurementRepository.ensureAuthority(source.id, tenderData.authority);

      // 3. Calcular hash determinista del expediente
      const payloadHash = placspConnector.computePayloadHash(tenderData);

      // 4. Ingestar y versionar en base de datos
      const res = await procurementRepository.ingestTender(
        source.id,
        authority.id,
        tenderData,
        payloadHash,
      );

      results.push(res);

      if (res.action === 'INSERTED') inserted++;
      else if (res.action === 'UPDATED') updated++;
      else if (res.action === 'SKIPPED') skipped++;
    }

    return {
      total: tendersInput.length,
      inserted,
      updated,
      skipped,
      results,
    };
  }

  async listTenders(filters: TenderQueryFilter) {
    return procurementRepository.listTenders(filters);
  }

  async getTenderById(tenderId: string) {
    return procurementRepository.getTenderById(tenderId);
  }

  async listSources() {
    return procurementRepository.listSources();
  }
}

export const procurementService = new ProcurementService();
