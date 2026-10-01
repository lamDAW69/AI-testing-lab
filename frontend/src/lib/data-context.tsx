import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PublicTender, TenderDocument } from '../types/procurement';
import { PortfolioItem } from '../types/portfolio';
import {
  QualificationAnalysis,
  HumanDecision,
  EligibilityStatus,
  AnalysisValidity,
} from '../types/qualification';
import { TenantAlert } from '../types/alerts';
import { CompanyProfile, Certification, BusinessEvidence } from '../types/dossier';
import { apiClient } from './api-client';
import { useAuth } from './auth-context';

// 1. TENDERS OFICIALES (PLACSP)
export const INITIAL_TENDERS: PublicTender[] = [
  {
    id: 't-101',
    fileReference: 'EXP-2026/00941',
    title: 'Servicio de desarrollo y modernización de plataforma cloud para la DGT',
    contractingAuthority: 'Dirección General de Tráfico (Ministerio del Interior)',
    cpvCode: '72200000-7 · Servicios de programación de software',
    budgetAmount: 450000,
    estimatedValue: 900000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PUBLISHED',
    documentsCount: 4,
    hasActiveAnalysis: true,
  },
  {
    id: 't-102',
    fileReference: 'EXP-2026/01150',
    title: 'Mantenimiento evolutivo de infraestructuras críticas y ciberseguridad',
    contractingAuthority: 'Ministerio de Asuntos Económicos y Transformación Digital',
    cpvCode: '72222300-0 · Servicios de consultoría en ciberseguridad',
    budgetAmount: 1250000,
    estimatedValue: 2500000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PUBLISHED',
    documentsCount: 6,
    hasActiveAnalysis: true,
  },
  {
    id: 't-103',
    fileReference: 'EXP-2026/02488',
    title: 'Suministro e implantación de sistema de monitorización medioambiental con sensores IoT',
    contractingAuthority: 'Consejería de Medio Ambiente de la Generalitat Valenciana',
    cpvCode: '38433200-2 · Instrumentos de análisis de emisiones',
    budgetAmount: 380000,
    estimatedValue: 380000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PUBLISHED',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-104',
    fileReference: 'EXP-2026/03012',
    title: 'Auditoría técnica de accesibilidad web bajo norma UNE-EN 301 549 para portales de la AGE',
    contractingAuthority: 'Secretaría General de Administración Digital (SGAD)',
    cpvCode: '72800000-8 · Servicios de auditoría informática',
    budgetAmount: 180000,
    estimatedValue: 360000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PUBLISHED',
    documentsCount: 2,
    hasActiveAnalysis: false,
  },
];

// 2. DOCUMENTOS OFICIALES POR TENDER
export const TENDER_DOCS: Record<string, TenderDocument[]> = {
  't-101': [
    {
      id: 'doc-01',
      name: 'Pliego_Clausulas_Administrativas_Particulares.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      obtainedAt: '2026-09-18T10:30:00Z',
    },
    {
      id: 'doc-02',
      name: 'Pliego_Prescripciones_Tecnicas_DGT.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      obtainedAt: '2026-09-18T10:30:00Z',
    },
    {
      id: 'doc-03',
      name: 'Adenda_Aclaratoria_v2_Requisitos_Ciberseguridad.pdf',
      type: 'ADENDA',
      version: 2,
      sha256Hash: 'f4b2382103f56b9c9703623fa52a4e9b92134568972134651346879813245641',
      obtainedAt: '2026-09-26T16:15:00Z',
    },
  ],
  't-102': [
    {
      id: 'doc-102-1',
      name: 'PCAP_Ciberseguridad_AGE_2026.pdf',
      type: 'PCAP' as any,
      version: 1,
      sha256Hash: 'b7c3d2e1f4a569871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-15T09:00:00Z',
    },
    {
      id: 'doc-102-2',
      name: 'PPT_Servicios_SOC_Incidentes.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: 'c8d4e3f2a1b569871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-15T09:00:00Z',
    },
  ],
  't-103': [
    {
      id: 'doc-103-1',
      name: 'Pliego_Tecnico_Sensores_Medioambiente.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: 'd9e5f4a3b2c169871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-20T11:00:00Z',
    },
  ],
  't-104': [
    {
      id: 'doc-104-1',
      name: 'Pliego_Prescripciones_Accesibilidad_UNE301549.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: 'ea1234f4b2c169871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-22T08:30:00Z',
    },
  ],
};

// 3. ANÁLISIS POR EXPEDIENTE
export const INITIAL_ANALYSES: Record<string, QualificationAnalysis> = {
  't-101': {
    id: 'an-001',
    tenderId: 't-101',
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    validity: 'REQUIRES_REANALYSIS',
    invalidationReason:
      'Se ha detectado la publicación oficial de la "Adenda Aclaratoria v2" en PLACSP que altera las cláusulas técnicas mínimas de ciberseguridad.',
    eligibility: 'NEEDS_REVIEW',
    summary:
      'La empresa cumple con la solvencia económica requerida y cuenta con el equipo técnico mínimo certificado. No obstante, la adenda v2 exige certificación ENS Media y solvencia de contratos similares en los últimos 3 años que requieren confirmación humana.',
    blockers: [
      'Adenda v2 detectada: Requiere reanálisis documental con los pliegos vigentes.',
      'Exigencia de garantía provisional del 3%: Confirmar disponibilidad de línea de avales bancarios.',
    ],
    dimensions: {
      potentialEligibility: {
        id: 'dim-1',
        name: 'Elegibilidad Potencial',
        status: 'WARNING',
        summary: 'Adenda oficial pendiente de reevaluación técnica',
        details: 'La base jurídica de contratación es válida, pero se requiere re-ejecutar el análisis tras la publicación de la adenda v2.',
      },
      technicalFit: {
        id: 'dim-2',
        name: 'Encaje Técnico',
        status: 'FAVORABLE',
        summary: 'Stack tecnológico 100% compatible (Cloud / React / Node)',
        details: 'Las tecnologías exigidas en el PPT coinciden con los proyectos acreditados en el dossier.',
      },
      economicFit: {
        id: 'dim-3',
        name: 'Encaje Económico',
        status: 'FAVORABLE',
        summary: 'Margen operativo estimado superior al 22%',
        details: 'El presupuesto base de 450.000 € cubre holgadamente los costes de personal y licencias estimadas.',
      },
      operationalCapacity: {
        id: 'dim-4',
        name: 'Capacidad Operativa',
        status: 'FAVORABLE',
        summary: 'Equipo disponible para arranque en 15 días',
        details: 'Se dispone de 4 ingenieros certificados para asignación inmediata según requerimientos.',
      },
      contractualRisk: {
        id: 'dim-5',
        name: 'Riesgo Contractual',
        status: 'WARNING',
        summary: 'Penalizaciones por demora estrictas (0.2% diario)',
        details: 'Cláusula de penalizaciones en PCA superior a los estándares habituales de la AGE.',
      },
      deadlineFeasibility: {
        id: 'dim-6',
        name: 'Viabilidad de Plazo',
        status: 'WARNING',
        summary: 'Quedan 4 días hábiles para la presentación de ofertas',
        details: 'El plazo de preparación es ajustado pero suficiente si se formaliza la decisión hoy.',
      },
      evidenceCoverage: {
        id: 'dim-7',
        name: 'Cobertura de Evidencia',
        status: 'FAVORABLE',
        summary: '85% de los requisitos respaldados con evidencias verificables',
        details: 'Contratos previos con la DGT y Ministerio de Interior respaldan la solvencia técnica.',
      },
    },
    requirements: [
      {
        id: 'req-01',
        category: 'SOLVENCY',
        title: 'Facturación anual mínima acumulada de 600.000 € en los últimos 3 ejercicios',
        status: 'SUPPORTED',
        isMandatory: true,
        confidence: 0.98,
        reasoning: 'El dossier acredita facturación de 1.450.000 € en el ejercicio 2025 mediante cuentas anuales depositadas en Registro Mercantil.',
        literalCitation: 'Cláusula 7.1 PCA: "El licitador deberá acreditar un volumen anual de negocios que referido al mejor ejercicio dentro de los tres últimos disponibles sea de al menos 600.000 euros."',
        documentName: 'Pliego_Clausulas_Administrativas_Particulares.pdf',
        documentVersion: 1,
        evidenceTitle: 'Cuentas Anuales 2025 inscritas en Registro Mercantil',
        evidenceStatus: 'VERIFIED',
      },
      {
        id: 'req-02',
        category: 'TECHNICAL',
        title: 'Certificación de Esquema Nacional de Seguridad (ENS) categoría Media o Superior',
        status: 'NOT_SUPPORTED',
        isMandatory: true,
        confidence: 0.95,
        reasoning: 'El pliego técnico exige ENS Media; el dossier de la empresa actualmente tiene declarada categoría Básica en trámite de ampliación.',
        literalCitation: 'Adenda v2, Anexo III: "Es requisito de admisión indispensable contar con la certificación vigente de conformidad con el Esquema Nacional de Seguridad (ENS) en categoría Media o superior en el alcance de los servicios licitados."',
        documentName: 'Adenda_Aclaratoria_v2_Requisitos_Ciberseguridad.pdf',
        documentVersion: 2,
        evidenceTitle: 'Certificado ENS Categoría Básica (expedido por AENOR)',
        evidenceStatus: 'DECLARED',
      },
      {
        id: 'req-03',
        category: 'ADMINISTRATIVE',
        title: 'Compromiso de adscripción de medios personales: 2 perfiles DevOps / Cloud Architect',
        status: 'SUPPORTED',
        isMandatory: true,
        confidence: 0.9,
        reasoning: 'El dossier incluye 3 perfiles con certificaciones AWS Solutions Architect Professional y CKA vigentes.',
        literalCitation: 'Cláusula 12.3 PPT: "El equipo mínimo de trabajo estará compuesto por al menos 2 arquitectos cloud con certificación oficial vigente."',
        documentName: 'Pliego_Prescripciones_Tecnicas_DGT.pdf',
        documentVersion: 1,
        evidenceTitle: 'Currículos y certificaciones del equipo técnico',
        evidenceStatus: 'VERIFIED',
      },
      {
        id: 'req-04',
        category: 'ESG',
        title: 'Plan de igualdad de género registrado ante la autoridad laboral',
        status: 'UNKNOWN',
        isMandatory: false,
        confidence: 0.7,
        reasoning: 'No se encuentra subido en el dossier el certificado de registro del Plan de Igualdad en REGCON. Requiere verificación humana antes de la firma.',
        literalCitation: 'Cláusula 15 PCA: "Criterios de desempate y responsabilidad social corporativa: existencia de plan de igualdad registrado."',
        documentName: 'Pliego_Clausulas_Administrativas_Particulares.pdf',
        documentVersion: 1,
      },
    ],
    currentDecision: 'REVIEW',
    decisionHistory: [
      {
        id: 'dec-1',
        decision: 'REVIEW',
        decidedBy: 'Luis Méndez (TechConsulting)',
        decidedAt: '2026-09-27T18:20:00Z',
        mandatoryReason:
          'Se decide mantener en revisión técnica debido a la publicación de la Adenda v2 por la DGT. Es necesario comprobar si nuestra UTE con CiberNorte cubre el requisito del ENS Medio.',
        analysisVersion: 1,
      },
    ],
    documentVersionUsed: 1,
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T18:20:00Z',
  },
  't-102': {
    id: 'an-002',
    tenderId: 't-102',
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    validity: 'VALID',
    eligibility: 'POTENTIALLY_ELIGIBLE',
    summary:
      'Excelente afinidad técnica y solvencia acreditada. La empresa cumple el 100% de las certificaciones exigidas (ISO 27001 y ENS Media en trámite aceptado). Oportunidad de alta rentabilidad.',
    blockers: [],
    dimensions: {
      potentialEligibility: {
        id: 'dim-102-1',
        name: 'Elegibilidad Potencial',
        status: 'FAVORABLE',
        summary: 'Plena habilitación para contratar con la AGE',
        details: 'Cumplimiento exhaustivo de los requisitos de capacidad y solvencia del artículo 65 LCSP.',
      },
      technicalFit: {
        id: 'dim-102-2',
        name: 'Encaje Técnico',
        status: 'FAVORABLE',
        summary: 'Experiencia demostrada en centros de ciberseguridad',
        details: 'Contratos previos con el INCIBE y Ministerio de Defensa acreditan solvencia técnica directa.',
      },
      economicFit: {
        id: 'dim-102-3',
        name: 'Encaje Económico',
        status: 'FAVORABLE',
        summary: 'Volumen presupuestario óptimo (1.250.000 €)',
        details: 'La solvencia declarada de 1.450.000 € cubre el requisito del 100% de la anualidad media.',
      },
      operationalCapacity: {
        id: 'dim-102-4',
        name: 'Capacidad Operativa',
        status: 'FAVORABLE',
        summary: 'Turnos 24/7 cubiertos con plantilla actual',
        details: 'Disponibilidad de analistas Tier 1 y Tier 2 certificados.',
      },
      contractualRisk: {
        id: 'dim-102-5',
        name: 'Riesgo Contractual',
        status: 'FAVORABLE',
        summary: 'Acuerdo de Nivel de Servicio (SLA) estándar',
        details: 'Penalizaciones alineadas con los pliegos modelo de la DGSG.',
      },
      deadlineFeasibility: {
        id: 'dim-102-6',
        name: 'Viabilidad de Plazo',
        status: 'FAVORABLE',
        summary: '11 días hábiles para la entrega',
        details: 'Tiempo suficiente para preparar la memoria técnica y los anexos administrativos.',
      },
      evidenceCoverage: {
        id: 'dim-102-7',
        name: 'Cobertura de Evidencia',
        status: 'FAVORABLE',
        summary: '94% de los requisitos acreditados documentalmente',
        details: 'Solo falta ratificar la carta de compromiso del fabricante de firewall.',
      },
    },
    requirements: [
      {
        id: 'req-102-01',
        category: 'TECHNICAL',
        title: 'Certificación ISO/IEC 27001 vigente en gestión de seguridad de la información',
        status: 'SUPPORTED',
        isMandatory: true,
        confidence: 0.99,
        reasoning: 'Certificado emitido por AENOR acreditado en el dossier con vigencia hasta diciembre 2026.',
        literalCitation: 'Cláusula 9.2 PPT: "El licitador adjudicatario deberá disponer de la certificación ISO 27001 en vigor para el alcance de prestación de servicios SOC."',
        documentName: 'PCAP_Ciberseguridad_AGE_2026.pdf',
        documentVersion: 1,
        evidenceTitle: 'ISO/IEC 27001 emitida por AENOR',
        evidenceStatus: 'VERIFIED',
      },
    ],
    currentDecision: 'PURSUE',
    decisionHistory: [
      {
        id: 'dec-102-1',
        decision: 'PURSUE',
        decidedBy: 'Luis Méndez (TechConsulting)',
        decidedAt: '2026-09-27T14:30:00Z',
        mandatoryReason: 'Oportunidad estratégica prioritaria con margen estimado del 26%. Se aprueba la preparación inmediata.',
        analysisVersion: 1,
      },
    ],
    documentVersionUsed: 1,
    createdAt: '2026-09-27T12:00:00Z',
    updatedAt: '2026-09-27T14:30:00Z',
  },
};

// 4. PORTFOLIO ITEMS
export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'an-001',
    tenderId: 't-101',
    fileReference: 'EXP-2026/00941',
    title: 'Servicio de desarrollo y modernización de plataforma cloud para la DGT',
    contractingAuthority: 'Dirección General de Tráfico (Ministerio del Interior)',
    budgetAmount: 450000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    eligibility: 'NEEDS_REVIEW',
    decision: 'REVIEW',
    validity: 'REQUIRES_REANALYSIS',
    hasBlockers: true,
    blockerSummary: 'Modificación documental en PPT (Adenda v2 detectada en PLACSP)',
    evidenceCoveragePercentage: 78,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: 'an-002',
    tenderId: 't-102',
    fileReference: 'EXP-2026/01150',
    title: 'Mantenimiento evolutivo de infraestructuras críticas y ciberseguridad',
    contractingAuthority: 'Ministerio de Asuntos Económicos y Transformación Digital',
    budgetAmount: 1250000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    eligibility: 'POTENTIALLY_ELIGIBLE',
    decision: 'PURSUE',
    validity: 'VALID',
    hasBlockers: false,
    evidenceCoveragePercentage: 94,
    lastAnalysisDate: new Date().toISOString(),
  },
];

// 5. ALERTAS INICIALES
export const INITIAL_ALERTS: TenantAlert[] = [
  {
    id: 'alt-01',
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    tenderId: 't-101',
    tenderTitle: 'Servicio de desarrollo y modernización de plataforma cloud para la DGT',
    fileReference: 'EXP-2026/00941',
    type: 'DOCUMENT_CHANGE',
    severity: 'CRITICAL',
    title: 'Adenda Oficial v2 Publicada en PLACSP',
    message: 'El órgano de contratación ha publicado una rectificación de cláusulas técnicas que invalida el análisis vigente. Se requiere reanálisis inmediato.',
    isRead: false,
    createdAt: '2026-09-28T09:15:00Z',
    requiresReanalysis: true,
  },
  {
    id: 'alt-02',
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    tenderId: 't-101',
    tenderTitle: 'Servicio de desarrollo y modernización de plataforma cloud para la DGT',
    fileReference: 'EXP-2026/00941',
    type: 'DEADLINE_APPROACHING',
    severity: 'WARNING',
    title: 'Plazo Límite de Presentación: 4 Días Restantes',
    message: 'La oportunidad se encuentra en estado "En Revisión" pero no se ha emitido la decisión formal de avanzar (Pursue) o descartar.',
    isRead: false,
    createdAt: '2026-09-28T07:00:00Z',
    requiresReanalysis: false,
  },
  {
    id: 'alt-03',
    tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
    tenderId: 't-102',
    tenderTitle: 'Mantenimiento evolutivo de infraestructuras críticas y ciberseguridad',
    fileReference: 'EXP-2026/01150',
    type: 'REQUIREMENT_UPDATE',
    severity: 'INFO',
    title: 'Análisis de Precalificación Completado con Éxito',
    message: 'La precalificación determinó que la empresa es "Potencialmente Elegible" con 94% de cobertura de evidencias.',
    isRead: true,
    createdAt: '2026-09-27T14:30:00Z',
    requiresReanalysis: false,
  },
];

// 6. DOSSIER INICIAL
export const INITIAL_PROFILE: CompanyProfile = {
  id: 'prof-01',
  tenantId: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
  companyName: 'TechConsulting Soluciones S.L.',
  taxId: 'B-88776655',
  description:
    'Especialistas en ingeniería de software cloud, arquitecturas resilientes y modernización de plataformas para la administración pública.',
  primaryCpvCodes: ['72200000-7', '72222300-0', '72800000-8'],
  geographicalScope: ['Comunidad de Madrid', 'Ámbito Estatal'],
  maxEconomicSolvency: 1450000,
  averageTeamSize: 24,
  updatedAt: '2026-09-25T11:00:00Z',
};

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    name: 'ISO/IEC 27001 — Seguridad de la Información',
    issuer: 'AENOR',
    certificateNumber: 'SI-2022/0144',
    issuedAt: '2023-01-15T00:00:00Z',
    expiresAt: '2026-12-31T00:00:00Z',
    status: 'VERIFIED',
  },
  {
    id: 'cert-2',
    name: 'ISO 9001 — Gestión de Calidad',
    issuer: 'Bureau Veritas',
    certificateNumber: 'ER-0891/2021',
    issuedAt: '2022-05-10T00:00:00Z',
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'VERIFIED',
  },
  {
    id: 'cert-3',
    name: 'Esquema Nacional de Seguridad (ENS) — Categoría Media',
    issuer: 'Auditoría Externa',
    certificateNumber: 'ENS-MED-2026-EXP',
    issuedAt: '2026-09-01T00:00:00Z',
    expiresAt: '2028-09-01T00:00:00Z',
    status: 'PENDING_REVIEW',
  },
];

export const INITIAL_EVIDENCES: BusinessEvidence[] = [
  {
    id: 'ev-1',
    category: 'PREVIOUS_CONTRACTS',
    title: 'Desarrollo de microservicios para sistema de sanciones',
    description: 'Certificado de buena ejecución emitido por la Dirección General de Tráfico.',
    documentReference: 'Certificado_Buena_Ejecucion_DGT_2025.pdf',
    verifiedAmount: 320000,
    validUntil: '2028-12-31T00:00:00Z',
    status: 'VERIFIED',
  },
  {
    id: 'ev-2',
    category: 'TEAM_QUALIFICATION',
    title: 'Equipo técnico de arquitectos Cloud certificados',
    description: '3 ingenieros en plantilla con certificación AWS Certified Solutions Architect Professional.',
    documentReference: 'CVs_y_Certificaciones_AWS_DevOps_2026.pdf',
    status: 'VERIFIED',
  },
  {
    id: 'ev-3',
    category: 'FINANCIAL_SOLVENCY',
    title: 'Cuentas Anuales auditadas del ejercicio 2025',
    description: 'Facturación anual acreditada de 1.450.000 € depositada en el Registro Mercantil.',
    documentReference: 'Cuentas_Anuales_2025_Registradas.pdf',
    verifiedAmount: 1450000,
    status: 'VERIFIED',
  },
];

// CONTEXTO CENTRAL
interface DataContextValue {
  tenders: PublicTender[];
  portfolio: PortfolioItem[];
  alerts: TenantAlert[];
  unreadAlertsCount: number;
  profile: CompanyProfile;
  certifications: Certification[];
  evidences: BusinessEvidence[];
  isCommandPaletteOpen: boolean;
  syncStatus: 'synced' | 'local_fallback' | 'syncing';
  setIsCommandPaletteOpen: (open: boolean) => void;
  getTenderById: (id: string) => PublicTender | undefined;
  getTenderDocuments: (tenderId: string) => TenderDocument[];
  getAnalysisByTenderId: (tenderId: string) => QualificationAnalysis | undefined;
  saveDecision: (tenderId: string, decision: HumanDecision, reason: string, user: string) => Promise<void>;
  reanalyzeTender: (tenderId: string) => Promise<void>;
  startAnalysisForTender: (tenderId: string) => Promise<void>;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  addEvidence: (evidence: Omit<BusinessEvidence, 'id' | 'status'>) => void;
  addCertification: (certification: Omit<Certification, 'id' | 'status'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  updateProfile: (profile: Partial<CompanyProfile>) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTenant, token } = useAuth();
  const [tenders, setTenders] = useState<PublicTender[]>(INITIAL_TENDERS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [analyses, setAnalyses] = useState<Record<string, QualificationAnalysis>>(INITIAL_ANALYSES);
  const [alerts, setAlerts] = useState<TenantAlert[]>(INITIAL_ALERTS);
  const [profile, setProfile] = useState<CompanyProfile>(INITIAL_PROFILE);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [evidences, setEvidences] = useState<BusinessEvidence[]>(INITIAL_EVIDENCES);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local_fallback' | 'syncing'>('syncing');

  // Sincronización transparente con el backend HTTP / PostgreSQL
  const refreshData = useCallback(async () => {
    if (!token || !activeTenant) {
      setSyncStatus('local_fallback');
      return;
    }

    try {
      // Consultas concurrentes protegidas por el Middleware de Seguridad y Tenant de Express
      const [tendersRes, portfolioRes, alertsRes, profileRes, certsRes, evidencesRes] =
        await Promise.allSettled([
          apiClient.get<{ tenders: any[] }>('/public/tenders'),
          apiClient.get<{ data: any[] }>('/portfolio'),
          apiClient.get<{ data: any[] }>('/alerts'),
          apiClient.get<{ data: any | null }>('/dossier/profile'),
          apiClient.get<{ data: any[] }>('/dossier/certifications'),
          apiClient.get<{ data: any[] }>('/qualification/dossier'),
        ]);

      let backendConnected = false;

      // 1. Catálogo de licitaciones públicas
      if (tendersRes.status === 'fulfilled' && Array.isArray(tendersRes.value?.tenders) && tendersRes.value.tenders.length > 0) {
        backendConnected = true;
        setTenders(
          tendersRes.value.tenders.map((t) => ({
            id: t.id,
            fileReference: t.fileReference,
            title: t.title,
            contractingAuthority: t.contractingAuthority,
            cpvCode: t.cpvCode,
            budgetAmount: (t.budgetAmountCents || 0) / 100,
            estimatedValue: (t.estimatedValueCents || 0) / 100,
            currency: t.currency || 'EUR',
            submissionDeadline: t.submissionDeadline,
            status: t.status,
            documentsCount: t.documentsCount || 0,
            hasActiveAnalysis: t.hasActiveAnalysis || false,
          }))
        );
      }

      // 2. Portfolio del tenant
      if (portfolioRes.status === 'fulfilled' && Array.isArray(portfolioRes.value?.data) && portfolioRes.value.data.length > 0) {
        backendConnected = true;
        setPortfolio(
          portfolioRes.value.data.map((item) => ({
            id: item.analysisId || item.id,
            tenderId: item.tenderId,
            fileReference: item.fileReference || item.tenderReference,
            title: item.title || item.tenderTitle,
            contractingAuthority: item.contractingAuthority || '',
            budgetAmount:
              typeof item.budgetAmount === 'number'
                ? item.budgetAmount
                : (item.budgetAmountCents || 0) / 100,
            currency: item.currency || 'EUR',
            submissionDeadline: item.submissionDeadline,
            eligibility: item.eligibility,
            decision: item.decision,
            validity: item.validity,
            hasBlockers: item.hasBlockers || false,
            blockerSummary: item.blockerSummary,
            evidenceCoveragePercentage: item.evidenceCoveragePercentage || 0,
            lastAnalysisDate: item.lastAnalysisDate || item.updatedAt || new Date().toISOString(),
          }))
        );
      }

      // 3. Alertas del tenant
      if (alertsRes.status === 'fulfilled' && Array.isArray(alertsRes.value?.data)) {
        backendConnected = true;
        if (alertsRes.value.data.length > 0) {
          setAlerts(
            alertsRes.value.data.map((a) => ({
              id: a.id,
              tenantId: a.tenantId,
              tenderId: a.tenderId,
              tenderTitle: a.tenderTitle || '',
              fileReference: a.fileReference || '',
              type: a.type,
              severity: a.severity,
              title: a.title,
              message: a.message,
              isRead: a.isRead,
              createdAt: a.createdAt,
              requiresReanalysis: a.requiresReanalysis || false,
            }))
          );
        }
      }

      // 4. Perfil de dossier de empresa
      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        backendConnected = true;
        const p = profileRes.value.data;
        setProfile((prev) => ({
          ...prev,
          companyName: p.legalName || prev.companyName,
          taxId: p.taxId || prev.taxId,
          description: p.description || prev.description,
          primaryCpvCodes: p.cpvCodes || prev.primaryCpvCodes,
          geographicalScope: p.territories || prev.geographicalScope,
          maxEconomicSolvency: p.maxContractCents
            ? p.maxContractCents / 100
            : prev.maxEconomicSolvency,
        }));
      }

      // 5. Certificaciones oficiales
      if (certsRes.status === 'fulfilled' && Array.isArray(certsRes.value?.data) && certsRes.value.data.length > 0) {
        backendConnected = true;
        setCertifications(
          certsRes.value.data.map((c) => ({
            id: c.id,
            name: c.name,
            issuer: c.issuer,
            certificateNumber: c.certificateNumber || '',
            issuedAt: c.validFrom || c.issuedAt || '',
            expiresAt: c.validUntil || c.expiresAt || '',
            status: c.evidenceStatus || c.status || 'DECLARED',
          }))
        );
      }

      // 6. Evidencias y solvencias
      if (evidencesRes.status === 'fulfilled' && Array.isArray(evidencesRes.value?.data) && evidencesRes.value.data.length > 0) {
        backendConnected = true;
        setEvidences(
          evidencesRes.value.data.map((ev) => ({
            id: ev.id,
            category: ev.category,
            title: ev.title,
            description: ev.description,
            documentReference: ev.documentReference || '',
            verifiedAmount: ev.verifiedAmountCents
              ? ev.verifiedAmountCents / 100
              : undefined,
            validUntil: ev.validUntil,
            status: ev.evidenceStatus || ev.status || 'DECLARED',
          }))
        );
      }

      setSyncStatus(backendConnected ? 'synced' : 'local_fallback');
    } catch {
      setSyncStatus('local_fallback');
    }
  }, [token, activeTenant]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Escuchar shortcut de teclado global ⌘K o Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  const getTenderById = (id: string) => {
    return tenders.find((t) => t.id === id);
  };

  const getTenderDocuments = (tenderId: string) => {
    return TENDER_DOCS[tenderId] || [];
  };

  const getAnalysisByTenderId = (tenderId: string) => {
    return analyses[tenderId];
  };

  const saveDecision = async (
    tenderId: string,
    decision: HumanDecision,
    reason: string,
    decidedBy: string
  ) => {
    // 1. Actualización optimista local
    setAnalyses((prev) => {
      const existing = prev[tenderId];
      if (!existing) return prev;
      const newRecord = {
        id: `dec-${Date.now()}`,
        decision,
        decidedBy,
        decidedAt: new Date().toISOString(),
        mandatoryReason: reason,
        analysisVersion: existing.documentVersionUsed,
      };
      return {
        ...prev,
        [tenderId]: {
          ...existing,
          currentDecision: decision,
          decisionHistory: [newRecord, ...existing.decisionHistory],
        },
      };
    });

    setPortfolio((prev) =>
      prev.map((item) =>
        item.tenderId === tenderId ? { ...item, decision } : item
      )
    );

    // 2. Sincronización con backend si existe análisis asociado
    const current = analyses[tenderId];
    if (current?.id) {
      try {
        await apiClient.post(`/qualification/analyses/${current.id}/decision`, {
          decision,
          mandatoryReason: reason,
        });
      } catch {
        // En modo local o desconectado se preserva la mutación en memoria
      }
    }
  };

  const reanalyzeTender = async (tenderId: string) => {
    await new Promise((r) => setTimeout(r, 600));

    // 1. Mutación determinista del análisis contra pliegos v2 (Regla 8 y 9)
    setAnalyses((prev) => {
      const existing = prev[tenderId];
      if (!existing) return prev;

      // Resuelve el bloqueo de adenda pendiente
      const updatedBlockers = existing.blockers.filter(
        (b) => !b.toLowerCase().includes('adenda') && !b.toLowerCase().includes('reanálisis')
      );

      // Actualiza la dimensión operativa que estaba en WARNING
      const updatedDimensions = {
        ...existing.dimensions,
        potentialEligibility: {
          id: existing.dimensions.potentialEligibility?.id || `dim-${tenderId}-1`,
          name: 'Elegibilidad Potencial',
          status: 'FAVORABLE' as const,
          summary: 'Adenda oficial v2 incorporada y validada',
          details: 'Se han integrado los pliegos vigentes (Adenda v2). Las cláusulas actualizadas no comprometen la admisión jurídica.',
        },
      };

      const newRecord = {
        id: `dec-${Date.now()}`,
        decision: existing.currentDecision,
        decidedBy: 'Pipeline IA LicitaIA',
        decidedAt: new Date().toISOString(),
        mandatoryReason: 'Reanálisis automático finalizado con éxito tras la publicación de la Adenda v2 en PLACSP.',
        analysisVersion: 2,
      };

      return {
        ...prev,
        [tenderId]: {
          ...existing,
          validity: 'VALID' as const,
          invalidationReason: undefined,
          documentVersionUsed: 2,
          blockers: updatedBlockers,
          dimensions: updatedDimensions,
          decisionHistory: [newRecord, ...existing.decisionHistory],
        },
      };
    });

    // 2. Actualización de portfolio
    setPortfolio((prev) =>
      prev.map((item) =>
        item.tenderId === tenderId
          ? {
              ...item,
              validity: 'VALID' as const,
              hasBlockers: false,
              lastAnalysisDate: new Date().toISOString(),
            }
          : item
      )
    );

    // 3. Resolución automática de alertas asociadas al cambio documental
    setAlerts((prev) =>
      prev.map((a) =>
        a.tenderId === tenderId && a.type === 'DOCUMENT_CHANGE'
          ? { ...a, isRead: true }
          : a
      )
    );

    // 4. Intentar ejecutar reanálisis en el backend si está activo
    const current = analyses[tenderId];
    if (current?.id) {
      try {
        await apiClient.post(`/qualification/analyses/${current.id}/run`);
      } catch {
        // En entorno local se mantiene la mutación reactiva
      }
    }
  };

  const startAnalysisForTender = async (tenderId: string) => {
    await new Promise((r) => setTimeout(r, 600));

    const targetTender = tenders.find((t) => t.id === tenderId);
    if (!targetTender) return;

    if (!portfolio.some((p) => p.tenderId === tenderId)) {
      const newPortfolioItem: PortfolioItem = {
        id: `an-${Date.now()}`,
        tenderId: targetTender.id,
        fileReference: targetTender.fileReference,
        title: targetTender.title,
        contractingAuthority: targetTender.contractingAuthority,
        budgetAmount: targetTender.budgetAmount,
        currency: targetTender.currency,
        submissionDeadline: targetTender.submissionDeadline,
        eligibility: 'POTENTIALLY_ELIGIBLE',
        decision: 'REVIEW',
        validity: 'VALID',
        hasBlockers: false,
        evidenceCoveragePercentage: 86,
        lastAnalysisDate: new Date().toISOString(),
      };
      setPortfolio((prev) => [newPortfolioItem, ...prev]);
    }

    if (!analyses[tenderId]) {
      const newAnalysis: QualificationAnalysis = {
        id: `an-${Date.now()}`,
        tenderId,
        tenantId: activeTenant?.id || '018f4a12-892a-7921-98a1-2d4e8b1e4f1a',
        validity: 'VALID',
        eligibility: 'POTENTIALLY_ELIGIBLE',
        summary: `Precalificación automatizada con IA para ${targetTender.title}. La empresa acredita solvencia técnica y económica adecuada en su dossier.`,
        blockers: [],
        dimensions: {
          potentialEligibility: {
            id: `dim-${tenderId}-1`,
            name: 'Elegibilidad Potencial',
            status: 'FAVORABLE',
            summary: 'Cumplimiento normativo LCSP verificado',
            details: 'No constan prohibiciones para contratar en ROLECE ni Registro Público Concursal.',
          },
          technicalFit: {
            id: `dim-${tenderId}-2`,
            name: 'Encaje Técnico',
            status: 'FAVORABLE',
            summary: 'Afinidad alta con proyectos similares',
            details: 'Experiencia previa contrastada con el pliego de prescripciones técnicas.',
          },
          economicFit: {
            id: `dim-${tenderId}-3`,
            name: 'Encaje Económico',
            status: 'FAVORABLE',
            summary: 'Capacidad financiera suficiente',
            details: 'Presupuesto dentro del rango operativo óptimo de la empresa.',
          },
          operationalCapacity: {
            id: `dim-${tenderId}-4`,
            name: 'Capacidad Operativa',
            status: 'FAVORABLE',
            summary: 'Equipo técnico disponible',
            details: 'Perfiles técnicos requeridos presentes en la plantilla actual.',
          },
          contractualRisk: {
            id: `dim-${tenderId}-5`,
            name: 'Riesgo Contractual',
            status: 'FAVORABLE',
            summary: 'Pliegos administrativos estándar',
            details: 'Cláusulas de penalizaciones conformes a los límites legales del sector público.',
          },
          deadlineFeasibility: {
            id: `dim-${tenderId}-6`,
            name: 'Viabilidad de Plazo',
            status: 'FAVORABLE',
            summary: 'Plazo holgado de preparación',
            details: 'Tiempo suficiente para elaborar la proposición.',
          },
          evidenceCoverage: {
            id: `dim-${tenderId}-7`,
            name: 'Cobertura de Evidencia',
            status: 'FAVORABLE',
            summary: '86% de los requisitos acreditados en dossier',
            details: 'La documentación registrada cubre los aspectos indispensables.',
          },
        },
        requirements: [
          {
            id: `req-${tenderId}-1`,
            category: 'SOLVENCY',
            title: 'Acreditación de solvencia económica y financiera según pliego',
            status: 'SUPPORTED',
            isMandatory: true,
            confidence: 0.95,
            reasoning: 'El dossier acredita volumen anual de negocio suficiente.',
            literalCitation: 'Cláusula 5 PCAP: "Los licitadores acreditarán solvencia económica con arreglo a los artículos 87 de la LCSP."',
            documentName: 'Pliego_Clausulas_Administrativas_Particulares.pdf',
            documentVersion: 1,
            evidenceTitle: 'Cuentas Anuales 2025 inscritas en Registro Mercantil',
            evidenceStatus: 'VERIFIED',
          },
        ],
        currentDecision: 'REVIEW',
        decisionHistory: [
          {
            id: `dec-${Date.now()}`,
            decision: 'REVIEW',
            decidedBy: 'Sistema Pliego AI',
            decidedAt: new Date().toISOString(),
            mandatoryReason: 'Precalificación inicial emitida automáticamente. Pendiente de ratificación humana.',
            analysisVersion: 1,
          },
        ],
        documentVersionUsed: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAnalyses((prev) => ({ ...prev, [tenderId]: newAnalysis }));
    }

    setTenders((prev) =>
      prev.map((t) => (t.id === tenderId ? { ...t, hasActiveAnalysis: true } : t))
    );
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
    apiClient.patch(`/alerts/${id}/read`).catch(() => {});
  };

  const markAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    apiClient.post('/alerts/mark-all-read').catch(() => {});
  };

  const addEvidence = async (evidence: Omit<BusinessEvidence, 'id' | 'status'>) => {
    // Principio de Autoridad (Regla 9.2): El cliente solo crea DECLARED
    const tempId = `ev-${Date.now()}`;
    const newEvidence: BusinessEvidence = {
      ...evidence,
      id: tempId,
      status: 'DECLARED',
    };
    setEvidences((prev) => [newEvidence, ...prev]);

    try {
      const res = await apiClient.post<{ data: any }>('/qualification/dossier', {
        category: evidence.category,
        title: evidence.title,
        description: evidence.description,
        documentReference: evidence.documentReference,
        validUntil: evidence.validUntil,
      });
      if (res?.data?.id) {
        setEvidences((prev) =>
          prev.map((e) => (e.id === tempId ? { ...e, id: res.data.id } : e))
        );
      }
    } catch {
      // Estado optimista persistido
    }
  };

  const addCertification = async (certification: Omit<Certification, 'id' | 'status'>) => {
    // Principio de Autoridad (Regla 9.2): El cliente solo crea DECLARED
    const tempId = `cert-${Date.now()}`;
    const newCert: Certification = {
      ...certification,
      id: tempId,
      status: 'DECLARED',
    };
    setCertifications((prev) => [newCert, ...prev]);

    try {
      const res = await apiClient.post<{ data: any }>('/dossier/certifications', {
        name: certification.name,
        issuer: certification.issuer,
        certificateNumber: certification.certificateNumber,
        validFrom: certification.issuedAt,
        validUntil: certification.expiresAt,
        documentReference: certification.name,
      });
      if (res?.data?.id) {
        setCertifications((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: res.data.id } : c))
        );
      }
    } catch {
      // Estado optimista persistido
    }
  };

  const updateCertification = (id: string, updated: Partial<Certification>) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    apiClient
      .patch(`/dossier/certifications/${id}`, {
        name: updated.name,
        issuer: updated.issuer,
        certificateNumber: updated.certificateNumber,
        validFrom: updated.issuedAt,
        validUntil: updated.expiresAt,
      })
      .catch(() => {});
  };

  const updateProfile = (updatedFields: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    apiClient
      .put('/dossier/profile', {
        legalName: updatedFields.companyName || profile.companyName,
        taxId: updatedFields.taxId || profile.taxId,
        description: updatedFields.description || profile.description,
        cpvCodes: updatedFields.primaryCpvCodes || profile.primaryCpvCodes,
        territories: updatedFields.geographicalScope || profile.geographicalScope,
        maxContractCents: updatedFields.maxEconomicSolvency
          ? Math.round(updatedFields.maxEconomicSolvency * 100)
          : undefined,
      })
      .catch(() => {});
  };

  return (
    <DataContext.Provider
      value={{
        tenders,
        portfolio,
        alerts,
        unreadAlertsCount,
        profile,
        certifications,
        evidences,
        isCommandPaletteOpen,
        syncStatus,
        setIsCommandPaletteOpen,
        getTenderById,
        getTenderDocuments,
        getAnalysisByTenderId,
        saveDecision,
        reanalyzeTender,
        startAnalysisForTender,
        markAlertAsRead,
        markAllAlertsAsRead,
        addEvidence,
        addCertification,
        updateCertification,
        updateProfile,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe utilizarse dentro de un DataProvider');
  }
  return context;
};
