export type EvidenceStatus = 'DECLARED' | 'VERIFIED' | 'EXPIRED' | 'PENDING_REVIEW' | 'REJECTED';

export interface CompanyProfile {
  id: string;
  tenantId: string;
  companyName: string;
  taxId: string; // CIF/NIF
  description: string;
  primaryCpvCodes: string[];
  geographicalScope: string[]; // Comunidades Autónomas o Nacional
  maxEconomicSolvency: number; // Facturación anual acreditada
  averageTeamSize: number;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string; // ISO 9001, ISO 27001, ENS, Clasificación Estado
  issuer: string;
  certificateNumber: string;
  issuedAt: string;
  expiresAt: string;
  status: EvidenceStatus;
}

export interface BusinessEvidence {
  id: string;
  category: 'PREVIOUS_CONTRACTS' | 'TEAM_QUALIFICATION' | 'TECHNICAL_MEANS' | 'FINANCIAL_SOLVENCY';
  title: string;
  description: string;
  documentReference: string; // Nombre del certificado o acta de recepción
  verifiedAmount?: number;
  validUntil?: string;
  status: EvidenceStatus;
}
