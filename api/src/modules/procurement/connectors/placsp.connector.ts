import crypto from 'node:crypto';
import { PlacspTenderInput, PlacspTenderInputSchema } from '../procurement.schema.js';

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
  readonly documents?: readonly {
    readonly type: 'PCAP' | 'PPT' | 'NOTICE' | 'AWARD_NOTICE' | 'OTHER';
    readonly name: string;
    readonly url: string;
    readonly contentHash?: string;
    readonly mimeType?: string;
  }[];
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
    const s = status.toUpperCase();
    if (s.includes('ADJUDICAD') || s.includes('AWARD')) return 'AWARDED';
    if (s.includes('EVALUAC') || s.includes('VALORAC')) return 'EVALUATION';
    if (s.includes('RESUELT') || s.includes('FORMALIZ')) return 'RESOLVED';
    if (s.includes('ANULAD') || s.includes('CANCEL') || s.includes('DESIERTO')) return 'CANCELLED';
    return 'PUBLISHED';
  }

  private mapProcedure(proc?: string): PlacspTenderInput['procedureType'] {
    if (!proc) return 'OPEN';
    const p = proc.toUpperCase();
    if (p.includes('RESTRINGID')) return 'RESTRICTED';
    if (p.includes('NEGOCIAD')) return 'NEGOTIATED_WITHOUT_ADVERTISING';
    if (p.includes('SIMPLIFICAD')) return 'SIMPLIFIED_OPEN';
    return 'OPEN';
  }

  private mapContractType(type?: string): PlacspTenderInput['contractType'] {
    if (!type) return 'SERVICES';
    const t = type.toUpperCase();
    if (t.includes('SUMINISTRO') || t.includes('SUPPL')) return 'SUPPLIES';
    if (t.includes('OBRA') || t.includes('WORK')) return 'WORKS';
    return 'SERVICES';
  }

  private normalizeCpv(cpv: string): string {
    const digits = cpv.replace(/\D/g, '');
    return digits.slice(0, 8).padEnd(8, '0');
  }
}

export const placspConnector = new PlacspConnector();
