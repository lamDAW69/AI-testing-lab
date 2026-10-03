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
  readonly publicationDate?: string;
  readonly sourceUpdatedAt?: string;
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

export interface ParsePageOptions {
  cutoffDate?: Date; // default: 2026-09-01T00:00:00Z
  filterTicOnly?: boolean; // default: true
  maxItems?: number;
}

export interface PageResult {
  pageUrl: string;
  nextUrl: string | null;
  rawCount: number;
  qualifiedCount: number;
  tenders: PlacspTenderInput[];
  oldestDate: Date | null;
  newestDate: Date | null;
  hitCutoff: boolean;
}

export interface CrawlOptions {
  startUrl?: string;
  cutoffDate?: Date; // default: 2026-09-01T00:00:00Z
  maxPages?: number;
  delayBetweenPagesMs?: number; // default: 600ms
  filterTicOnly?: boolean; // default: true
  onPageProcessed?: (pageResult: PageResult) => Promise<void>;
}

export interface CrawlSummary {
  pagesProcessed: number;
  totalScanned: number;
  totalQualified: number;
  oldestProcessedDate: Date | null;
  newestProcessedDate: Date | null;
  lastPageUrl: string;
  nextPageUrl: string | null;
  hitCutoff: boolean;
  abortedReason?: string;
}

export function extractCpvList(classificationNode: unknown): string[] {
  if (!classificationNode) return [];
  const nodes = Array.isArray(classificationNode) ? classificationNode : [classificationNode];
  const cpvs: string[] = [];
  for (const node of nodes) {
    const rawCode = (node as any)?.['cbc:ItemClassificationCode'];
    const text = extractXmlText(rawCode);
    if (text) {
      const clean = text.replace(/\D/g, '');
      if (clean.length >= 2) {
        cpvs.push(clean.padEnd(8, '0').slice(0, 8));
      }
    }
  }
  return cpvs;
}

export function isTicCpv(cpv?: string): boolean {
  if (!cpv || cpv === '00000000') return false;
  const clean = cpv.replace(/\D/g, '');
  return clean.startsWith('72') || clean.startsWith('48');
}

export function isTicTender(tender: PlacspTenderInput): boolean {
  if (isTicCpv(tender.mainCpvCode)) return true;
  if (tender.additionalCpvCodes?.some((c) => isTicCpv(c))) return true;
  if (tender.lots?.some((l) => isTicCpv(l.mainCpvCode))) return true;
  return false;
}

function extractXmlText(node: unknown): string {
  if (typeof node === 'string') return node.trim();
  if (typeof node === 'number') return String(node);
  if (node && typeof node === 'object' && '#text' in node) {
    return String((node as Record<string, unknown>)['#text']).trim();
  }
  return '';
}

/**
 * Convierte una fecha y hora local de licitación pública española (huso peninsular Europe/Madrid)
 * a formato ISO-8601 UTC ('Z'), respetando horario de verano (CEST, UTC+2) e invierno (CET, UTC+1).
 */
export function parseMadridDateTime(endDate: string, rawEndTime?: string): string | undefined {
  if (!endDate) return undefined;
  const time = rawEndTime?.trim() || '23:59:59';

  // Si ya contiene offset explícito (+HH:MM / -HH:MM) o indicador 'Z', parsear directamente
  if (time.includes('Z') || /[+-]\d{2}:?\d{2}$/.test(time)) {
    try {
      const d = new Date(`${endDate}T${time}`);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    } catch {
      return undefined;
    }
  }

  // Normalizar formato HH:mm a HH:mm:ss
  const cleanTime = time.length === 5 ? `${time}:00` : time;

  try {
    const probe = new Date(`${endDate}T12:00:00Z`);
    if (isNaN(probe.getTime())) return undefined;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid',
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(probe);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value; // ej: "GMT+1" o "GMT+2"

    let offset = '+01:00';
    if (tzPart) {
      const match = tzPart.match(/GMT([+-]\d+)(?::(\d+))?/);
      const rawHour = match?.[1];
      if (rawHour) {
        const sign = rawHour.startsWith('-') ? '-' : '+';
        const hours = Math.abs(parseInt(rawHour, 10)).toString().padStart(2, '0');
        const mins = (match[2] ?? '00').padStart(2, '0');
        offset = `${sign}${hours}:${mins}`;
      }
    }

    const isoWithOffset = `${endDate}T${cleanTime}${offset}`;
    const d = new Date(isoWithOffset);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    try {
      const fallback = new Date(`${endDate}T${cleanTime}Z`);
      return isNaN(fallback.getTime()) ? undefined : fallback.toISOString();
    } catch {
      return undefined;
    }
  }
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
    let publicationDate: string | undefined;
    if (raw.publicationDate) {
      const d = new Date(raw.publicationDate);
      publicationDate = !isNaN(d.getTime()) ? d.toISOString() : undefined;
    }

    let sourceUpdatedAt: string | undefined;
    if (raw.sourceUpdatedAt) {
      const d = new Date(raw.sourceUpdatedAt);
      sourceUpdatedAt = !isNaN(d.getTime()) ? d.toISOString() : undefined;
    }

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
      publicationDate,
      sourceUpdatedAt,
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
          eventDate: publicationDate ?? new Date().toISOString(),
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
   * Extrae y normaliza un nodo individual `<entry>` de XML CODICE.
   */
  extractEntryFromXmlNode(entry: any, updatedStr?: string, publishedStr?: string): PlacspTenderInput | null {
    const folder = entry['cac-place-ext:ContractFolderStatus'];
    if (!folder) return null;

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
    const projectCpvCodes = extractCpvList(project?.['cac:RequiredCommodityClassification']);

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
      submissionDeadline = parseMadridDateTime(endDate, endTime);
    }

    // Lotes del expediente (cac:ProcurementProjectLot)
    const rawLotsNode = folder['cac:ProcurementProjectLot'] ?? project?.['cac:ProcurementProjectLot'];
    const lots: Array<{
      lotNumber: number;
      title: string;
      description?: string;
      budgetAmountEur?: number;
      cpvCode?: string;
    }> = [];

    if (rawLotsNode) {
      const lotList = Array.isArray(rawLotsNode) ? rawLotsNode : [rawLotsNode];
      for (let i = 0; i < lotList.length; i++) {
        const lotNode = lotList[i];
        const lotProj = lotNode?.['cac:ProcurementProject'] ?? lotNode;
        const rawLotId = extractXmlText(lotNode?.['cbc:ID']);
        const parsedLotNum = parseInt(rawLotId, 10);
        const lotNumber = !isNaN(parsedLotNum) && parsedLotNum > 0 ? parsedLotNum : (i + 1);

        const lotTitle = extractXmlText(lotProj?.['cbc:Name']) || extractXmlText(lotNode?.['cbc:Name']) || `Lote ${lotNumber}`;
        const lotDesc = extractXmlText(lotProj?.['cbc:Description']) || extractXmlText(lotNode?.['cbc:Description']) || undefined;

        const lotBudgetNode = lotProj?.['cac:BudgetAmount'] ?? lotNode?.['cac:BudgetAmount'];
        const lotBudgetStr = extractXmlText(lotBudgetNode?.['cbc:TaxExclusiveAmount'] ?? lotBudgetNode?.['cbc:TotalAmount']);
        const lotBudget = lotBudgetStr ? parseFloat(lotBudgetStr) : undefined;

        const lotCpvNode =
          lotProj?.['cac:RequiredCommodityClassification'] ??
          lotNode?.['cac:RequiredCommodityClassification'];
        const lotCpvs = extractCpvList(lotCpvNode);
        const lotCpv = lotCpvs[0];

        lots.push({
          lotNumber,
          title: lotTitle.slice(0, 500),
          description: lotDesc ? lotDesc.slice(0, 1000) : undefined,
          budgetAmountEur: lotBudget !== undefined && !isNaN(lotBudget) ? lotBudget : undefined,
          cpvCode: lotCpv,
        });
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

    const lotCpvCodes = lots.map((l) => l.cpvCode).filter((c): c is string => Boolean(c));
    const allCpvCodes = Array.from(new Set([...projectCpvCodes, ...lotCpvCodes]));
    const mainCpv = allCpvCodes[0] || '00000000';
    const additionalCpvCodes = allCpvCodes.slice(1);

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
      cpvCode: mainCpv,
      additionalCpvCodes: additionalCpvCodes.length > 0 ? additionalCpvCodes : undefined,
      submissionDeadline,
      publicationDate: publishedStr || updatedStr || undefined,
      sourceUpdatedAt: updatedStr || undefined,
      authority: {
        name: authorityName.slice(0, 255),
        taxId,
        sourceAuthorityId,
        postalCode,
        city,
      },
      lots: lots.length > 0 ? lots : undefined,
      documents,
    };

    return this.normalizeEntry(rawEntry);
  }

  /**
   * Parsea una página completa del feed ATOM de la PLACSP.
   * Extrae el enlace 'rel="next"', verifica la fecha límite (cutoff) y filtra
   * opcionalmente por familias CPV del sector TIC (72* y 48*).
   * La operación es rápida (<1s) y cuidadosa con la memoria (libera AST y buffer de inmediato).
   */
  parseFeedPage(
    xmlContent: string,
    options: ParsePageOptions & { pageUrl?: string } = {},
  ): PageResult {
    const cutoffDate = options.cutoffDate ?? new Date('2026-09-01T00:00:00.000Z');
    const filterTicOnly = options.filterTicOnly ?? true;
    const maxItems = options.maxItems;
    const pageUrl = options.pageUrl ?? PLACSP_OFFICIAL_FEED_URL;

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      trimValues: true,
      parseTagValue: false,
    });

    const parsed = parser.parse(xmlContent);
    const feed = parsed?.feed;
    if (!feed || !feed.entry) {
      return {
        pageUrl,
        nextUrl: null,
        rawCount: 0,
        qualifiedCount: 0,
        tenders: [],
        oldestDate: null,
        newestDate: null,
        hitCutoff: false,
      };
    }

    // Extracción de enlace rel="next"
    let nextUrl: string | null = null;
    const links = feed.link ? (Array.isArray(feed.link) ? feed.link : [feed.link]) : [];
    for (const link of links) {
      const rel = link?.['@_rel'] ?? link?.rel;
      const href = link?.['@_href'] ?? link?.href;
      if (rel === 'next' && href) {
        nextUrl = String(href).trim();
        break;
      }
    }

    const rawEntries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    const qualifiedTenders: PlacspTenderInput[] = [];
    let oldestDate: Date | null = null;
    let newestDate: Date | null = null;
    let hitCutoff = false;
    let rawCount = 0;

    const entriesToProcess = maxItems ? rawEntries.slice(0, maxItems) : rawEntries;

    for (const entry of entriesToProcess) {
      rawCount++;
      try {
        const updatedStr = extractXmlText(entry.updated);
        const publishedStr = extractXmlText(entry.published);
        const entryDateRaw = updatedStr || publishedStr;
        let entryDate: Date | null = null;
        if (entryDateRaw) {
          const parsedD = new Date(entryDateRaw);
          if (!isNaN(parsedD.getTime())) {
            entryDate = parsedD;
          }
        }

        if (entryDate) {
          if (!newestDate || entryDate > newestDate) newestDate = entryDate;
          if (!oldestDate || entryDate < oldestDate) oldestDate = entryDate;

          if (cutoffDate && entryDate < cutoffDate) {
            hitCutoff = true;
            continue;
          }
        }

        const normalizedTender = this.extractEntryFromXmlNode(entry, updatedStr, publishedStr);
        if (!normalizedTender) continue;

        // Filtrado en memoria por familias TIC (CPVs 72* y 48*)
        if (filterTicOnly && !isTicTender(normalizedTender)) {
          continue;
        }

        qualifiedTenders.push(normalizedTender);
      } catch (entryError) {
        console.warn('Entrada de PLACSP omitida por error de normalización:', entryError);
      }
    }

    return {
      pageUrl,
      nextUrl,
      rawCount,
      qualifiedCount: qualifiedTenders.length,
      tenders: qualifiedTenders,
      oldestDate,
      newestDate,
      hitCutoff,
    };
  }

  /**
   * Mantiene compatibilidad hacia atrás con pruebas existentes sin filtro sectorial.
   */
  parseFeedXml(xmlContent: string, maxItems = 50): PlacspTenderInput[] {
    const pageResult = this.parseFeedPage(xmlContent, {
      filterTicOnly: false,
      maxItems,
    });
    return pageResult.tenders;
  }

  /**
   * Descarga una página de feed con User-Agent oficial, timeout y reintentos
   * con retroceso exponencial ante errores transitorios (429, 5xx, cortes de red).
   */
  async fetchFeedPage(url: string, retries = 4): Promise<string> {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'LicitaIA-Official-Ingest/1.0 (+https://pliegoai.com)',
            Accept: 'application/atom+xml, application/xml, text/xml',
            'Accept-Encoding': 'gzip, deflate',
          },
          signal: AbortSignal.timeout(30_000),
        });

        if (response.ok) {
          return await response.text();
        }

        if (response.status === 404) {
          throw new Error(`Feed page no encontrada (404): ${url}`);
        }

        if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
          if (attempt === retries) {
            throw new Error(`HTTP ${response.status} ${response.statusText} tras ${retries + 1} intentos en ${url}`);
          }
          const backoffMs = Math.min(1500 * Math.pow(2, attempt) + Math.random() * 500, 30_000);
          console.warn(`[PLACSP] HTTP ${response.status} en ${url}. Reintentando en ${Math.round(backoffMs)}ms (intento ${attempt + 1}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          attempt++;
          continue;
        }

        throw new Error(`PLACSP respondió con código HTTP ${response.status}: ${response.statusText}`);
      } catch (err: unknown) {
        if (attempt >= retries || (err instanceof Error && err.message.includes('404'))) {
          throw err;
        }
        const backoffMs = Math.min(1500 * Math.pow(2, attempt) + Math.random() * 500, 30_000);
        console.warn(`[PLACSP] Error en ${url}: ${(err as Error).message}. Reintentando en ${Math.round(backoffMs)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        attempt++;
      }
    }
    throw new Error(`Fallo definitivo al descargar ${url} tras ${retries} reintentos`);
  }

  /**
   * Recorre la paginación histórica hacia atrás a través de enlaces `rel="next"`
   * hasta alcanzar el límite temporal (cutoffDate, por defecto 2026-09-01).
   */
  async crawlFeedToCutoff(options: CrawlOptions = {}): Promise<CrawlSummary> {
    const cutoffDate = options.cutoffDate ?? new Date('2026-09-01T00:00:00.000Z');
    const maxPages = options.maxPages ?? Infinity;
    const delayBetweenPagesMs = options.delayBetweenPagesMs ?? 600;
    const filterTicOnly = options.filterTicOnly ?? true;

    let currentUrl: string | null = options.startUrl ?? PLACSP_OFFICIAL_FEED_URL;
    let pagesProcessed = 0;
    let totalScanned = 0;
    let totalQualified = 0;
    let oldestProcessedDate: Date | null = null;
    let newestProcessedDate: Date | null = null;
    let hitCutoff = false;
    let lastPageUrl = currentUrl;
    let nextPageUrl: string | null = null;

    while (currentUrl && pagesProcessed < maxPages && !hitCutoff) {
      lastPageUrl = currentUrl;
      let xmlContent: string | null = await this.fetchFeedPage(currentUrl);
      const pageResult = this.parseFeedPage(xmlContent, {
        cutoffDate,
        filterTicOnly,
        pageUrl: currentUrl,
      });
      xmlContent = null; // Higiene de memoria: descartar string de ~14 MB

      pagesProcessed++;
      totalScanned += pageResult.rawCount;
      totalQualified += pageResult.qualifiedCount;

      if (pageResult.newestDate && (!newestProcessedDate || pageResult.newestDate > newestProcessedDate)) {
        newestProcessedDate = pageResult.newestDate;
      }
      if (pageResult.oldestDate && (!oldestProcessedDate || pageResult.oldestDate < oldestProcessedDate)) {
        oldestProcessedDate = pageResult.oldestDate;
      }

      nextPageUrl = pageResult.nextUrl;
      hitCutoff = pageResult.hitCutoff;

      if (options.onPageProcessed) {
        await options.onPageProcessed(pageResult);
      }

      if (hitCutoff || !pageResult.nextUrl || pagesProcessed >= maxPages) {
        break;
      }

      if (delayBetweenPagesMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenPagesMs));
      }

      currentUrl = pageResult.nextUrl;
    }

    return {
      pagesProcessed,
      totalScanned,
      totalQualified,
      oldestProcessedDate,
      newestProcessedDate,
      lastPageUrl,
      nextPageUrl,
      hitCutoff,
    };
  }

  /**
   * Descarga el feed oficial en vivo de la PLACSP y devuelve las licitaciones normalizadas.
   */
  async fetchRealFeed(maxItems = 20, feedUrl = PLACSP_OFFICIAL_FEED_URL): Promise<PlacspTenderInput[]> {
    const xml = await this.fetchFeedPage(feedUrl);
    return this.parseFeedXml(xml, maxItems);
  }
}

export const placspConnector = new PlacspConnector();
