import crypto from 'node:crypto';
import type { TenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { ListRequirementsQuery, SubmitExtractionInput } from './requirements.schema.js';
import { RequirementsRepository, requirementsRepository } from './requirements.repository.js';

function hash(value: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export class RequirementsService {
  constructor(private readonly repository: RequirementsRepository = requirementsRepository) {}

  async submitExtraction(
    database: TenantTransaction, tenantId: string, input: SubmitExtractionInput,
  ) {
    const existing = await this.repository.findExtractionByIdempotency(database, tenantId, input.idempotencyKey);
    if (existing) {
      return { extraction: existing, idempotent: true };
    }

    const documentVersion = await this.repository.verifyDocumentVersion(
      database, input.tenderId, input.documentVersionId,
    );
    if (!documentVersion) {
      // No revela si el documento o el expediente existen fuera del contexto solicitado.
      throw new AppError(404, 'La versión documental solicitada no pertenece al expediente');
    }

    const extraction = await this.repository.createExtraction(database, {
      tenantId,
      input,
      // La entrada se ata al snapshot inmutable realmente analizado; nunca al
      // texto que el agente afirme haber visto en su salida.
      inputHash: hash({
        documentVersionId: documentVersion.id,
        contentHash: documentVersion.contentHash,
        extractedTextSha256: documentVersion.extractedTextSha256,
      }),
      outputHash: hash(input.requirements),
    });
    await this.repository.createRequirements(database, tenantId, extraction, input.requirements);
    return { extraction, idempotent: false };
  }

  listRequirements(database: TenantTransaction, tenantId: string, query: ListRequirementsQuery) {
    return this.repository.listRequirements(database, tenantId, query);
  }

  async getRequirement(database: TenantTransaction, tenantId: string, id: string) {
    const record = await this.repository.findRequirement(database, tenantId, id);
    if (!record) throw new AppError(404, 'El requisito solicitado no existe');
    return record;
  }
}

export const requirementsService = new RequirementsService();
