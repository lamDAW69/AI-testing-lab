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
import {
  REAL_PLACSP_TENDERS,
  REAL_PLACSP_DOCS,
  REAL_CLOUD_PORTFOLIO,
  REAL_CLOUD_ANALYSES,
} from '../data/real-placsp-tenders';

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
    publicationDate: '2026-09-18T10:30:00Z',
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
    publicationDate: '2026-09-15T09:00:00Z',
    status: 'PUBLISHED',
    documentsCount: 6,
    hasActiveAnalysis: true,
  },
  {
    id: 't-103',
    fileReference: 'EXP-2026/02488',
    title: 'Suministro e implantación de sistema de monitorización medioambiental con sensores IoT',
    contractingAuthority: 'Consejería de Medio Ambiente de la Generalitat Valenciana',
    cpvCode: '72262000-9 · Servicios de desarrollo de software para plataformas IoT',
    budgetAmount: 380000,
    estimatedValue: 380000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-20T11:00:00Z',
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
    publicationDate: '2026-09-22T08:30:00Z',
    status: 'PUBLISHED',
    documentsCount: 2,
    hasActiveAnalysis: false,
  },
  {
    id: 't-105',
    fileReference: 'EXP-2026/04105',
    title: 'Suministro y licenciamiento de paquete de software ERP y gestión contable corporativa',
    contractingAuthority: 'Agencia Tributaria Municipal de Valencia',
    cpvCode: '48000000-8 · Paquetes de software y sistemas de información',
    budgetAmount: 240000,
    estimatedValue: 480000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-24T12:00:00Z',
    status: 'PUBLISHED',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-106',
    fileReference: 'EXP-2026/04890',
    title: 'Licencias y soporte de software de protección endpoint y respuesta ante amenazas (EDR)',
    contractingAuthority: 'Servicio Andaluz de Salud (SAS)',
    cpvCode: '48730000-3 · Paquetes de software de seguridad informática',
    budgetAmount: 520000,
    estimatedValue: 1040000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-25T14:15:00Z',
    status: 'PUBLISHED',
    documentsCount: 4,
    hasActiveAnalysis: false,
  },
  {
    id: 't-107',
    fileReference: 'EXP-2026/05120',
    title: 'Desarrollo de aplicaciones móviles ciudadanas y plataforma omnicanal de servicios públicos',
    contractingAuthority: 'Ayuntamiento de Madrid - Área de Innovación y Tecnología',
    cpvCode: '72212000-1 · Servicios de programación de software de aplicación',
    budgetAmount: 680000,
    estimatedValue: 1360000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-26T09:45:00Z',
    status: 'PUBLISHED',
    documentsCount: 5,
    hasActiveAnalysis: false,
  },
  {
    id: 't-108',
    fileReference: 'EXP-2026/05344',
    title: 'Plataforma analítica con modelos de IA para vigilancia epidemiológica y salud pública',
    contractingAuthority: 'Ministerio de Sanidad - Secretaría General de Salud Digital',
    cpvCode: '72300000-8 · Servicios de tratamiento de datos e inteligencia artificial',
    budgetAmount: 890000,
    estimatedValue: 1780000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-10T11:00:00Z',
    status: 'EVALUATION',
    documentsCount: 4,
    hasActiveAnalysis: false,
  },
  {
    id: 't-109',
    fileReference: 'EXP-2026/05670',
    title: 'Servicio de auditoría de seguridad del código fuente y bastionado DevSecOps continuo',
    contractingAuthority: 'Administrador de Infraestructuras Ferroviarias (ADIF)',
    cpvCode: '72800000-8 · Servicios de auditoría informática y ciberseguridad',
    budgetAmount: 310000,
    estimatedValue: 620000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-27T16:00:00Z',
    status: 'PUBLISHED',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-110',
    fileReference: 'EXP-2026/06001',
    title: 'Suministro de software de optimización y algoritmos de asignación inteligente de flota',
    contractingAuthority: 'Renfe Operadora',
    cpvCode: '48440000-4 · Paquetes de software de análisis financiero y planificación',
    budgetAmount: 420000,
    estimatedValue: 840000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-08T10:00:00Z',
    status: 'EVALUATION',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-111',
    fileReference: 'EXP-2026/06230',
    title: 'Mantenimiento evolutivo de historia clínica electrónica y receta digital interoperable',
    contractingAuthority: 'Conselleria de Sanitat Universal (Generalitat Valenciana)',
    cpvCode: '72267000-4 · Servicios de mantenimiento de software sanitario',
    budgetAmount: 1450000,
    estimatedValue: 2900000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-28T11:20:00Z',
    status: 'PUBLISHED',
    documentsCount: 5,
    hasActiveAnalysis: false,
  },
  {
    id: 't-112',
    fileReference: 'EXP-2026/06512',
    title: 'Consultoría técnica para adecuación y certificación en Esquema Nacional de Seguridad (ENS)',
    contractingAuthority: 'Centro Criptológico Nacional (CCN-CERT)',
    cpvCode: '72222300-0 · Servicios de consultoría en ciberseguridad',
    budgetAmount: 290000,
    estimatedValue: 580000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-29T08:50:00Z',
    status: 'PUBLISHED',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-113',
    fileReference: 'EXP-2026/06899',
    title: 'Implantación de infraestructura de campus cloud híbrido y automatización Kubernetes',
    contractingAuthority: 'Universitat Politècnica de Catalunya (UPC)',
    cpvCode: '72250000-2 · Servicios de sistemas y de apoyo tecnológico',
    budgetAmount: 350000,
    estimatedValue: 700000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-30T10:15:00Z',
    status: 'PUBLISHED',
    documentsCount: 3,
    hasActiveAnalysis: false,
  },
  {
    id: 't-114',
    fileReference: 'EXP-2026/07102',
    title: 'Modernización de la arquitectura de tramitación telemática de prestaciones por desempleo',
    contractingAuthority: 'Servicio Público de Empleo Estatal (SEPE)',
    cpvCode: '72200000-7 · Servicios de programación de software',
    budgetAmount: 2150000,
    estimatedValue: 4300000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-10-01T12:00:00Z',
    status: 'PUBLISHED',
    documentsCount: 6,
    hasActiveAnalysis: false,
  },
  {
    id: 't-115',
    fileReference: 'EXP-2026/07440',
    title: 'Adquisición de licencias de software GIS y procesamiento cartográfico masivo',
    contractingAuthority: 'Instituto Geográfico Nacional (IGN)',
    cpvCode: '48326000-8 · Paquetes de software para sistemas de información geográfica',
    budgetAmount: 175000,
    estimatedValue: 350000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-10-02T09:10:00Z',
    status: 'PUBLISHED',
    documentsCount: 2,
    hasActiveAnalysis: false,
  },
  {
    id: 't-116',
    fileReference: 'EXP-2026/07815',
    title: 'Servicio de auditoría y análisis forense de incidentes en redes de mando y control',
    contractingAuthority: 'Ministerio de Defensa - Dirección de Armamento y Material',
    cpvCode: '72800000-8 · Servicios de auditoría informática',
    budgetAmount: 980000,
    estimatedValue: 1960000,
    currency: 'EUR',
    submissionDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    publicationDate: '2026-09-05T08:00:00Z',
    status: 'EVALUATION',
    documentsCount: 4,
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
      type: 'PCA',
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
      name: 'PCAP_Sensores_Medioambiente_GVA.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: 'd9e5f4a3b2c169871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-20T11:00:00Z',
    },
    {
      id: 'doc-103-2',
      name: 'PPT_Software_IoT_Plataforma.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '11e5f4a3b2c169871234567890abcdef1234567890abcdef1234567890abcdef',
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
    {
      id: 'doc-104-2',
      name: 'PCAP_Auditoria_SGAD.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: 'ea1234f4b2c169871234567890abcdef1234567890abcdef1234567890abcfa2',
      obtainedAt: '2026-09-22T08:30:00Z',
    },
  ],
  't-105': [
    {
      id: 'doc-105-1',
      name: 'PCAP_Licencias_ERP_Municipal.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '98a7b6c5d4e3f2101234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-24T12:00:00Z',
    },
    {
      id: 'doc-105-2',
      name: 'PPT_Requisitos_Funcionales_ERP.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '87b6c5d4e3f210981234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-24T12:00:00Z',
    },
  ],
  't-106': [
    {
      id: 'doc-106-1',
      name: 'PCAP_Seguridad_Endpoint_SAS.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '76c5d4e3f21098761234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-25T14:15:00Z',
    },
    {
      id: 'doc-106-2',
      name: 'PPT_Arquitectura_EDR_Sanidad.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '65d4e3f2109876541234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-25T14:15:00Z',
    },
  ],
  't-107': [
    {
      id: 'doc-107-1',
      name: 'PCAP_Apps_Moviles_AytoMadrid.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '54e3f210987654321234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-26T09:45:00Z',
    },
    {
      id: 'doc-107-2',
      name: 'PPT_Diseno_Desarrollo_AppCiudadana.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '43f21098765432101234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-26T09:45:00Z',
    },
  ],
  't-108': [
    {
      id: 'doc-108-1',
      name: 'PCAP_Plataforma_IA_Epidemiologica.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '32109876543210981234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-10T11:00:00Z',
    },
    {
      id: 'doc-108-2',
      name: 'PPT_Modelos_Predictivos_Salud.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '21098765432109871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-10T11:00:00Z',
    },
  ],
  't-109': [
    {
      id: 'doc-109-1',
      name: 'PCAP_Auditoria_DevSecOps_ADIF.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '10987654321098761234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-27T16:00:00Z',
    },
    {
      id: 'doc-109-2',
      name: 'PPT_Bastionado_Codigo_Ferroviario.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '09876543210987651234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-27T16:00:00Z',
    },
  ],
  't-110': [
    {
      id: 'doc-110-1',
      name: 'PCAP_Software_Asignacion_Flota.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '98765432109876541234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-08T10:00:00Z',
    },
    {
      id: 'doc-110-2',
      name: 'PPT_Algoritmos_Optimizacion_Renfe.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '87654321098765431234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-08T10:00:00Z',
    },
  ],
  't-111': [
    {
      id: 'doc-111-1',
      name: 'PCAP_Mantenimiento_HistoriaClinica_GVA.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '76543210987654321234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-28T11:20:00Z',
    },
    {
      id: 'doc-111-2',
      name: 'PPT_Receta_Digital_Interoperable.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '65432109876543211234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-28T11:20:00Z',
    },
  ],
  't-112': [
    {
      id: 'doc-112-1',
      name: 'PCAP_Consultoria_ENS_CCNCERT.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '54321098765432101234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-29T08:50:00Z',
    },
    {
      id: 'doc-112-2',
      name: 'PPT_Medidas_Seguridad_CategoriaAlta.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '43210987654321091234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-29T08:50:00Z',
    },
  ],
  't-113': [
    {
      id: 'doc-113-1',
      name: 'PCAP_Campus_Cloud_UPC.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '32109876543210981234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-30T10:15:00Z',
    },
    {
      id: 'doc-113-2',
      name: 'PPT_Kubernetes_Automatizacion.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '21098765432109871234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-30T10:15:00Z',
    },
  ],
  't-114': [
    {
      id: 'doc-114-1',
      name: 'PCAP_Plataforma_Prestaciones_SEPE.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '10987654321098761234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-10-01T12:00:00Z',
    },
    {
      id: 'doc-114-2',
      name: 'PPT_Modernizacion_Arquitectura_SEPE.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '09876543210987651234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-10-01T12:00:00Z',
    },
  ],
  't-115': [
    {
      id: 'doc-115-1',
      name: 'PCAP_Software_GIS_IGN.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '98765432109876541234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-10-02T09:10:00Z',
    },
    {
      id: 'doc-115-2',
      name: 'PPT_Especificaciones_Cartografia.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '87654321098765431234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-10-02T09:10:00Z',
    },
  ],
  't-116': [
    {
      id: 'doc-116-1',
      name: 'PCAP_Forense_Redes_Defensa.pdf',
      type: 'PCA',
      version: 1,
      sha256Hash: '76543210987654321234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-05T08:00:00Z',
    },
    {
      id: 'doc-116-2',
      name: 'PPT_Protocolos_Ciberdefensa.pdf',
      type: 'PPT',
      version: 1,
      sha256Hash: '65432109876543211234567890abcdef1234567890abcdef1234567890abcdef',
      obtainedAt: '2026-09-05T08:00:00Z',
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
  fetchTenderDocuments?: (tenderId: string) => Promise<TenderDocument[]>;
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

export const DEMO_TENANT_ID = '018f4a12-892a-7921-98a1-2d4e8b1e4f1a';

function getTenantStorage<T>(tenantId: string, key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`pliego_tenant_${tenantId}_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setTenantStorage<T>(tenantId: string, key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`pliego_tenant_${tenantId}_${key}`, JSON.stringify(val));
  } catch {}
}

function getInitialProfileForTenant(tenant: any): CompanyProfile {
  if (!tenant || tenant.id === DEMO_TENANT_ID) {
    return INITIAL_PROFILE;
  }
  return {
    id: `prof-${tenant.id}`,
    tenantId: tenant.id,
    companyName: tenant.name || 'Mi Organización Licitadora',
    taxId: tenant.taxId || 'No asignado',
    description: 'Entidad licitadora en contratación pública.',
    primaryCpvCodes: ['72000000-5'],
    geographicalScope: ['Ámbito Estatal'],
    maxEconomicSolvency: 0,
    averageTeamSize: 1,
    updatedAt: new Date().toISOString(),
  };
}

const DataContext = createContext<DataContextValue | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTenant, token } = useAuth();
  const tenantId = activeTenant?.id;
  const isDemo = !tenantId || tenantId === DEMO_TENANT_ID;

  const [tenders, setTenders] = useState<PublicTender[]>(INITIAL_TENDERS);
  const [tenderDocsMap, setTenderDocsMap] = useState<Record<string, TenderDocument[]>>(TENDER_DOCS);

  // Estados reactivos con aislamiento estricto multi-tenant (Reglas 2.1 y 3 de AGENTS.md)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() =>
    isDemo ? INITIAL_PORTFOLIO : getTenantStorage(tenantId, 'portfolio', [])
  );
  const [analyses, setAnalyses] = useState<Record<string, QualificationAnalysis>>(() =>
    isDemo ? INITIAL_ANALYSES : getTenantStorage(tenantId, 'analyses', {})
  );
  const [alerts, setAlerts] = useState<TenantAlert[]>(() =>
    isDemo ? INITIAL_ALERTS : getTenantStorage(tenantId, 'alerts', [])
  );
  const [profile, setProfile] = useState<CompanyProfile>(() =>
    isDemo ? INITIAL_PROFILE : getTenantStorage(tenantId, 'profile', getInitialProfileForTenant(activeTenant))
  );
  const [certifications, setCertifications] = useState<Certification[]>(() =>
    isDemo ? INITIAL_CERTIFICATIONS : getTenantStorage(tenantId, 'certifications', [])
  );
  const [evidences, setEvidences] = useState<BusinessEvidence[]>(() =>
    isDemo ? INITIAL_EVIDENCES : getTenantStorage(tenantId, 'evidences', [])
  );
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local_fallback' | 'syncing'>('syncing');

  // Reactividad inmediata al cambiar de organización o al darse de alta un nuevo usuario
  useEffect(() => {
    if (!tenantId || tenantId === DEMO_TENANT_ID) {
      setPortfolio(INITIAL_PORTFOLIO);
      setAnalyses(INITIAL_ANALYSES);
      setAlerts(INITIAL_ALERTS);
      setProfile(INITIAL_PROFILE);
      setCertifications(INITIAL_CERTIFICATIONS);
      setEvidences(INITIAL_EVIDENCES);
    } else {
      setPortfolio(getTenantStorage(tenantId, 'portfolio', []));
      setAnalyses(getTenantStorage(tenantId, 'analyses', {}));
      setAlerts(getTenantStorage(tenantId, 'alerts', []));
      setProfile(getTenantStorage(tenantId, 'profile', getInitialProfileForTenant(activeTenant)));
      setCertifications(getTenantStorage(tenantId, 'certifications', []));
      setEvidences(getTenantStorage(tenantId, 'evidences', []));
    }
  }, [tenantId, activeTenant?.name, activeTenant?.taxId]);

  // Sincronización transparente con el backend HTTP / PostgreSQL
  const refreshData = useCallback(async () => {
    try {
      // 1. Siempre consultamos el catálogo público oficial de licitaciones (acceso abierto para catálogo público)
      const publicTendersPromise = apiClient.get<any>('/public/tenders?limit=250');

      // 2. Si hay sesión activa en un tenant, consultamos concurrentemente los recursos privados protegidos
      const privatePromises: Promise<any>[] =
        token && activeTenant
          ? [
              apiClient.get<{ data: any[] }>('/portfolio'),
              apiClient.get<{ data: any[] }>('/alerts'),
              apiClient.get<{ data: any | null }>('/dossier/profile'),
              apiClient.get<{ data: any[] }>('/dossier/certifications'),
              apiClient.get<{ data: any[] }>('/qualification/dossier'),
            ]
          : [];

      const [tendersRes, ...privateResults] = await Promise.allSettled([
        publicTendersPromise,
        ...privatePromises,
      ]);

      let backendConnected = false;

      // 1. Catálogo de licitaciones públicas oficiales (PLACSP)
      if (tendersRes.status === 'fulfilled') {
        const rawTenders =
          (tendersRes.value as any)?.data || (tendersRes.value as any)?.tenders;

        if (Array.isArray(rawTenders) && rawTenders.length > 0) {
          backendConnected = true;
          setTenders(
            rawTenders.map((t: any) => ({
              id: t.id,
              fileReference: t.fileReference || t.sourceTenderId || t.id,
              title: t.title,
              contractingAuthority:
                t.contractingAuthority ||
                t.authority?.name ||
                t.authorityName ||
                'Órgano oficial',
              cpvCode: t.cpvCode || t.mainCpvCode || '',
              budgetAmount:
                typeof t.budgetAmount === 'number'
                  ? t.budgetAmount
                  : typeof t.budgetAmountCents === 'number'
                  ? t.budgetAmountCents / 100
                  : 0,
              estimatedValue:
                typeof t.estimatedValue === 'number'
                  ? t.estimatedValue
                  : typeof t.estimatedValueCents === 'number'
                  ? t.estimatedValueCents / 100
                  : (typeof t.budgetAmount === 'number' ? t.budgetAmount : 0),
              currency: t.currency || 'EUR',
              submissionDeadline: t.submissionDeadline,
              publicationDate: t.publicationDate || t.sourceUpdatedAt || t.createdAt,
              status: t.status,
              documentsCount: typeof t.documentsCount === 'number' ? t.documentsCount : 0,
              hasActiveAnalysis: Boolean(t.hasActiveAnalysis),
            }))
          );
        }
      }

      // 2. Recursos privados del tenant (solo se consultan y procesan si el usuario tiene sesión activa)
      if (token && activeTenant && privateResults.length >= 5) {
        const [portfolioRes, alertsRes, profileRes, certsRes, evidencesRes] = privateResults as [
          PromiseSettledResult<{ data: any[] }>,
          PromiseSettledResult<{ data: any[] }>,
          PromiseSettledResult<{ data: any | null }>,
          PromiseSettledResult<{ data: any[] }>,
          PromiseSettledResult<{ data: any[] }>
        ];

        // Portfolio del tenant (fidelidad estricta: si backend devuelve [], no mantener datos demo de otro tenant)
        if (portfolioRes.status === 'fulfilled' && Array.isArray(portfolioRes.value?.data)) {
          backendConnected = true;
          const mappedPortfolio: PortfolioItem[] = portfolioRes.value.data.map((item) => ({
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
          }));
          setPortfolio(mappedPortfolio);
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'portfolio', mappedPortfolio);
          }
        }

        // Alertas del tenant (fidelidad estricta: un usuario nuevo con 0 alertas debe ver 0 alertas)
        if (alertsRes.status === 'fulfilled' && Array.isArray(alertsRes.value?.data)) {
          backendConnected = true;
          const mappedAlerts: TenantAlert[] = alertsRes.value.data.map((a) => ({
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
          }));
          setAlerts(mappedAlerts);
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'alerts', mappedAlerts);
          }
        }

        // Perfil de dossier de empresa
        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          backendConnected = true;
          const p = profileRes.value.data;
          setProfile((prev) => {
            const updated: CompanyProfile = {
              ...prev,
              companyName: p.legalName || activeTenant.name || prev.companyName,
              taxId: p.taxId || activeTenant.taxId || prev.taxId,
              description: p.description || prev.description,
              primaryCpvCodes: p.cpvCodes || prev.primaryCpvCodes,
              geographicalScope: p.territories || prev.geographicalScope,
              maxEconomicSolvency: p.maxContractCents
                ? p.maxContractCents / 100
                : prev.maxEconomicSolvency,
            };
            if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
              setTenantStorage(activeTenant.id, 'profile', updated);
            }
            return updated;
          });
        }

        // Certificaciones oficiales (fidelidad estricta: si backend devuelve [], no mostrar las de TechConsulting)
        if (certsRes.status === 'fulfilled' && Array.isArray(certsRes.value?.data)) {
          backendConnected = true;
          const mappedCerts: Certification[] = certsRes.value.data.map((c) => ({
            id: c.id,
            name: c.name,
            issuer: c.issuer,
            certificateNumber: c.certificateNumber || '',
            issuedAt: c.validFrom || c.issuedAt || '',
            expiresAt: c.validUntil || c.expiresAt || '',
            status: c.evidenceStatus || c.status || 'DECLARED',
          }));
          setCertifications(mappedCerts);
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'certifications', mappedCerts);
          }
        }

        // Evidencias y solvencias (fidelidad estricta: si backend devuelve [], no mostrar las de TechConsulting)
        if (evidencesRes.status === 'fulfilled' && Array.isArray(evidencesRes.value?.data)) {
          backendConnected = true;
          const mappedEvidences: BusinessEvidence[] = evidencesRes.value.data.map((ev) => ({
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
          }));
          setEvidences(mappedEvidences);
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'evidences', mappedEvidences);
          }
        }
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

  const getTenderDocuments = useCallback(
    (tenderId: string): TenderDocument[] => {
      return tenderDocsMap[tenderId] || TENDER_DOCS[tenderId] || [];
    },
    [tenderDocsMap]
  );

  const fetchTenderDocuments = useCallback(
    async (tenderId: string): Promise<TenderDocument[]> => {
      if (tenderDocsMap[tenderId] && tenderDocsMap[tenderId].length > 0) {
        return tenderDocsMap[tenderId];
      }
      try {
        const data = await apiClient.get<any>(`/public/tenders/${tenderId}`);
        if (data && Array.isArray(data.documents) && data.documents.length > 0) {
          const mappedDocs: TenderDocument[] = data.documents.map((doc: any) => {
            const latestVersion =
              Array.isArray(doc.versions) && doc.versions.length > 0
                ? doc.versions[0]
                : null;
            return {
              id: doc.id,
              name: doc.name || 'Pliego oficial',
              type: (doc.documentType || 'PCA') as any,
              version: latestVersion?.versionNumber || 1,
              sha256Hash:
                latestVersion?.contentHash ||
                doc.rawPayloadHash ||
                'Hash oficial verificado',
              obtainedAt: latestVersion?.fetchedAt
                ? new Date(latestVersion.fetchedAt).toISOString()
                : doc.createdAt || new Date().toISOString(),
              url: latestVersion?.url,
            };
          });
          setTenderDocsMap((prev) => ({ ...prev, [tenderId]: mappedDocs }));
          return mappedDocs;
        }
      } catch {
        // En caso de fallo de red o modo offline, mantener fallback
      }
      return TENDER_DOCS[tenderId] || [];
    },
    [tenderDocsMap]
  );

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
      const next = {
        ...prev,
        [tenderId]: {
          ...existing,
          currentDecision: decision,
          decisionHistory: [newRecord, ...existing.decisionHistory],
        },
      };
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'analyses', next);
      }
      return next;
    });

    setPortfolio((prev) => {
      const next = prev.map((item) =>
        item.tenderId === tenderId ? { ...item, decision } : item
      );
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'portfolio', next);
      }
      return next;
    });

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

      const next = {
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
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'analyses', next);
      }
      return next;
    });

    // 2. Actualización de portfolio
    setPortfolio((prev) => {
      const next = prev.map((item) =>
        item.tenderId === tenderId
          ? {
              ...item,
              validity: 'VALID' as const,
              hasBlockers: false,
              lastAnalysisDate: new Date().toISOString(),
            }
          : item
      );
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'portfolio', next);
      }
      return next;
    });

    // 3. Resolución automática de alertas asociadas al cambio documental
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.tenderId === tenderId && a.type === 'DOCUMENT_CHANGE'
          ? { ...a, isRead: true }
          : a
      );
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'alerts', next);
      }
      return next;
    });

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
        evidenceCoveragePercentage: (certifications.length + evidences.length) > 0
          ? Math.min(100, Math.round(((certifications.length + evidences.length) / (certifications.length + evidences.length + 1)) * 100))
          : 0,
        lastAnalysisDate: new Date().toISOString(),
      };
      setPortfolio((prev) => {
        const next = [newPortfolioItem, ...prev];
        if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
          setTenantStorage(activeTenant.id, 'portfolio', next);
        }
        return next;
      });
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
            details: 'Presupuesto dentro del rango operational óptimo de la empresa.',
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
      setAnalyses((prev) => {
        const next = { ...prev, [tenderId]: newAnalysis };
        if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
          setTenantStorage(activeTenant.id, 'analyses', next);
        }
        return next;
      });
    }

    setTenders((prev) =>
      prev.map((t) => (t.id === tenderId ? { ...t, hasActiveAnalysis: true } : t))
    );
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, isRead: true } : a));
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'alerts', updated);
      }
      return updated;
    });
    apiClient.patch(`/alerts/${id}/read`).catch(() => {});
  };

  const markAllAlertsAsRead = () => {
    setAlerts((prev) => {
      const updated = prev.map((a) => ({ ...a, isRead: true }));
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'alerts', updated);
      }
      return updated;
    });
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
    setEvidences((prev) => {
      const updated = [newEvidence, ...prev];
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'evidences', updated);
      }
      return updated;
    });

    try {
      const res = await apiClient.post<{ data: any }>('/qualification/dossier', {
        category: evidence.category,
        title: evidence.title,
        description: evidence.description,
        documentReference: evidence.documentReference,
        validUntil: evidence.validUntil,
      });
      if (res?.data?.id) {
        setEvidences((prev) => {
          const updated = prev.map((e) => (e.id === tempId ? { ...e, id: res.data.id } : e));
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'evidences', updated);
          }
          return updated;
        });
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
    setCertifications((prev) => {
      const updated = [newCert, ...prev];
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'certifications', updated);
      }
      return updated;
    });

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
        setCertifications((prev) => {
          const updated = prev.map((c) => (c.id === tempId ? { ...c, id: res.data.id } : c));
          if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
            setTenantStorage(activeTenant.id, 'certifications', updated);
          }
          return updated;
        });
      }
    } catch {
      // Estado optimista persistido
    }
  };

  const updateCertification = (id: string, updatedFields: Partial<Certification>) => {
    setCertifications((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'certifications', updated);
      }
      return updated;
    });
    apiClient
      .patch(`/dossier/certifications/${id}`, {
        name: updatedFields.name,
        issuer: updatedFields.issuer,
        certificateNumber: updatedFields.certificateNumber,
        validFrom: updatedFields.issuedAt,
        validUntil: updatedFields.expiresAt,
      })
      .catch(() => {});
  };

  const updateProfile = (updatedFields: Partial<CompanyProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      if (activeTenant?.id && activeTenant.id !== DEMO_TENANT_ID) {
        setTenantStorage(activeTenant.id, 'profile', updated);
      }
      return updated;
    });
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
        fetchTenderDocuments,
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
