import { and, desc, eq, gte, ilike, lte, sql, count } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  procurementSources,
  contractingAuthorities,
  tenders,
  tenderLots,
  tenderDocuments,
  tenderDocumentVersions,
  tenderEvents,
  Tender,
  ContractingAuthority,
  ProcurementSource,
} from '../../db/schema.js';
import { PlacspTenderInput, TenderQueryFilter } from './procurement.schema.js';

export interface IngestResult {
  readonly action: 'INSERTED' | 'UPDATED' | 'SKIPPED';
  readonly tenderId: string;
  readonly sourceTenderId: string;
}

export class ProcurementRepository {
  /**
   * Garantiza que la fuente oficial (ej. ES_PLACSP) exista en el catálogo global.
   */
  async ensureSource(code: string, name: string, baseUrl: string): Promise<ProcurementSource> {
    const existing = await db
      .select()
      .from(procurementSources)
      .where(eq(procurementSources.code, code))
      .limit(1);

    if (existing[0]) {
      return existing[0];
    }

    const inserted = await db
      .insert(procurementSources)
      .values({
        code,
        name,
        baseUrl,
        jurisdiction: 'ES',
        isActive: true,
      })
      .returning();

    const created = inserted[0];
    if (!created) {
      throw new Error(`No se pudo crear la fuente de contratación ${code}`);
    }
    return created;
  }

  /**
   * Registra u obtiene el órgano de contratación asociado al expediente.
   */
  async ensureAuthority(sourceId: string, authorityData: PlacspTenderInput['authority']): Promise<ContractingAuthority> {
    if (authorityData.taxId) {
      const existingByTax = await db
        .select()
        .from(contractingAuthorities)
        .where(
          and(
            eq(contractingAuthorities.sourceId, sourceId),
            eq(contractingAuthorities.taxId, authorityData.taxId),
          ),
        )
        .limit(1);

      if (existingByTax[0]) {
        return existingByTax[0];
      }
    }

    const existingByName = await db
      .select()
      .from(contractingAuthorities)
      .where(
        and(
          eq(contractingAuthorities.sourceId, sourceId),
          eq(contractingAuthorities.name, authorityData.name),
        ),
      )
      .limit(1);

    if (existingByName[0]) {
      return existingByName[0];
    }

    const inserted = await db
      .insert(contractingAuthorities)
      .values({
        sourceId,
        sourceAuthorityId: authorityData.sourceAuthorityId,
        name: authorityData.name,
        taxId: authorityData.taxId,
        buyerType: authorityData.buyerType,
        postalCode: authorityData.postalCode,
        city: authorityData.city,
      })
      .returning();

    const created = inserted[0];
    if (!created) {
      throw new Error(`No se pudo registrar la autoridad de contratación: ${authorityData.name}`);
    }
    return created;
  }

  /**
   * Ingesta de forma 100% idempotente un expediente de licitación.
   * Si ya existe con el mismo hash de contenido: no hace nada (SKIPPED).
   * Si es nuevo: inserta expediente, lotes, documentos y versiones iniciales (INSERTED).
   * Si ha cambiado: actualiza expediente, crea nuevas versiones inmutables y registra enmienda (UPDATED).
   */
  async ingestTender(
    sourceId: string,
    authorityId: string,
    input: PlacspTenderInput,
    payloadHash: string,
  ): Promise<IngestResult> {
    return db.transaction(async (tx) => {
      // 1. Comprobar si el expediente ya existe
      const existingRows = await tx
        .select()
        .from(tenders)
        .where(
          and(
            eq(tenders.sourceId, sourceId),
            eq(tenders.sourceTenderId, input.sourceTenderId),
          ),
        )
        .limit(1);

      const existing = existingRows[0];

      // Caso A: Expediente idéntico sin cambios (Idempotencia absoluta)
      if (existing && existing.rawPayloadHash === payloadHash) {
        return {
          action: 'SKIPPED',
          tenderId: existing.id,
          sourceTenderId: existing.sourceTenderId,
        };
      }

      // Caso B: Expediente existente con modificaciones (Enmienda / Cambio de estado)
      if (existing) {
        await tx
          .update(tenders)
          .set({
            title: input.title,
            description: input.description,
            status: input.status,
            procedureType: input.procedureType,
            contractType: input.contractType,
            estimatedValueCents: input.estimatedValueCents,
            budgetAmountCents: input.budgetAmountCents,
            taxInclusiveAmountCents: input.taxInclusiveAmountCents,
            mainCpvCode: input.mainCpvCode,
            additionalCpvCodes: input.additionalCpvCodes,
            submissionDeadline: input.submissionDeadline ? new Date(input.submissionDeadline) : null,
            awardDate: input.awardDate ? new Date(input.awardDate) : null,
            rawPayloadHash: payloadHash,
            updatedAt: new Date(),
          })
          .where(eq(tenders.id, existing.id));

        // Registrar evento de enmienda / actualización
        await tx.insert(tenderEvents).values({
          tenderId: existing.id,
          eventType: 'AMENDMENT',
          eventDate: new Date(),
          title: `Modificación o enmienda de expediente ${existing.sourceTenderId}`,
          description: `Nuevo hash de contenido registrado: ${payloadHash.slice(0, 16)}...`,
          rawPayload: { previousHash: existing.rawPayloadHash, newHash: payloadHash },
        });

        // Versionado inmutable de documentos: no sobrescribir nunca
        for (const doc of input.documents) {
          const existingDocs = await tx
            .select()
            .from(tenderDocuments)
            .where(
              and(
                eq(tenderDocuments.tenderId, existing.id),
                eq(tenderDocuments.name, doc.name),
              ),
            )
            .limit(1);

          let docId: string;
          if (existingDocs[0]) {
            docId = existingDocs[0].id;
          } else {
            const newDoc = await tx
              .insert(tenderDocuments)
              .values({
                tenderId: existing.id,
                documentType: doc.documentType,
                name: doc.name,
                sourceDocumentId: doc.sourceDocumentId,
              })
              .returning();
            docId = newDoc[0]!.id;
          }

          // Consultar la versión máxima existente
          const versionRows = await tx
            .select({
              maxVersion: sql<number>`COALESCE(MAX(${tenderDocumentVersions.versionNumber}), 0)`,
            })
            .from(tenderDocumentVersions)
            .where(eq(tenderDocumentVersions.documentId, docId));

          const currentVersion = Number(versionRows[0]?.maxVersion ?? 0);

          // Comprobar si el hash de la última versión coincide
          const latestVersionRows = await tx
            .select()
            .from(tenderDocumentVersions)
            .where(
              and(
                eq(tenderDocumentVersions.documentId, docId),
                eq(tenderDocumentVersions.versionNumber, currentVersion),
              ),
            )
            .limit(1);

          if (!latestVersionRows[0] || latestVersionRows[0].contentHash !== doc.contentHash) {
            await tx.insert(tenderDocumentVersions).values({
              documentId: docId,
              versionNumber: currentVersion + 1,
              url: doc.url,
              contentHash: doc.contentHash,
              mimeType: doc.mimeType,
              byteSize: doc.byteSize,
            });
          }
        }

        return {
          action: 'UPDATED',
          tenderId: existing.id,
          sourceTenderId: existing.sourceTenderId,
        };
      }

      // Caso C: Nuevo expediente
      const insertedTenders = await tx
        .insert(tenders)
        .values({
          sourceId,
          authorityId,
          sourceTenderId: input.sourceTenderId,
          title: input.title,
          description: input.description,
          status: input.status,
          procedureType: input.procedureType,
          contractType: input.contractType,
          estimatedValueCents: input.estimatedValueCents,
          budgetAmountCents: input.budgetAmountCents,
          taxInclusiveAmountCents: input.taxInclusiveAmountCents,
          currency: input.currency,
          mainCpvCode: input.mainCpvCode,
          additionalCpvCodes: input.additionalCpvCodes,
          submissionDeadline: input.submissionDeadline ? new Date(input.submissionDeadline) : null,
          awardDate: input.awardDate ? new Date(input.awardDate) : null,
          rawPayloadHash: payloadHash,
        })
        .returning();

      const newTender = insertedTenders[0]!;

      // Insertar lotes
      for (const lot of input.lots) {
        await tx.insert(tenderLots).values({
          tenderId: newTender.id,
          lotNumber: lot.lotNumber,
          title: lot.title,
          description: lot.description,
          budgetAmountCents: lot.budgetAmountCents,
          mainCpvCode: lot.mainCpvCode,
          status: lot.status,
        });
      }

      // Insertar documentos con su versión física inicial (versionNumber = 1)
      for (const doc of input.documents) {
        const insertedDoc = await tx
          .insert(tenderDocuments)
          .values({
            tenderId: newTender.id,
            documentType: doc.documentType,
            name: doc.name,
            sourceDocumentId: doc.sourceDocumentId,
          })
          .returning();

        const docRecord = insertedDoc[0]!;

        await tx.insert(tenderDocumentVersions).values({
          documentId: docRecord.id,
          versionNumber: 1,
          url: doc.url,
          contentHash: doc.contentHash,
          mimeType: doc.mimeType,
          byteSize: doc.byteSize,
        });
      }

      // Insertar eventos
      for (const ev of input.events) {
        await tx.insert(tenderEvents).values({
          tenderId: newTender.id,
          eventType: ev.eventType,
          eventDate: new Date(ev.eventDate),
          title: ev.title,
          description: ev.description,
          rawPayload: ev.rawPayload,
        });
      }

      return {
        action: 'INSERTED',
        tenderId: newTender.id,
        sourceTenderId: newTender.sourceTenderId,
      };
    });
  }

  /**
   * Catálogo con filtros deterministas, paginación e índices seguros.
   */
  async listTenders(filters: TenderQueryFilter): Promise<{
    readonly data: readonly Tender[];
    readonly pagination: {
      readonly total: number;
      readonly page: number;
      readonly limit: number;
      readonly totalPages: number;
    };
  }> {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(tenders.status, filters.status));
    }
    if (filters.contractType) {
      conditions.push(eq(tenders.contractType, filters.contractType));
    }
    if (filters.procedureType) {
      conditions.push(eq(tenders.procedureType, filters.procedureType));
    }
    if (filters.cpv) {
      // Coincidencia por prefijo (ej: '72' captura todas las categorías de software)
      conditions.push(sql`${tenders.mainCpvCode} LIKE ${filters.cpv + '%'}`);
    }
    if (filters.minBudget !== undefined) {
      conditions.push(gte(tenders.budgetAmountCents, filters.minBudget));
    }
    if (filters.maxBudget !== undefined) {
      conditions.push(lte(tenders.budgetAmountCents, filters.maxBudget));
    }
    if (filters.deadlineFrom) {
      conditions.push(gte(tenders.submissionDeadline, new Date(filters.deadlineFrom)));
    }
    if (filters.deadlineTo) {
      conditions.push(lte(tenders.submissionDeadline, new Date(filters.deadlineTo)));
    }
    if (filters.search) {
      conditions.push(ilike(tenders.title, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (filters.page - 1) * filters.limit;

    const [totalRows, rows] = await Promise.all([
      db
        .select({ count: count() })
        .from(tenders)
        .where(whereClause),
      db
        .select()
        .from(tenders)
        .where(whereClause)
        .orderBy(desc(tenders.submissionDeadline), desc(tenders.createdAt))
        .limit(filters.limit)
        .offset(offset),
    ]);

    const total = Number(totalRows[0]?.count ?? 0);
    const totalPages = Math.ceil(total / filters.limit);

    return {
      data: rows,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages,
      },
    };
  }

  /**
   * Obtiene el detalle completo de un expediente con sus lotes, documentos, versiones y eventos.
   */
  async getTenderById(tenderId: string) {
    const tenderRows = await db
      .select({
        tender: tenders,
        authority: contractingAuthorities,
        source: procurementSources,
      })
      .from(tenders)
      .innerJoin(contractingAuthorities, eq(tenders.authorityId, contractingAuthorities.id))
      .innerJoin(procurementSources, eq(tenders.sourceId, procurementSources.id))
      .where(eq(tenders.id, tenderId))
      .limit(1);

    const mainRecord = tenderRows[0];
    if (!mainRecord) {
      return null;
    }

    const [lots, docsWithVersions, events] = await Promise.all([
      db
        .select()
        .from(tenderLots)
        .where(eq(tenderLots.tenderId, tenderId))
        .orderBy(tenderLots.lotNumber),
      db
        .select({
          doc: tenderDocuments,
          version: tenderDocumentVersions,
        })
        .from(tenderDocuments)
        .innerJoin(
          tenderDocumentVersions,
          eq(tenderDocuments.id, tenderDocumentVersions.documentId),
        )
        .where(eq(tenderDocuments.tenderId, tenderId))
        .orderBy(tenderDocuments.name, desc(tenderDocumentVersions.versionNumber)),
      db
        .select()
        .from(tenderEvents)
        .where(eq(tenderEvents.tenderId, tenderId))
        .orderBy(desc(tenderEvents.eventDate)),
    ]);

    // Agrupar documentos con sus versiones ordenadas
    const documentsMap = new Map<string, {
      readonly id: string;
      readonly documentType: string;
      readonly name: string;
      readonly sourceDocumentId: string | null;
      readonly versions: {
        readonly versionNumber: number;
        readonly url: string;
        readonly contentHash: string | null;
        readonly mimeType: string | null;
        readonly byteSize: number | null;
        readonly fetchedAt: Date;
      }[];
    }>();

    for (const row of docsWithVersions) {
      if (!documentsMap.has(row.doc.id)) {
        documentsMap.set(row.doc.id, {
          id: row.doc.id,
          documentType: row.doc.documentType,
          name: row.doc.name,
          sourceDocumentId: row.doc.sourceDocumentId,
          versions: [],
        });
      }
      documentsMap.get(row.doc.id)!.versions.push({
        versionNumber: row.version.versionNumber,
        url: row.version.url,
        contentHash: row.version.contentHash,
        mimeType: row.version.mimeType,
        byteSize: row.version.byteSize,
        fetchedAt: row.version.fetchedAt,
      });
    }

    return {
      ...mainRecord.tender,
      authority: mainRecord.authority,
      source: mainRecord.source,
      lots,
      documents: Array.from(documentsMap.values()),
      events,
    };
  }

  /**
   * Lista las fuentes oficiales activas en el sistema.
   */
  async listSources(): Promise<readonly ProcurementSource[]> {
    return db
      .select()
      .from(procurementSources)
      .where(eq(procurementSources.isActive, true));
  }
}

export const procurementRepository = new ProcurementRepository();
