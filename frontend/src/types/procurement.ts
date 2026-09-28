export type TenderStatus = 'PUBLISHED' | 'EVALUATION' | 'AWARDED' | 'CANCELLED';

export interface TenderDocument {
  id: string;
  name: string;
  type: 'PCA' | 'PPT' | 'ADENDA' | 'RESOLUCION' | 'ANUNCIO';
  sha256Hash: string; // Evidencia inmutable de integridad
  version: number;
  obtainedAt: string;
  url?: string;
}

export interface PublicTender {
  id: string; // UUIDv7
  fileReference: string; // Número de expediente oficial
  title: string;
  contractingAuthority: string; // Órgano de contratación
  cpvCode: string;
  budgetAmount: number; // Base imponible
  estimatedValue: number; // Valor estimado del contrato
  currency: string;
  submissionDeadline: string; // ISO 8601
  status: TenderStatus;
  documentsCount: number;
  documents?: TenderDocument[];
  hasActiveAnalysis?: boolean;
}
