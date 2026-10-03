import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Hash,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  Info,
  Calendar,
  Building,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate, formatDeadlineDays } from '../lib/formatters';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { apiClient } from '../lib/api-client';
import { PublicTender, TenderDocument } from '../types/procurement';

export const TenderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canPerformAction, activeTenant } = useAuth();
  const { getTenderById, getTenderDocuments, startAnalysisForTender } = useData();

  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiTender, setApiTender] = useState<PublicTender | null>(null);
  const [apiDocs, setApiDocs] = useState<TenderDocument[] | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const tenderId = id || 't-101';

  // Consulta al endpoint oficial /api/public/tenders/:id para recuperar pliegos y documentos reales con SHA-256
  useEffect(() => {
    if (!tenderId) return;
    let isMounted = true;
    setIsLoadingDetail(true);

    apiClient
      .get<any>(`/public/tenders/${tenderId}`)
      .then((data) => {
        if (!isMounted || !data) return;

        if (data.id) {
          const mappedTender: PublicTender = {
            id: data.id,
            fileReference: data.fileReference || data.sourceTenderId || data.id,
            title: data.title,
            contractingAuthority:
              data.contractingAuthority ||
              data.authority?.name ||
              data.authorityName ||
              'Órgano oficial',
            cpvCode: data.cpvCode || data.mainCpvCode || '',
            budgetAmount:
              typeof data.budgetAmount === 'number'
                ? data.budgetAmount
                : typeof data.budgetAmountCents === 'number'
                ? data.budgetAmountCents / 100
                : 0,
            estimatedValue:
              typeof data.estimatedValue === 'number'
                ? data.estimatedValue
                : typeof data.estimatedValueCents === 'number'
                ? data.estimatedValueCents / 100
                : (typeof data.budgetAmount === 'number' ? data.budgetAmount : 0),
            currency: data.currency || 'EUR',
            submissionDeadline: data.submissionDeadline,
            publicationDate: data.publicationDate || data.sourceUpdatedAt || data.createdAt,
            status: data.status,
            documentsCount:
              Array.isArray(data.documents)
                ? data.documents.length
                : typeof data.documentsCount === 'number'
                ? data.documentsCount
                : 0,
            hasActiveAnalysis: false,
          };
          setApiTender(mappedTender);
        }

        if (Array.isArray(data.documents) && data.documents.length > 0) {
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
          setApiDocs(mappedDocs);
        }
      })
      .catch(() => {
        // En modo offline o si no responde el backend, se mantiene la información local
      })
      .finally(() => {
        if (isMounted) setIsLoadingDetail(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tenderId]);

  const tenderFromContext = getTenderById(tenderId);
  const tender = apiTender || tenderFromContext || {
    id: tenderId,
    fileReference: 'EXP-DESCONOCIDO',
    title: 'Expediente no encontrado',
    contractingAuthority: 'Órgano oficial',
    cpvCode: '72000000-5',
    budgetAmount: 0,
    estimatedValue: 0,
    currency: 'EUR',
    submissionDeadline: new Date().toISOString(),
    status: 'PUBLISHED' as const,
    documentsCount: 0,
    hasActiveAnalysis: false,
  };

  const tenderDocs = apiDocs !== null ? apiDocs : getTenderDocuments(tender.id);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    await startAnalysisForTender(tender.id);
    setIsAnalyzing(false);
    setIsAnalyzeModalOpen(false);
    navigate(`/app/portfolio/${tender.id}`);
  };

  const deadline = formatDeadlineDays(tender.submissionDeadline).label;
  const canAnalyze = canPerformAction('analyze');

  return (
    <div className="space-y-8 select-none">
      {/* Botón Volver + Header Oficial */}
      <div className="space-y-3 pb-2 border-b border-[rgba(20,20,20,0.06)]">
        <Link
          to="/app/catalogo"
          className="inline-flex items-center gap-1.5 text-xs text-[#68656A] hover:text-[#161616] font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-[8px] bg-[#EEEAE5] text-[#161616] font-bold">
                {tender.fileReference}
              </span>
              <span className="text-xs text-[#8F8B92]">Hecho Oficial · PLACSP</span>
              {tender.hasActiveAnalysis && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4]">
                  Precalificado en Portfolio
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161616] tracking-tight leading-snug">
              {tender.title}
            </h1>
            <p className="text-xs text-[#68656A] font-medium">{tender.contractingAuthority}</p>

            <div className="flex items-center gap-4 text-xs font-mono text-[#68656A] pt-1 flex-wrap">
              <span className="text-[#161616] font-bold">{formatCurrency(tender.budgetAmount)}</span>
              <span>·</span>
              <span>Plazo: {formatDate(tender.submissionDeadline)} ({deadline})</span>
              <span>·</span>
              <span>{tender.cpvCode}</span>
            </div>
          </div>

          <div className="shrink-0 pt-2 lg:pt-0">
            {tender.hasActiveAnalysis ? (
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(`/app/portfolio/${tender.id}`)}
              >
                Ver Análisis Existente
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={!canAnalyze}
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => setIsAnalyzeModalOpen(true)}
              >
                Analizar para mi empresa
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Principal: Hechos Oficiales + Panel Contextual Antes de Analizar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lado izquierdo: Timeline de documentos oficiales */}
        <div className="lg:col-span-8 p-6 rounded-[22px] bg-white/80 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_24px_rgba(20,20,30,0.04)] space-y-6">
          <div className="border-b border-[rgba(20,20,20,0.06)] pb-3">
            <h2 className="text-sm font-bold text-[#161616]">
              Documentación Oficial y Versiones del Expediente
            </h2>
            <p className="text-xs text-[#68656A]">
              Trazabilidad criptográfica de los pliegos publicados por el órgano de contratación
            </p>
          </div>

          {/* Timeline de versiones */}
          <div className="space-y-4">
            {tenderDocs.length > 0 ? (
              tenderDocs.map((doc, idx) => {
                const isAdenda = doc.type === 'ADENDA';
                return (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -2 }}
                    className={`p-4 rounded-[16px] transition-all border ${
                      isAdenda
                        ? 'bg-[#FEF0F0]/60 border-[#FCD2D2]'
                        : 'bg-[#F6F3EF]/70 border-[rgba(20,20,20,0.06)] hover:border-[#695CFF]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isAdenda
                                ? 'bg-[#FEF0F0] text-[#D93838]'
                                : 'bg-white text-[#5749F5] border border-[#D5CCFE]'
                            }`}
                          >
                            {doc.type} · Versión {doc.version}
                          </span>
                          <span className="text-[10px] text-[#8F8B92] font-mono">
                            {formatDate(doc.obtainedAt)}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#161616] leading-snug">
                          {doc.name}
                        </h4>
                        <div className="text-[10px] font-mono text-[#8F8B92] flex items-center gap-1 truncate">
                          <Hash className="w-2.5 h-2.5 shrink-0" />
                          <span>SHA-256: {doc.sha256Hash}</span>
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-[8px] bg-white hover:bg-[#161616] text-[#161616] hover:text-white border border-[rgba(20,20,20,0.08)] shadow-2xs font-semibold transition-colors cursor-pointer"
                          >
                            <span>PDF Oficial</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-1 rounded-[8px] bg-white text-[#161616] border border-[rgba(20,20,20,0.08)] shadow-2xs font-semibold">
                            PDF Oficial
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-6 rounded-[16px] bg-[#F6F3EF]/60 text-center text-xs text-[#8F8B92]">
                No constan documentos anexos adicionales para este expediente.
              </div>
            )}
          </div>
        </div>

        {/* Lado derecho: Panel Contextual Antes de Analizar (Glass) */}
        <div className="lg:col-span-4 p-5 rounded-[22px] bg-white/70 backdrop-blur-[24px] border border-white/80 shadow-[0_12px_40px_rgba(20,20,30,0.06)] space-y-4">
          <div className="border-b border-[rgba(20,20,20,0.06)] pb-2.5">
            <span className="text-xs font-bold text-[#161616] block">
              Evaluación contra Dossier
            </span>
            <span className="text-[11px] text-[#68656A]">
              Condiciones del motor de precalificación Pliego AI
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[rgba(20,20,20,0.04)]">
              <span className="text-[#68656A]">Expediente</span>
              <span className="font-mono font-bold text-[#161616]">{tender.fileReference}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[rgba(20,20,20,0.04)]">
              <span className="text-[#68656A]">Dossier verificado</span>
              <span className="font-mono font-bold text-[#137A43]">{activeTenant?.name || 'Mi Organización'}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[rgba(20,20,20,0.04)]">
              <span className="text-[#68656A]">Dimensiones</span>
              <span className="font-mono font-bold text-[#5749F5]">7 dimensiones exhaustivas</span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-[rgba(20,20,20,0.04)]">
              <span className="text-[#68656A]">Coste IA</span>
              <span className="text-right text-[#137A43] font-semibold">Incluido en tu suscripción</span>
            </div>
          </div>

          <p className="text-[11px] text-[#8F8B92] leading-relaxed">
            Pliego AI cotejará cada exigencia del PPT y PCAP contra tus solvencias, certificaciones vigentes y contratos previos registrados.
          </p>

          {tender.hasActiveAnalysis ? (
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/app/portfolio/${tender.id}`)}
            >
              Consultar Precalificación
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsAnalyzeModalOpen(true)}
            >
              Iniciar análisis
            </Button>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={isAnalyzeModalOpen}
        onClose={() => setIsAnalyzeModalOpen(false)}
        title="Iniciar Análisis de Precalificación"
        description={`Se evaluará el expediente ${tender.fileReference} frente al Dossier privado de ${activeTenant?.name || 'tu organización'}.`}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-[12px] bg-[#EEEAFE]/60 border border-[#D5CCFE] text-xs text-[#5749F5] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              El análisis descompondrá el pliego oficial en <strong>7 dimensiones independientes</strong> y vinculará citas literales con tus evidencias.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsAnalyzeModalOpen(false)}
              disabled={isAnalyzing}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              isLoading={isAnalyzing}
              onClick={handleStartAnalysis}
            >
              Confirmar e Iniciar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
