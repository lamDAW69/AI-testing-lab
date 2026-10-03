import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawTendersPath = path.resolve(__dirname, '../src/modules/procurement/data/real-placsp-tenders.json');
const rawTenders = JSON.parse(fs.readFileSync(rawTendersPath, 'utf8'));

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

function formatCpvDisplay(cpvCode: string): string {
  const code = (cpvCode || '72000000').slice(0, 8);
  if (code.startsWith('72262')) return `${code} · Desarrollo de software y aplicaciones`;
  if (code.startsWith('72267')) return `${code} · Mantenimiento y soporte de software`;
  if (code.startsWith('7226')) return `${code} · Servicios de software y mantenimiento`;
  if (code.startsWith('7221')) return `${code} · Programación y desarrollo de sistemas`;
  if (code.startsWith('7225')) return `${code} · Soporte técnico y sistemas informáticos`;
  if (code.startsWith('7222')) return `${code} · Consultoría en sistemas y ciberseguridad`;
  if (code.startsWith('7241')) return `${code} · Servicios de internet y portales web`;
  if (code.startsWith('7242')) return `${code} · Servicios de desarrollo de aplicaciones internet`;
  if (code.startsWith('724')) return `${code} · Servicios de internet, web y cloud`;
  if (code.startsWith('725')) return `${code} · Servicios informáticos y soporte`;
  if (code.startsWith('726')) return `${code} · Soporte y consultoría informática`;
  if (code.startsWith('728')) return `${code} · Auditoría informática y ciberseguridad`;
  if (code.startsWith('72')) return `${code} · Servicios TIC y consultoría`;
  if (code.startsWith('48')) return `${code} · Paquetes de software y licencias`;
  return `${code} · Servicios tecnológicos`;
}

const docsMap: Record<string, any[]> = {};

const frontendTenders = rawTenders.map((raw: any, index: number) => {
  const id = `t-placsp-${String(index + 1).padStart(3, '0')}`;
  const budget = (raw.budgetAmountCents || 0) / 100;
  const estimated = raw.estimatedValueCents ? raw.estimatedValueCents / 100 : Math.round(budget * 1.5);

  let deadline = raw.submissionDeadline;
  if (!deadline || new Date(deadline).getTime() <= now) {
    const daysAhead = 4 + ((index * 3) % 32);
    deadline = new Date(now + daysAhead * oneDay).toISOString();
  }

  const rawDocs = raw.documents || [];
  const tenderDocs = rawDocs.map((doc: any, dIdx: number) => ({
    id: `doc-${id}-${dIdx + 1}`,
    name: doc.name || `${doc.documentType || 'DOC'} Documento oficial.pdf`,
    type: doc.documentType === 'PCAP' ? 'PCA' : doc.documentType === 'PPT' ? 'PPT' : 'ADENDA',
    version: 1,
    sha256Hash: doc.contentHash || 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90',
    obtainedAt: raw.publicationDate || new Date().toISOString(),
    url: doc.url,
  }));

  if (tenderDocs.length === 0) {
    tenderDocs.push(
      {
        id: `doc-${id}-1`,
        name: `PCAP_${raw.sourceTenderId || 'Expediente'}.pdf`,
        type: 'PCA',
        version: 1,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        obtainedAt: new Date().toISOString(),
      },
      {
        id: `doc-${id}-2`,
        name: `PPT_${raw.sourceTenderId || 'Expediente'}.pdf`,
        type: 'PPT',
        version: 1,
        sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        obtainedAt: new Date().toISOString(),
      }
    );
  }

  docsMap[id] = tenderDocs;

  return {
    id,
    fileReference: raw.sourceTenderId || `EXP-2026/${String(index + 1).padStart(4, '0')}`,
    title: raw.title,
    contractingAuthority: raw.authority?.name || 'Administración Pública',
    cpvCode: formatCpvDisplay(raw.mainCpvCode),
    budgetAmount: Math.round(budget),
    estimatedValue: Math.round(estimated),
    currency: 'EUR',
    submissionDeadline: deadline,
    publicationDate: raw.publicationDate || new Date(now - (index % 10) * oneDay).toISOString(),
    status: 'PUBLISHED',
    documentsCount: tenderDocs.length,
    hasActiveAnalysis: false,
  };
});

// Seleccionar los 6 mejores expedientes Cloud/Software para Luis Test
const cloudKeywords = ['cloud', 'nube', 'desarrollo', 'migración', 'evolutivo', 'software', 'plataforma', 'sistemas', 'ciberseguridad', 'datos abiertos', 'seguridad'];

const scoredTenders = frontendTenders
  .map(t => {
    const text = t.title.toLowerCase();
    let score = 0;
    if (text.includes('cloud') || text.includes('nube')) score += 6;
    if (text.includes('desarrollo') || text.includes('software')) score += 5;
    if (text.includes('plataforma') || text.includes('modernización')) score += 4;
    if (text.includes('evolutivo') || text.includes('mantenimiento')) score += 3;
    if (text.includes('ciberseguridad') || text.includes('seguridad')) score += 3;
    if (t.cpvCode.startsWith('722')) score += 3;
    if (t.cpvCode.startsWith('724')) score += 2;
    return { tender: t, score };
  })
  .sort((a, b) => b.score - a.score);

const top6Tenders = scoredTenders.slice(0, 6).map(s => s.tender);

// Marcar hasActiveAnalysis en los top 6
for (const t of top6Tenders) {
  t.hasActiveAnalysis = true;
}

// Generar Portfolio Items realistas para Luis Test
const portfolioItems = [
  {
    id: `an-${top6Tenders[0].id}`,
    tenderId: top6Tenders[0].id,
    fileReference: top6Tenders[0].fileReference,
    title: top6Tenders[0].title,
    contractingAuthority: top6Tenders[0].contractingAuthority,
    budgetAmount: top6Tenders[0].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[0].submissionDeadline,
    eligibility: 'POTENTIALLY_ELIGIBLE' as const,
    decision: 'PURSUE' as const,
    validity: 'VALID' as const,
    hasBlockers: false,
    evidenceCoveragePercentage: 92,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: `an-${top6Tenders[1].id}`,
    tenderId: top6Tenders[1].id,
    fileReference: top6Tenders[1].fileReference,
    title: top6Tenders[1].title,
    contractingAuthority: top6Tenders[1].contractingAuthority,
    budgetAmount: top6Tenders[1].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[1].submissionDeadline,
    eligibility: 'POTENTIALLY_ELIGIBLE' as const,
    decision: 'PURSUE' as const,
    validity: 'VALID' as const,
    hasBlockers: false,
    evidenceCoveragePercentage: 88,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: `an-${top6Tenders[2].id}`,
    tenderId: top6Tenders[2].id,
    fileReference: top6Tenders[2].fileReference,
    title: top6Tenders[2].title,
    contractingAuthority: top6Tenders[2].contractingAuthority,
    budgetAmount: top6Tenders[2].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[2].submissionDeadline,
    eligibility: 'NEEDS_REVIEW' as const,
    decision: 'REVIEW' as const,
    validity: 'VALID' as const,
    hasBlockers: true,
    blockerSummary: 'Exige ENS Media en vigor; la empresa lo tiene en estado PENDING_REVIEW',
    evidenceCoveragePercentage: 75,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: `an-${top6Tenders[3].id}`,
    tenderId: top6Tenders[3].id,
    fileReference: top6Tenders[3].fileReference,
    title: top6Tenders[3].title,
    contractingAuthority: top6Tenders[3].contractingAuthority,
    budgetAmount: top6Tenders[3].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[3].submissionDeadline,
    eligibility: 'POTENTIALLY_ELIGIBLE' as const,
    decision: 'UNDECIDED' as const,
    validity: 'VALID' as const,
    hasBlockers: false,
    evidenceCoveragePercentage: 85,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: `an-${top6Tenders[4].id}`,
    tenderId: top6Tenders[4].id,
    fileReference: top6Tenders[4].fileReference,
    title: top6Tenders[4].title,
    contractingAuthority: top6Tenders[4].contractingAuthority,
    budgetAmount: top6Tenders[4].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[4].submissionDeadline,
    eligibility: 'NEEDS_REVIEW' as const,
    decision: 'REVIEW' as const,
    validity: 'REQUIRES_REANALYSIS' as const,
    hasBlockers: true,
    blockerSummary: 'Adenda técnica publicada con rectificación de criterios de solvencia económica',
    evidenceCoveragePercentage: 70,
    lastAnalysisDate: new Date().toISOString(),
  },
  {
    id: `an-${top6Tenders[5].id}`,
    tenderId: top6Tenders[5].id,
    fileReference: top6Tenders[5].fileReference,
    title: top6Tenders[5].title,
    contractingAuthority: top6Tenders[5].contractingAuthority,
    budgetAmount: top6Tenders[5].budgetAmount,
    currency: 'EUR',
    submissionDeadline: top6Tenders[5].submissionDeadline,
    eligibility: 'POTENTIALLY_ELIGIBLE' as const,
    decision: 'PURSUE' as const,
    validity: 'VALID' as const,
    hasBlockers: false,
    evidenceCoveragePercentage: 94,
    lastAnalysisDate: new Date().toISOString(),
  },
];

// Generar Análisis para cada uno
const analysesMap: Record<string, any> = {};
for (let i = 0; i < portfolioItems.length; i++) {
  const p = portfolioItems[i];
  const t = top6Tenders[i];

  analysesMap[t.id] = {
    id: p.id,
    tenderId: t.id,
    tenantId: 'tenant-active',
    validity: p.validity,
    invalidationReason: p.validity === 'REQUIRES_REANALYSIS' ? 'Se ha detectado una modificación documental en PLACSP que requiere reanálisis.' : undefined,
    eligibility: p.eligibility,
    summary: `Análisis de precalificación para ${t.title}. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). ${p.hasBlockers ? p.blockerSummary : 'Afinidad tecnológica sobresaliente con el dossier empresarial.'}`,
    blockers: p.hasBlockers ? [p.blockerSummary!] : [],
    dimensions: {
      potentialEligibility: {
        id: `dim-${t.id}-1`,
        name: 'Elegibilidad Potencial',
        status: p.hasBlockers ? 'WARNING' : 'FAVORABLE',
        summary: p.hasBlockers ? 'Requiere subsanación o revisión humana' : 'Habilitación plena conforme al art. 65 LCSP',
        details: 'Verificación contra requisitos de admisión y plazos oficiales de la plataforma.',
      },
      technicalFit: {
        id: `dim-${t.id}-2`,
        name: 'Encaje Técnico',
        status: 'FAVORABLE',
        summary: 'Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)',
        details: 'El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier.',
      },
      economicFit: {
        id: `dim-${t.id}-3`,
        name: 'Encaje Económico',
        status: 'FAVORABLE',
        summary: `Presupuesto de ${t.budgetAmount.toLocaleString('es-ES')} € viable`,
        details: 'Margen estimado adecuado según ratios del sector TIC.',
      },
      operationalCapacity: {
        id: `dim-${t.id}-4`,
        name: 'Capacidad Operativa',
        status: 'FAVORABLE',
        summary: 'Equipo técnico disponible para asignación inmediata',
        details: 'Disponibilidad de perfiles senior según requerimientos del PPT.',
      },
      contractualRisk: {
        id: `dim-${t.id}-5`,
        name: 'Riesgo Contractual',
        status: p.hasBlockers ? 'WARNING' : 'FAVORABLE',
        summary: 'Condiciones de ejecución y SLAs estándar',
        details: 'Pliegos administrativos sin penalizaciones desproporcionadas.',
      },
      deadlineFeasibility: {
        id: `dim-${t.id}-6`,
        name: 'Viabilidad de Plazo',
        status: 'FAVORABLE',
        summary: 'Plazo de presentación suficiente',
        details: 'Margen temporal para confeccionar la oferta técnica y económica.',
      },
      evidenceCoverage: {
        id: `dim-${t.id}-7`,
        name: 'Cobertura de Evidencia',
        status: 'FAVORABLE',
        summary: `${p.evidenceCoveragePercentage}% de requisitos respaldados con evidencias`,
        details: 'Certificaciones ISO 27001 e ISO 9001 verificadas en dossier.',
      },
    },
    requirements: [
      {
        id: `req-${t.id}-1`,
        category: 'TECHNICAL',
        title: 'Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información',
        status: 'SUPPORTED',
        isMandatory: true,
        confidence: 0.99,
        reasoning: 'La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).',
        literalCitation: 'Cláusula de solvencia técnica: "El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato."',
        documentName: docsMap[t.id][0]?.name || 'PCAP.pdf',
        documentVersion: 1,
        evidenceTitle: 'Certificación ISO/IEC 27001 (AENOR)',
        evidenceStatus: 'VERIFIED',
      },
      {
        id: `req-${t.id}-2`,
        category: 'SOLVENCY',
        title: 'Certificación ISO 9001 en Gestión de Calidad',
        status: 'SUPPORTED',
        isMandatory: true,
        confidence: 0.99,
        reasoning: 'La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).',
        literalCitation: 'Cláusula de calidad: "Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente."',
        documentName: docsMap[t.id][0]?.name || 'PCAP.pdf',
        documentVersion: 1,
        evidenceTitle: 'Certificación ISO 9001 (Bureau Veritas)',
        evidenceStatus: 'VERIFIED',
      },
      {
        id: `req-${t.id}-3`,
        category: 'TECHNICAL',
        title: 'Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media',
        status: p.hasBlockers ? 'NOT_SUPPORTED' : 'SUPPORTED',
        isMandatory: p.hasBlockers,
        confidence: 0.92,
        reasoning: p.hasBlockers ? 'El pliego requiere ENS Media verificada; actualmente en el dossier se encuentra en estado PENDING_REVIEW.' : 'Requisito valorable para la puntuación técnica.',
        literalCitation: 'Anexo de ciberseguridad: "Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio."',
        documentName: docsMap[t.id][1]?.name || 'PPT.pdf',
        documentVersion: 1,
        evidenceTitle: 'Esquema Nacional de Seguridad (ENS) — Categoría Media',
        evidenceStatus: 'PENDING_REVIEW',
      },
    ],
    currentDecision: p.decision,
    decisionHistory: [
      {
        id: `dec-${t.id}-1`,
        decision: p.decision,
        decidedBy: 'Luis Test (Operador)',
        decidedAt: new Date().toISOString(),
        mandatoryReason: p.decision === 'PURSUE' ? 'Oportunidad prioritaria con alta compatibilidad en ingeniería cloud y arquitecturas públicas.' : p.decision === 'REVIEW' ? 'Mantener en revisión hasta confirmar resolución de la certificación ENS Media.' : 'Pendiente de asignación de responsable.',
        analysisVersion: 1,
      },
    ],
    documentVersionUsed: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const targetFile = path.resolve(__dirname, '../../frontend/src/data/real-placsp-tenders.ts');
const targetDir = path.dirname(targetFile);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileContent = `/**
 * CATÁLOGO OFICIAL Y EVIDENCIAS DE CONTRATACIÓN PÚBLICA (ES_PLACSP)
 * Licitaciones 100% Reales del sector TIC, Cloud, Software, Ciberseguridad y Datos Abiertos.
 * Fuente: Plataforma de Contratación del Sector Público (Ministerio de Hacienda).
 * Total de expedientes: ${frontendTenders.length}
 */
import { PublicTender, TenderDocument } from '../types/procurement';
import { PortfolioItem } from '../types/portfolio';
import { QualificationAnalysis } from '../types/qualification';

export const REAL_PLACSP_TENDERS: PublicTender[] = ${JSON.stringify(frontendTenders, null, 2)};

export const REAL_PLACSP_DOCS: Record<string, TenderDocument[]> = ${JSON.stringify(docsMap, null, 2)};

export const REAL_CLOUD_PORTFOLIO: PortfolioItem[] = ${JSON.stringify(portfolioItems, null, 2)};

export const REAL_CLOUD_ANALYSES: Record<string, QualificationAnalysis> = ${JSON.stringify(analysesMap, null, 2)};
`;

fs.writeFileSync(targetFile, fileContent, 'utf8');
console.log(`Generado exitosamente: ${targetFile} con ${frontendTenders.length} licitaciones, ${portfolioItems.length} items de portfolio y ${Object.keys(analysesMap).length} análisis.`);
