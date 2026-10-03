import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Check,
  Eye,
  Trash2,
  ChevronDown,
  Quote,
  ShieldAlert,
  Clock,
  History,
  Sparkles,
  Layers,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AnimatedTabs, TabItem } from '../components/ui/AnimatedTabs';
import {
  EligibilityBadge,
  DecisionBadge,
  ValidityBadge,
} from '../components/ui/Badge';
import { formatCurrency, formatDate, formatDeadlineDays, formatDateTime } from '../lib/formatters';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import {
  QualificationAnalysis,
  HumanDecision,
  EvaluatedRequirement,
} from '../types/qualification';

const DEMO_ANALYSIS: QualificationAnalysis = {
  id: '018f4a12-892a-7921-98a1-2d4e8b1e4f99',
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
};

export const AnalysisDetailPage: React.FC = () => {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const { canPerformAction, user } = useAuth();
  const {
    getAnalysisByTenderId,
    getTenderById,
    saveDecision,
    reanalyzeTender,
    startAnalysisForTender,
  } = useData();

  const activeTenderId = tenderId || 't-101';
  const currentTender = getTenderById(activeTenderId);
  const rawAnalysis = getAnalysisByTenderId(activeTenderId);

  // Si no hay análisis en memoria, se utiliza DEMO_ANALYSIS como previsualización de consulta
  const analysis = rawAnalysis || DEMO_ANALYSIS;

  const [activeTab, setActiveTab] = useState<string>('dimensiones');
  const [expandedRequirementId, setExpandedRequirementId] = useState<string | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedDecisionType, setSelectedDecisionType] = useState<HumanDecision>('PURSUE');
  const [decisionReason, setDecisionReason] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalysisSuccessMessage, setReanalysisSuccessMessage] = useState<string | null>(null);

  const canDecide = canPerformAction('decide');
  const canAnalyze = canPerformAction('analyze');

  const openDecisionModal = (decision: HumanDecision) => {
    setSelectedDecisionType(decision);
    setDecisionReason('');
    setIsDecisionModalOpen(true);
  };

  const submitDecision = async () => {
    if (decisionReason.trim().length < 5) return;
    setIsSubmittingDecision(true);
    await saveDecision(
      analysis.tenderId,
      selectedDecisionType,
      decisionReason,
      user?.fullName || 'Luis Méndez'
    );
    setIsSubmittingDecision(false);
    setIsDecisionModalOpen(false);
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    await reanalyzeTender(analysis.tenderId);
    setIsReanalyzing(false);
    setReanalysisSuccessMessage(
      'Reanálisis completado: Se ha integrado la Adenda Aclaratoria v2 de la PLACSP y recalculado las 7 dimensiones operativas con 0 bloqueos.'
    );
  };

  const tabs: TabItem[] = [
    {
      id: 'dimensiones',
      label: '7 Dimensiones Operativas',
      icon: <Layers className="w-3.5 h-3.5" />,
      badge: '7',
    },
    {
      id: 'requisitos',
      label: 'Requisitos y Auditoría',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
      badge: analysis.requirements.length,
      badgeVariant: analysis.requirements.some((r) => r.status === 'NOT_SUPPORTED')
        ? 'rose'
        : 'default',
    },
    {
      id: 'decisiones',
      label: 'Decisión del Equipo',
      icon: <History className="w-3.5 h-3.5" />,
      badge: analysis.decisionHistory.length,
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Botón Volver al Portfolio */}
      <Link
        to="/app/portfolio"
        className="inline-flex items-center gap-1.5 text-xs text-[#68656A] hover:text-[#161616] font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Portfolio</span>
      </Link>

      {/* Banner de confirmación tras reanálisis exitoso */}
      {reanalysisSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[16px] bg-[#10b981]/10 border border-[#10b981]/30 text-[#6ee7b7] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-[#1E7E51] shadow-2xs border border-[#B6F0D3]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#161616]">
                Expediente actualizado a la versión documental v2
              </p>
              <p className="text-xs text-[#68656A] leading-relaxed pt-0.5">
                {reanalysisSuccessMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReanalysisSuccessMessage(null)}
            className="text-xs font-semibold text-[#1E7E51] hover:underline shrink-0"
          >
            Entendido
          </button>
        </motion.div>
      )}

      {/* ZONA 1 — ESTADO CRÍTICO (A TODO LO ANCHO) SEGÚN SECCIÓN 13 */}
      {analysis.validity === 'REQUIRES_REANALYSIS' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-[16px] bg-[#D93838]/12 border border-[#D93838]/35 text-[#ff8585] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white text-[#D93838] shrink-0 mt-0.5 shadow-2xs border border-[#FCD2D2]">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#161616]">
                  Este análisis necesita actualizarse
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-mono text-[#D93838] border border-[#FCD2D2] font-bold">
                  Versión analizada: v{analysis.documentVersionUsed} | Versión actual: v2
                </span>
              </div>
              <p className="text-xs text-[#68656A] leading-relaxed max-w-3xl">
                {analysis.invalidationReason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/app/oportunidades/${activeTenderId}`)}
            >
              Ver Cambios
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              isLoading={isReanalyzing}
              disabled={!canAnalyze}
              onClick={handleReanalyze}
            >
              Reanalizar con v2
            </Button>
          </div>
        </motion.div>
      )}

      {/* ZONA 2 — CONCLUSIÓN OPERATIVA (GLASS FLOTANTE ELEVADO) */}
      <div className="p-6 sm:p-7 rounded-[24px] bg-white/75 backdrop-blur-[24px] border border-white/80 shadow-[0_12px_40px_rgba(20,20,30,0.06)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-[8px] bg-[#EEEAE5] text-[#161616] font-bold">
              {currentTender?.fileReference || 'EXP-2026/00941'}
            </span>
            <EligibilityBadge status={analysis.eligibility} />
            <DecisionBadge decision={analysis.currentDecision} />
            <span className="text-xs font-mono text-[#8F8B92]">
              Documentos base: v{analysis.documentVersionUsed}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161616] tracking-tight leading-snug">
            {currentTender?.title || 'Precalificación Explicable'}
          </h1>

          <p className="text-xs text-[#68656A] leading-relaxed pt-1">
            {analysis.summary}
          </p>

          {analysis.blockers.length > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#D93838]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{analysis.blockers.length} bloqueos detectados que impiden la presentación directa</span>
            </div>
          )}
        </div>

        {/* Separación clara: ANÁLISIS DE PLIEGO AI vs DECISIÓN DEL EQUIPO */}
        <div className="p-5 rounded-[20px] bg-white/80 backdrop-blur-[16px] border border-[rgba(20,20,20,0.06)] shadow-[0_4px_20px_rgba(20,20,30,0.04)] shrink-0 min-w-[280px] space-y-3">
          <div className="flex items-center justify-between text-[11px] border-b border-[rgba(20,20,20,0.06)] pb-2.5">
            <span className="font-mono uppercase tracking-wider text-[#8F8B92]">Decisión del Equipo</span>
            <span className="font-bold text-[#695CFF]">{user?.fullName || 'Luis Méndez'}</span>
          </div>

          <div className="flex items-center gap-2">
            <DecisionBadge decision={analysis.currentDecision} />
            <span className="text-xs text-[#68656A] font-mono">
              versión documental v{analysis.documentVersionUsed}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant={analysis.currentDecision === 'PURSUE' ? 'primary' : 'outline'}
              size="sm"
              disabled={!canDecide}
              onClick={() => openDecisionModal('PURSUE')}
            >
              Pursue (Go)
            </Button>
            <Button
              variant={analysis.currentDecision === 'REVIEW' ? 'secondary' : 'outline'}
              size="sm"
              disabled={!canDecide}
              onClick={() => openDecisionModal('REVIEW')}
            >
              Review
            </Button>
            <Button
              variant={analysis.currentDecision === 'DISCARD' ? 'danger' : 'outline'}
              size="sm"
              disabled={!canDecide}
              onClick={() => openDecisionModal('DISCARD')}
            >
              Discard
            </Button>
          </div>
        </div>
      </div>

      {/* Pestañas animadas con glider suave */}
      <AnimatedTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="segmented"
        size="md"
      />

      {/* ZONA 3 — LAS 7 DIMENSIONES VIVAS (ANIMACIÓN EN HOVER) */}
      {activeTab === 'dimensiones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#161616]">
                Evaluación Auditada de las 7 Dimensiones
              </h2>
              <p className="text-xs text-[#68656A]">
                Cada dimensión representa un ámbito independiente de solvencia y riesgo contractual
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#137A43]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Cobertura de evidencia: 85%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(analysis.dimensions).map(([key, dim]) => (
              <motion.div
                key={key}
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                className="p-5 rounded-[20px] bg-white/75 backdrop-blur-[20px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] hover:border-[#695CFF]/30 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#161616] group-hover:text-[#695CFF] transition-colors truncate">
                      {dim.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        dim.status === 'FAVORABLE'
                          ? 'bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4]'
                          : dim.status === 'WARNING'
                          ? 'bg-[#FEF7EC] text-[#975A16] border border-[#FCE1B8]'
                          : 'bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2]'
                      }`}
                    >
                      {dim.status === 'FAVORABLE' ? 'Favorable' : dim.status === 'WARNING' ? 'Revisión' : 'Crítico'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#161616] leading-snug">
                    {dim.summary}
                  </p>

                  <p className="text-[11px] text-[#68656A] leading-relaxed">
                    {dim.details}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[rgba(20,20,20,0.06)]">
                  <button
                    onClick={() => setActiveTab('requisitos')}
                    className="text-xs font-bold text-[#695CFF] hover:text-[#5749F5] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Ver requisitos vinculados</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ZONA 4 — REQUISITOS EXPANDIBLES (HERRAMIENTA DE AUDITORÍA) */}
      {activeTab === 'requisitos' && (
        <div className="p-6 rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_24px_rgba(20,20,30,0.04)] space-y-4">
          <div className="border-b border-[rgba(20,20,20,0.06)] pb-3">
            <h2 className="text-sm font-bold text-[#161616]">
              Matriz de Requisitos Contractuales y Citas Oficiales
            </h2>
            <p className="text-xs text-[#68656A]">
              Haz clic en cualquier fila para expandir la cita literal inmutable del pliego y la evidencia de tu dossier
            </p>
          </div>

          <div className="divide-y divide-[rgba(20,20,20,0.06)]">
            {analysis.requirements.map((req) => {
              const isExpanded = expandedRequirementId === req.id;

              return (
                <div key={req.id} className="py-4 space-y-3">
                  {/* Fila clickeable */}
                  <motion.div
                    whileHover={{ x: 2 }}
                    onClick={() => setExpandedRequirementId(isExpanded ? null : req.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="pt-0.5 shrink-0">
                        {req.status === 'SUPPORTED' ? (
                          <span className="w-5 h-5 rounded-full bg-[#EDFBF2] text-[#137A43] flex items-center justify-center text-xs font-bold">✓</span>
                        ) : req.status === 'NOT_SUPPORTED' ? (
                          <span className="w-5 h-5 rounded-full bg-[#FEF0F0] text-[#D93838] flex items-center justify-center text-xs font-bold">!</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-[#FEF7EC] text-[#975A16] flex items-center justify-center text-xs font-bold">?</span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono uppercase text-[#8F8B92]">
                            {req.category}
                          </span>
                          {req.isMandatory && (
                            <span className="px-1.5 py-0.2 rounded bg-[#FEF0F0] text-[#D93838] text-[9px] font-bold">
                              OBLIGATORIO
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-[#8F8B92]">
                            Confianza: {(req.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-[#161616] group-hover:text-[#695CFF] transition-colors">
                          {req.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      {req.evidenceTitle ? (
                        <span className="text-xs text-[#137A43] font-semibold hidden md:block">
                          {req.evidenceTitle}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8F8B92] italic hidden md:block">
                          Sin evidencia
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-[#8F8B92] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </motion.div>

                  {/* Panel expandible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="pl-8 pt-2 space-y-3 overflow-hidden text-xs"
                      >
                        <div className="p-3.5 rounded-[12px] bg-[#F6F3EF]/70 border border-[rgba(20,20,20,0.06)] text-[#68656A] leading-relaxed">
                          <strong className="text-[#161616]">Análisis:</strong> {req.reasoning}
                        </div>

                        <div className="p-4 rounded-[14px] bg-white border border-[rgba(20,20,20,0.08)] shadow-2xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#695CFF] font-bold">
                            <Quote className="w-3.5 h-3.5" />
                            <span>Cita oficial ({req.documentName} · v{req.documentVersion})</span>
                          </div>
                          <blockquote className="italic text-[#161616] pl-2 border-l-2 border-[#695CFF] leading-relaxed">
                            {req.literalCitation}
                          </blockquote>
                        </div>

                        {req.evidenceTitle && (
                          <div className="flex items-center gap-2 p-3 rounded-[12px] bg-[#EDFBF2]/70 border border-[#C6F0D4] text-[#137A43]">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span className="font-bold">Evidencia acreditada en tu dossier:</span>
                            <span>{req.evidenceTitle}</span>
                            {req.evidenceStatus && (
                              <span className="ml-auto text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white font-bold">
                                {req.evidenceStatus}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ZONA 5 — HISTORIAL DE DECISIONES DE AUDITORÍA */}
      {activeTab === 'decisiones' && (
        <div className="p-6 rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_24px_rgba(20,20,30,0.04)] space-y-4">
          <div className="border-b border-[rgba(20,20,20,0.06)] pb-3">
            <h2 className="text-sm font-bold text-[#161616]">
              Registro de Auditoría de Decisiones Humanas
            </h2>
            <p className="text-xs text-[#68656A]">
              Trazabilidad formal de decisiones tomadas por los miembros del equipo sobre este expediente
            </p>
          </div>

          <div className="space-y-3">
            {analysis.decisionHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-[14px] bg-[#F6F3EF]/70 border border-[rgba(20,20,20,0.06)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <DecisionBadge decision={rec.decision} />
                    <span className="font-bold text-[#161616]">{rec.decidedBy}</span>
                    <span className="text-[#8F8B92] font-mono text-[10px]">
                      versión documental: v{rec.analysisVersion}
                    </span>
                  </div>
                  <span className="text-[#8F8B92] font-mono text-[11px]">
                    {formatDateTime(rec.decidedAt)}
                  </span>
                </div>
                <p className="text-xs text-[#68656A] italic leading-relaxed pl-1">
                  "{rec.mandatoryReason}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Obligatorio de Decisión Humana */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title={`Registrar Decisión: ${
          selectedDecisionType === 'PURSUE'
            ? 'Avanzar (Pursue / Go)'
            : selectedDecisionType === 'REVIEW'
            ? 'En Revisión Técnica'
            : 'Descartar Oportunidad'
        }`}
        description="Aporta la justificación técnica o estratégica que quedará registrada de forma inmutable en el portfolio."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#161616] mb-1.5">
              Motivo formal de la decisión (entre 5 y 5.000 caracteres) *
            </label>
            <textarea
              rows={4}
              required
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Explique las razones técnicas, estratégicas o de capacidad que sustentan esta decisión…"
              className="w-full p-3 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#695CFF] focus:outline-none transition-all"
            />
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-[#8F8B92] font-mono">
              <span>Mínimo 5 caracteres</span>
              <span className="tabular-nums">{decisionReason.length}/5000</span>
            </div>
          </div>

          <div className="p-3 rounded-[12px] bg-[#F6F3EF] text-[11px] text-[#68656A] font-mono">
            Aplicado sobre: Análisis v{analysis.documentVersionUsed} · 28 septiembre 2026
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsDecisionModalOpen(false)}
              disabled={isSubmittingDecision}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={decisionReason.trim().length < 5}
              isLoading={isSubmittingDecision}
              onClick={submitDecision}
            >
              Guardar Decisión
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
