import crypto from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { PlacspTenderInput, PlacspTenderInputSchema } from '../procurement.schema.js';

export const PLACSP_OFFICIAL_FEED_URL =
  'https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom';

export interface RawPlacspDocument {
  readonly type: 'PCAP' | 'PPT' | 'NOTICE' | 'AWARD_NOTICE' | 'OTHER';
  readonly name: string;
  readonly url: string;
  readonly contentHash?: string;
  readonly mimeType?: string;
}

export interface RawPlacspEntry {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
  readonly status?: string;
  readonly procedureType?: string;
  readonly contractType?: string;
  readonly budgetAmountEur: number;
  readonly taxInclusiveAmountEur?: number;
  readonly estimatedValueEur?: number;
  readonly cpvCode: string;
  readonly additionalCpvCodes?: readonly string[];
  readonly submissionDeadline?: string;
  readonly authority: {
    readonly name: string;
    readonly taxId?: string;
    readonly sourceAuthorityId?: string;
    readonly buyerType?: 'central' | 'regional' | 'local' | 'public_entity' | 'other';
    readonly postalCode?: string;
    readonly city?: string;
  };
  readonly lots?: readonly {
    readonly lotNumber: number;
    readonly title: string;
    readonly description?: string;
    readonly budgetAmountEur?: number;
    readonly cpvCode?: string;
  }[];
  readonly documents?: readonly RawPlacspDocument[];
}

function extractXmlText(node: unknown): string {
  if (typeof node === 'string') return node.trim();
  if (typeof node === 'number') return String(node);
  if (node && typeof node === 'object' && '#text' in node) {
    return String((node as Record<string, unknown>)['#text']).trim();
  }
  return '';
}

export class PlacspConnector {
  readonly sourceCode = 'ES_PLACSP';

  /**
   * Calcula el hash SHA-256 canónico del contenido sustantivo del expediente.
   * Si cambia el presupuesto, el plazo, los lotes o los documentos, el hash
   * resultante cambiará inmediatamente, disparando un evento AMENDMENT.
   */
  computePayloadHash(tender: PlacspTenderInput): string {
    const payloadForHashing = {
      sourceTenderId: tender.sourceTenderId,
      title: tender.title,
      description: tender.description ?? '',
      status: tender.status,
      procedureType: tender.procedureType,
      contractType: tender.contractType,
      budgetAmountCents: tender.budgetAmountCents,
      mainCpvCode: tender.mainCpvCode,
      submissionDeadline: tender.submissionDeadline ?? '',
      lots: tender.lots.map((l) => ({ lotNumber: l.lotNumber, budget: l.budgetAmountCents ?? 0 })),
      documents: tender.documents.map((d) => ({ type: d.documentType, url: d.url, hash: d.contentHash ?? '' })),
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(payloadForHashing))
      .digest('hex');
  }

  /**
   * Normaliza una entrada cruda oficial convirtiendo importes en euros a céntimos
   * enteros y aplicando las reglas estrictas de validación.
   */
  normalizeEntry(raw: RawPlacspEntry): PlacspTenderInput {
    const normalized: PlacspTenderInput = {
      sourceCode: this.sourceCode,
      sourceTenderId: raw.id,
      title: raw.title,
      description: raw.summary,
      status: this.mapStatus(raw.status),
      procedureType: this.mapProcedure(raw.procedureType),
      contractType: this.mapContractType(raw.contractType),
      budgetAmountCents: Math.round(raw.budgetAmountEur * 100),
      taxInclusiveAmountCents: raw.taxInclusiveAmountEur !== undefined
        ? Math.round(raw.taxInclusiveAmountEur * 100)
        : undefined,
      estimatedValueCents: raw.estimatedValueEur !== undefined
        ? Math.round(raw.estimatedValueEur * 100)
        : undefined,
      currency: 'EUR',
      mainCpvCode: this.normalizeCpv(raw.cpvCode),
      additionalCpvCodes: (raw.additionalCpvCodes ?? []).map((cpv) => this.normalizeCpv(cpv)),
      submissionDeadline: raw.submissionDeadline,
      authority: {
        name: raw.authority.name,
        taxId: raw.authority.taxId,
        sourceAuthorityId: raw.authority.sourceAuthorityId,
        buyerType: raw.authority.buyerType ?? 'other',
        postalCode: raw.authority.postalCode,
        city: raw.authority.city,
      },
      lots: (raw.lots ?? []).map((lot) => ({
        lotNumber: lot.lotNumber,
        title: lot.title,
        description: lot.description,
        budgetAmountCents: lot.budgetAmountEur !== undefined ? Math.round(lot.budgetAmountEur * 100) : undefined,
        mainCpvCode: lot.cpvCode ? this.normalizeCpv(lot.cpvCode) : undefined,
      })),
      documents: (raw.documents ?? []).map((doc) => ({
        documentType: doc.type,
        name: doc.name,
        url: doc.url,
        contentHash: doc.contentHash ?? crypto.createHash('sha256').update(doc.url).digest('hex'),
        mimeType: doc.mimeType ?? 'application/pdf',
      })),
      events: [
        {
          eventType: 'PUBLICATION',
          eventDate: new Date().toISOString(),
          title: `Publicación oficial de licitación ${raw.id} en PLACSP`,
          rawPayload: {},
        },
      ],
    };

    return PlacspTenderInputSchema.parse(normalized);
  }

  private mapStatus(status?: string): PlacspTenderInput['status'] {
    if (!status) return 'PUBLISHED';
    const s = extractXmlText(status).toUpperCase();
    if (s.includes('ADJUDICAD') || s.includes('AWARD')) return 'AWARDED';
    if (s.includes('EVALUAC') || s.includes('VALORAC')) return 'EVALUATION';
    if (s.includes('RESUELT') || s.includes('FORMALIZ')) return 'RESOLVED';
    if (s.includes('ANULAD') || s.includes('CANCEL') || s.includes('DESIERTO')) return 'CANCELLED';
    return 'PUBLISHED';
  }

  private mapProcedure(proc?: string): PlacspTenderInput['procedureType'] {
    if (!proc) return 'OPEN';
    const p = extractXmlText(proc).toUpperCase();
    if (p.includes('RESTRINGID')) return 'RESTRICTED';
    if (p.includes('NEGOCIAD')) return 'NEGOTIATED_WITHOUT_ADVERTISING';
    if (p.includes('SIMPLIFICAD')) return 'SIMPLIFIED_OPEN';
    return 'OPEN';
  }

  private mapContractType(type?: string): PlacspTenderInput['contractType'] {
    if (!type) return 'SERVICES';
    const t = extractXmlText(type).toUpperCase();
    if (t.includes('SUMINISTRO') || t.includes('SUPPL') || t === '1') return 'SUPPLIES';
    if (t.includes('OBRA') || t.includes('WORK') || t === '3') return 'WORKS';
    return 'SERVICES';
  }

  private normalizeCpv(cpv: string): string {
    const digits = extractXmlText(cpv).replace(/\D/g, '');
    return digits.slice(0, 8).padEnd(8, '0');
  }

  /**
   * Parsea el XML de un feed ATOM oficial de la PLACSP, extrayendo las licitaciones
   * y mapeando los nodos CODICE a estructuras normalizadas y validadas.
   */
  parseFeedXml(xmlContent: string, maxItems = 50): PlacspTenderInput[] {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      trimValues: true,
      parseTagValue: false,
    });

    const parsed = parser.parse(xmlContent);
    const feed = parsed?.feed;
    if (!feed || !feed.entry) {
      return [];
    }

    const rawEntries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    const results: PlacspTenderInput[] = [];

    for (const entry of rawEntries.slice(0, maxItems)) {
      try {
        const folder = entry['cac-place-ext:ContractFolderStatus'];
        if (!folder) continue;

        const folderId: string = extractXmlText(folder['cbc:ContractFolderID']) || extractXmlText(entry.id) || 'UNKNOWN';
        const project = folder['cac:ProcurementProject'];
        const title: string = extractXmlText(project?.['cbc:Name']) || extractXmlText(entry.title) || 'Licitación pública';
        const summary: string = extractXmlText(entry.summary) || extractXmlText(project?.['cbc:Name']);

        // Importes
        const budgetNode = project?.['cac:BudgetAmount'];
        const budgetStr = extractXmlText(budgetNode?.['cbc:TaxExclusiveAmount'] ?? budgetNode?.['cbc:TotalAmount'] ?? '0');
        const totalStr = extractXmlText(budgetNode?.['cbc:TotalAmount']);
        const estStr = extractXmlText(budgetNode?.['cbc:EstimatedOverallContractAmount']);

        const budgetEur = parseFloat(budgetStr || '0');
        const totalEur = totalStr ? parseFloat(totalStr) : undefined;
        const estEur = estStr ? parseFloat(estStr) : undefined;

        // CPV
        const cpvCode = extractXmlText(project?.['cac:RequiredCommodityClassification']?.['cbc:ItemClassificationCode']) || '72000000';

        // Autoridad
        const locatedParty = folder['cac-place-ext:LocatedContractingParty'];
        const party = locatedParty?.['cac:Party'];
        const authorityName = extractXmlText(party?.['cac:PartyName']?.['cbc:Name']) ||
          extractXmlText(locatedParty?.['cac:Party']?.['cac:Contact']?.['cbc:Name']) ||
          'Órgano de Contratación';

        let taxId: string | undefined;
        let sourceAuthorityId: string | undefined;
        const identifications = party?.['cac:PartyIdentification'];
        if (identifications) {
          const idList = Array.isArray(identifications) ? identifications : [identifications];
          for (const ident of idList) {
            const idNode = ident?.['cbc:ID'];
            const scheme = (typeof idNode === 'object' ? idNode?.['@_schemeName'] : ident?.['@_schemeName']) ?? '';
            const rawId = typeof idNode === 'object' ? idNode?.['#text'] : idNode;
            const idVal = extractXmlText(rawId);
            if (idVal) {
              if (scheme.toUpperCase() === 'NIF' || (!taxId && /^[A-Z0-9]{8,9}$/i.test(idVal))) {
                taxId = idVal;
              } else if (scheme.toUpperCase() === 'DIR3') {
                sourceAuthorityId = idVal;
              }
            }
          }
        }

        const postalCode = extractXmlText(party?.['cac:PostalAddress']?.['cbc:PostalZone']) || undefined;
        const city = extractXmlText(party?.['cac:PostalAddress']?.['cbc:CityName']) || undefined;

        // Plazo
        const deadlinePeriod = folder['cac:TenderingProcess']?.['cac:TenderSubmissionDeadlinePeriod'];
        let submissionDeadline: string | undefined;
        const endDate = extractXmlText(deadlinePeriod?.['cbc:EndDate']);
        if (endDate) {
          const endTime = extractXmlText(deadlinePeriod?.['cbc:EndTime']) || '23:59:59';
          try {
            submissionDeadline = new Date(`${endDate}T${endTime}Z`).toISOString();
          } catch {
            submissionDeadline = undefined;
          }
        }

        // Documentos rectores (PCAP, PPT, etc.)
        const documents: RawPlacspDocument[] = [];

        const extractDoc = (docRef: any, type: 'PCAP' | 'PPT' | 'OTHER') => {
          if (!docRef) return;
          const refs = Array.isArray(docRef) ? docRef : [docRef];
          for (const ref of refs) {
            const uri = extractXmlText(ref?.['cac:Attachment']?.['cac:ExternalReference']?.['cbc:URI']);
            const name = extractXmlText(ref?.['cbc:ID']) || `${type} Document`;
            const docHash = extractXmlText(ref?.['cac:Attachment']?.['cac:ExternalReference']?.['cbc:DocumentHash']);
            if (uri) {
              documents.push({
                type,
                name: name.slice(0, 250),
                url: uri.replace(/&amp;/g, '&'),
                contentHash: docHash ? crypto.createHash('sha256').update(docHash).digest('hex') : undefined,
                mimeType: 'application/pdf',
              });
            }
          }
        };

        extractDoc(folder['cac:LegalDocumentReference'], 'PCAP');
        extractDoc(folder['cac:TechnicalDocumentReference'], 'PPT');
        extractDoc(folder['cac:AdditionalDocumentReference'], 'OTHER');

        const rawEntry: RawPlacspEntry = {
          id: folderId,
          title: title.slice(0, 500),
          summary: summary ? summary.slice(0, 1000) : undefined,
          status: extractXmlText(folder['cbc-place-ext:ContractFolderStatusCode']),
          procedureType: extractXmlText(folder['cac:TenderingProcess']?.['cbc:ProcedureCode']),
          contractType: extractXmlText(project?.['cbc:TypeCode']),
          budgetAmountEur: isNaN(budgetEur) ? 0 : budgetEur,
          taxInclusiveAmountEur: totalEur && !isNaN(totalEur) ? totalEur : undefined,
          estimatedValueEur: estEur && !isNaN(estEur) ? estEur : undefined,
          cpvCode,
          submissionDeadline,
          authority: {
            name: authorityName.slice(0, 255),
            taxId,
            sourceAuthorityId,
            postalCode,
            city,
          },
          documents,
        };

        results.push(this.normalizeEntry(rawEntry));
      } catch (entryError) {
        console.warn('Entrada de PLACSP omitida por error de normalización:', entryError);
      }
    }

    return results;
  }

  /**
   * Descarga el feed oficial en vivo de la PLACSP y devuelve las licitaciones normalizadas.
   */
  async fetchRealFeed(maxItems = 20, feedUrl = PLACSP_OFFICIAL_FEED_URL): Promise<PlacspTenderInput[]> {
    const response = await fetch(feedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LicitaIA-Official-Ingest/1.0 (+https://pliegoai.com)',
        Accept: 'application/atom+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`La PLACSP respondió con código HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    return this.parseFeedXml(xml, maxItems);
  }
}

export const placspConnector = new PlacspConnector();

