import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Award,
  FileCheck,
  ShieldCheck,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  FileText,
  Percent,
  X,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AnimatedTabs, TabItem } from '../components/ui/AnimatedTabs';
import { formatCurrency, formatDate } from '../lib/formatters';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { CompanyProfile, Certification, BusinessEvidence, EvidenceStatus } from '../types/dossier';

export const DossierPage: React.FC = () => {
  const { profile, certifications, evidences, addEvidence } = useData();
  const [activeTab, setActiveTab] = useState<string>('certificaciones');
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<BusinessEvidence['category']>('PREVIOUS_CONTRACTS');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDocRef, setNewDocRef] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { canPerformAction } = useAuth();
  const canEdit = canPerformAction('edit_dossier');

  const dossierTabs: TabItem[] = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'certificaciones', label: 'Certificaciones', badge: certifications.length },
    { id: 'evidencias', label: 'Experiencia y Evidencias', badge: evidences.length },
  ];

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setIsSubmitting(true);
    addEvidence({
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      documentReference: newDocRef.trim() || 'Documento_acreditativo.pdf',
      verifiedAmount: newAmount ? parseFloat(newAmount) : undefined,
      validUntil: newValidUntil ? new Date(newValidUntil).toISOString() : undefined,
    });

    setIsSubmitting(false);
    setIsAddEvidenceModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewDocRef('');
    setNewAmount('');
    setNewValidUntil('');
    setActiveTab('evidencias');
  };

  const renderStatusPill = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> VERIFIED
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEEAFE] text-[#5749F5] border border-[#D5CCFE] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#695CFF]" /> PENDING REVIEW
          </span>
        );
      case 'DECLARED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEEAE5] text-[#68656A] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F8B92]" /> DECLARED
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FEF7EC] text-[#975A16] border border-[#FCE1B8] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> EXPIRED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F25A5A]" /> REJECTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Unificada */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-2 border-b border-[rgba(20,20,20,0.06)]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">
            Dossier
          </h1>
          <p className="text-xs text-[#68656A] mt-0.5 max-w-xl">
            Todo lo que Pliego AI conoce sobre la solvencia y capacidad técnica de tu organización.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-mono font-semibold text-[#137A43] px-2 py-0.5 rounded-[8px] bg-[#EDFBF2] border border-[#C6F0D4]">
              82% cobertura documental
            </span>
            <span className="text-xs text-[#8F8B92]">contrastado frente a pliegos oficiales</span>
          </div>
        </div>

        {canEdit && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddEvidenceModalOpen(true)}
          >
            Declarar Evidencia
          </Button>
        )}
      </div>

      {/* Tabs Animadas */}
      <AnimatedTabs
        tabs={dossierTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="segmented"
        size="md"
      />

      {/* Vistas */}
      <AnimatePresence mode="wait">
        {activeTab === 'perfil' && (
          <motion.div
            key="tab-perfil"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="p-6 rounded-[22px] bg-white border border-[rgba(20,20,20,0.06)] shadow-[0_1px_3px_rgba(20,20,30,0.02)] space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#161616]">
                  {profile.companyName}
                </h3>
                <span className="text-xs text-[#8F8B92] font-mono">
                  CIF: {profile.taxId} · Ámbito: {profile.geographicalScope.join(', ')}
                </span>
              </div>
              {canEdit && (
                <Button variant="outline" size="sm">
                  Editar perfil
                </Button>
              )}
            </div>

            <p className="text-xs text-[#68656A] leading-relaxed max-w-3xl">
              {profile.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(20,20,20,0.06)]">
              <div className="p-4 rounded-[14px] bg-[#F6F3EF]/60 border border-[rgba(20,20,20,0.04)]">
                <span className="text-[11px] text-[#8F8B92] block font-mono">Solvencia Declarada</span>
                <span className="text-lg font-bold font-mono text-[#161616] mt-1 block">
                  {formatCurrency(profile.maxEconomicSolvency)}
                </span>
              </div>

              <div className="p-4 rounded-[14px] bg-[#F6F3EF]/60 border border-[rgba(20,20,20,0.04)]">
                <span className="text-[11px] text-[#8F8B92] block font-mono">Equipo Técnico</span>
                <span className="text-lg font-bold font-mono text-[#161616] mt-1 block">
                  {profile.averageTeamSize} ingenieros
                </span>
              </div>

              <div className="p-4 rounded-[14px] bg-[#F6F3EF]/60 border border-[rgba(20,20,20,0.04)]">
                <span className="text-[11px] text-[#8F8B92] block font-mono">CPVs Habituales</span>
                <span className="text-xs font-mono font-semibold text-[#695CFF] mt-1.5 block">
                  {profile.primaryCpvCodes.join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'certificaciones' && (
          <motion.div
            key="tab-certificaciones"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-[18px] bg-white border border-[rgba(20,20,20,0.06)] shadow-[0_1px_3px_rgba(20,20,30,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#161616]">{cert.name}</span>
                    {renderStatusPill(cert.status)}
                  </div>
                  <span className="text-xs font-mono text-[#68656A] block">
                    Emisor: {cert.issuer} · Ref: {cert.certificateNumber}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="text-[#8F8B92] block text-[10px] font-mono uppercase">Válida hasta</span>
                  <span className="font-mono text-[#161616] font-medium">{formatDate(cert.expiresAt)}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'evidencias' && (
          <motion.div
            key="tab-evidencias"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            {evidences.map((ev) => (
              <motion.div
                key={ev.id}
                whileHover={{ y: -3, scale: 1.006 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="p-5 rounded-[20px] bg-white/80 backdrop-blur-[18px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] hover:border-[#695CFF]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#161616]">{ev.title}</span>
                    {renderStatusPill(ev.status)}
                  </div>
                  <p className="text-xs text-[#68656A] leading-relaxed max-w-2xl">{ev.description}</p>
                  <span className="text-[11px] font-mono text-[#695CFF] block">
                    Documento soporte: {ev.documentReference}
                  </span>
                </div>
                {ev.verifiedAmount && (
                  <div className="text-right text-xs shrink-0">
                    <span className="text-[#8F8B92] block text-[10px] font-mono uppercase">Importe Verificado</span>
                    <span className="font-bold font-mono text-[#161616] text-sm">{formatCurrency(ev.verifiedAmount)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para Declarar Evidencia */}
      <Modal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        title="Declarar Nueva Evidencia de Solvencia"
        description="Acredita experiencia, personal cualificado o solvencia financiera para el contraste con pliegos oficiales."
      >
        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#161616] mb-1">
              Categoría de Evidencia *
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as BusinessEvidence['category'])}
              className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] focus:border-[#695CFF] focus:outline-none"
            >
              <option value="PREVIOUS_CONTRACTS">Contratos Previos / Experiencia Directa</option>
              <option value="TEAM_QUALIFICATION">Cualificación del Equipo Técnico (Títulos, Certificaciones)</option>
              <option value="FINANCIAL_SOLVENCY">Solvencia Económica / Cuentas Anuales</option>
              <option value="TECHNICAL_MEANS">Medios Técnicos y Herramientas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#161616] mb-1">
              Título de la Evidencia *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Contrato de modernización Cloud para el Ministerio de Justicia"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#695CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#161616] mb-1">
              Descripción y Alcance *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detalla los servicios prestados, tecnologías utilizadas o personal asignado…"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#695CFF] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161616] mb-1">
                Documento Referencia
              </label>
              <input
                type="text"
                placeholder="Ej: Certificado_Buena_Ejecucion_2025.pdf"
                value={newDocRef}
                onChange={(e) => setNewDocRef(e.target.value)}
                className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#695CFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161616] mb-1">
                Importe Acreditado (€, opcional)
              </label>
              <input
                type="number"
                placeholder="Ej: 350000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#695CFF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#161616] mb-1">
              Vigencia / Caducidad (opcional)
            </label>
            <input
              type="date"
              value={newValidUntil}
              onChange={(e) => setNewValidUntil(e.target.value)}
              className="w-full p-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] focus:border-[#695CFF] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddEvidenceModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Registrar Evidencia
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
