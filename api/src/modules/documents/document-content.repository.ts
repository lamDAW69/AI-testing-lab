import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  documentContentSnapshots,
  procurementSources,
  tenderDocumentVersions,
  tenderDocuments,
  tenders,
  type DocumentContentSnapshot,
} from '../../db/schema.js';

export interface DocumentVersionSource {
  readonly documentVersionId: string;
  readonly url: string;
  readonly sourceBaseUrl: string;
}

export class DocumentContentRepository {
  async findVersionSource(documentVersionId: string): Promise<DocumentVersionSource | undefined> {
    const rows = await db.select({
      documentVersionId: tenderDocumentVersions.id,
      url: tenderDocumentVersions.url,
      sourceBaseUrl: procurementSources.baseUrl,
    }).from(tenderDocumentVersions)
      .innerJoin(tenderDocuments, eq(tenderDocumentVersions.documentId, tenderDocuments.id))
      .innerJoin(tenders, eq(tenderDocuments.tenderId, tenders.id))
      .innerJoin(procurementSources, eq(tenders.sourceId, procurementSources.id))
      .where(eq(tenderDocumentVersions.id, documentVersionId))
      .limit(1);
    return rows[0];
  }

  async findSnapshot(documentVersionId: string): Promise<DocumentContentSnapshot | undefined> {
    const rows = await db.select().from(documentContentSnapshots)
      .where(eq(documentContentSnapshots.documentVersionId, documentVersionId)).limit(1);
    return rows[0];
  }

  async createSnapshot(input: {
    readonly documentVersionId: string;
    readonly rawStoragePath: string;
    readonly rawSha256: string;
    readonly rawByteSize: number;
    readonly extractedText: string;
    readonly extractedTextSha256: string;
    readonly extractionEngine: string;
  }): Promise<DocumentContentSnapshot> {
    const inserted = await db.insert(documentContentSnapshots).values(input)
      .onConflictDoNothing().returning();
    if (inserted[0]) return inserted[0];

    const concurrent = await this.findSnapshot(input.documentVersionId);
    if (!concurrent) throw new Error('No se pudo persistir el snapshot documental');
    return concurrent;
  }
}

export const documentContentRepository = new DocumentContentRepository();
