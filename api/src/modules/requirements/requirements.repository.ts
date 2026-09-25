import { and, desc, eq } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import {
  agentExecutionEvents,
  requirementCitations,
  requirementExtractions,
  requirements,
  documentContentSnapshots,
  tenderDocumentVersions,
  tenderDocuments,
  type Requirement,
  type RequirementCitation,
  type RequirementExtraction,
} from '../../db/schema.js';
import type { ExtractedRequirementInput, ListRequirementsQuery, SubmitExtractionInput } from './requirements.schema.js';

export interface VerifiedDocumentVersion {
  readonly id: string;
  readonly contentHash: string | null;
  readonly extractedTextSha256: string;
}

export interface VerifiedDocumentSnapshot extends VerifiedDocumentVersion {
  readonly extractedText: string;
}

export class RequirementsRepository {
  async verifyDocumentVersion(
    database: TenantTransaction, tenderId: string, documentVersionId: string,
  ): Promise<VerifiedDocumentVersion | undefined> {
    const rows = await database.select({
      id: tenderDocumentVersions.id,
      contentHash: tenderDocumentVersions.contentHash,
      extractedTextSha256: documentContentSnapshots.extractedTextSha256,
    }).from(tenderDocumentVersions)
      .innerJoin(tenderDocuments, eq(tenderDocumentVersions.documentId, tenderDocuments.id))
      .innerJoin(
        documentContentSnapshots,
        eq(documentContentSnapshots.documentVersionId, tenderDocumentVersions.id),
      )
      .where(and(eq(tenderDocumentVersions.id, documentVersionId), eq(tenderDocuments.tenderId, tenderId)))
      .limit(1);
    return rows[0];
  }

  async getDocumentSnapshot(
    database: TenantTransaction, tenderId: string, documentVersionId: string,
  ): Promise<VerifiedDocumentSnapshot | undefined> {
    const rows = await database.select({
      id: tenderDocumentVersions.id,
      contentHash: tenderDocumentVersions.contentHash,
      extractedTextSha256: documentContentSnapshots.extractedTextSha256,
      extractedText: documentContentSnapshots.extractedText,
    }).from(tenderDocumentVersions)
      .innerJoin(tenderDocuments, eq(tenderDocumentVersions.documentId, tenderDocuments.id))
      .innerJoin(documentContentSnapshots, eq(documentContentSnapshots.documentVersionId, tenderDocumentVersions.id))
      .where(and(eq(tenderDocumentVersions.id, documentVersionId), eq(tenderDocuments.tenderId, tenderId)))
      .limit(1);
    return rows[0];
  }

  async findExtractionByIdempotency(
    database: TenantTransaction, tenantId: string, idempotencyKey: string,
  ): Promise<RequirementExtraction | undefined> {
    const rows = await database.select().from(requirementExtractions)
      .where(and(
        eq(requirementExtractions.tenantId, tenantId),
        eq(requirementExtractions.idempotencyKey, idempotencyKey),
      )).limit(1);
    return rows[0];
  }

  async createExtraction(
    database: TenantTransaction,
    params: {
      readonly tenantId: string;
      readonly input: SubmitExtractionInput;
      readonly inputHash: string;
      readonly outputHash: string;
    },
  ): Promise<RequirementExtraction> {
    const rows = await database.insert(requirementExtractions).values({
      tenantId: params.tenantId,
      idempotencyKey: params.input.idempotencyKey,
      tenderId: params.input.tenderId,
      documentVersionId: params.input.documentVersionId,
      agentName: params.input.agent.name,
      model: params.input.agent.model,
      promptVersion: params.input.agent.promptVersion,
      toolVersion: params.input.agent.toolVersion,
      inputHash: params.inputHash,
      outputHash: params.outputHash,
      durationMs: params.input.agent.durationMs,
      costMicrounits: params.input.agent.costMicrounits,
    }).returning();
    const extraction = rows[0];
    if (!extraction) throw new Error('No se pudo registrar la extracción documental');
    return extraction;
  }

  async createRequirements(
    database: TenantTransaction,
    tenantId: string,
    extraction: RequirementExtraction,
    items: readonly ExtractedRequirementInput[],
  ): Promise<void> {
    for (const item of items) {
      const rows = await database.insert(requirements).values({
        tenantId,
        extractionId: extraction.id,
        tenderId: extraction.tenderId,
        documentVersionId: extraction.documentVersionId,
        category: item.category,
        requirementType: item.requirementType,
        sourceStatus: item.sourceStatus,
        reviewStatus: item.sourceStatus === 'NOT_VERIFIABLE' ? 'NEEDS_REVIEW' : 'EXTRACTED',
        summary: item.summary,
        extractedText: item.extractedText,
        confidence: item.confidence,
      }).returning({ id: requirements.id });
      const requirement = rows[0];
      if (!requirement) throw new Error('No se pudo guardar un requisito extraído');

      if (item.citations.length > 0) {
        await database.insert(requirementCitations).values(item.citations.map((citation) => ({
          tenantId,
          requirementId: requirement.id,
          documentVersionId: extraction.documentVersionId,
          pageNumber: citation.pageNumber,
          sectionReference: citation.sectionReference,
          startOffset: citation.startOffset,
          endOffset: citation.endOffset,
          quotedText: citation.quotedText,
          verificationStatus: 'PENDING_REVIEW',
        })));
      }
    }

    await database.insert(agentExecutionEvents).values({
      tenantId,
      executionId: extraction.id,
      correlationId: extraction.id,
      agentName: extraction.agentName,
      eventType: 'completed',
      model: extraction.model,
      promptVersion: extraction.promptVersion,
      toolVersion: extraction.toolVersion,
      inputHash: extraction.inputHash,
      outputHash: extraction.outputHash,
      durationMs: extraction.durationMs,
      costMicrounits: extraction.costMicrounits,
    });
  }

  async listRequirements(
    database: TenantTransaction, tenantId: string, query: ListRequirementsQuery,
  ): Promise<Requirement[]> {
    const conditions = [eq(requirements.tenantId, tenantId)];
    if (query.tenderId) conditions.push(eq(requirements.tenderId, query.tenderId));
    return database.select().from(requirements).where(and(...conditions))
      .orderBy(desc(requirements.createdAt)).limit(query.limit).offset(query.offset);
  }

  async findRequirement(
    database: TenantTransaction, tenantId: string, id: string,
  ): Promise<{ requirement: Requirement; citations: RequirementCitation[] } | undefined> {
    const rows = await database.select().from(requirements)
      .where(and(eq(requirements.id, id), eq(requirements.tenantId, tenantId))).limit(1);
    const requirement = rows[0];
    if (!requirement) return undefined;
    const citations = await database.select().from(requirementCitations)
      .where(and(eq(requirementCitations.requirementId, id), eq(requirementCitations.tenantId, tenantId)))
      .orderBy(requirementCitations.createdAt);
    return { requirement, citations };
  }
}

export const requirementsRepository = new RequirementsRepository();
