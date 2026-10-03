import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  FileText,
  Scale,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductTourModal: React.FC<ProductTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { isDemoMode, activeTenant } = useAuth();

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Paso 1 de 4',
      title: 'Tu Dossier Corporativo: La base de tu solvencia',
      icon: <Building2 className="w-4.5 h-4.5" />,
      iconColor: '#10b981',   // esmeralda — solvencia
      description:
        'En Pliego AI no hay preguntas genéricas. El sistema necesita conocer qué solvencia y certificaciones tiene tu empresa para evaluar si cumples con las condiciones del pliego.',
      detail: isDemoMode
        ? 'Para esta demo hemos precargado TechConsulting Soluciones S.L., con acreditación ISO 27001, ENS de categoría Alta y proyectos cloud ejecutados para clientes públicos.'
        : `Para tu entidad (${activeTenant?.name || 'tu empresa'}), debes registrar en el Dossier tus solvencias técnicas, certificaciones (ISO, ENS) y contratos previos para que la IA disponga de tu base de acreditaciones verificables.`,
      highlight: 'Dossier centralizado: Solvencia económica, técnica y certificaciones ENS / ISO.',
      actionText: isDemoMode
        ? 'Ver Dossier de TechConsulting'
        : `Configurar Dossier de ${activeTenant?.name || 'mi empresa'}`,
      actionRoute: '/app/dossier',
    },
    {
      badge: 'Paso 2 de 4',
      title: 'Catálogo Oficial: Licitaciones sincronizadas con PLACSP',
      icon: <FileText className="w-4.5 h-4.5" />,
      iconColor: '#5e6ad2',   // lavanda — datos / documentos
      description:
        'Sondeamos en tiempo real el feed oficial del Ministerio de Hacienda (PLACSP). Cada expediente incluye presupuestos en céntimos y los enlaces a los pliegos oficiales (PCAP y PPT).',
      detail:
        'Cada pliego PDF descargado se sella con un hash SHA-256 dual (binario y texto extraído). Nadie puede alterar los requisitos del pliego original.',
      highlight: 'Sindicación CODICE XML + Sellado criptográfico inmutable SHA-256.',
      actionText: 'Ir al Catálogo de Licitaciones',
      actionRoute: '/app/catalogo',
    },
    {
      badge: 'Paso 3 de 4',
      title: 'Precalificación con IA en 7 Dimensiones y Citas Físicas',
      icon: <Scale className="w-4.5 h-4.5" />,
      iconColor: '#5e6ad2',   // lavanda — análisis IA
      description:
        'Al seleccionar un expediente, el motor cruza los requisitos obligatorios contra tu dossier en 7 dimensiones (Elegibilidad, Solvencia, Riesgos, Plazos, etc.).',
      detail:
        'Cero alucinaciones: la IA tiene prohibido inventar requisitos. Cada criterio indica el offset exacto de caracteres y la página del pliego oficial de donde proviene.',
      highlight: 'Puertas deterministas (descarte sin coste) + Auditoría exacta de citas.',
      actionText: 'Ver Ficha de la Licitación DGT (850.000 €)',
      actionRoute: '/app/oportunidades/t-101',
    },
    {
      badge: 'Paso 4 de 4',
      title: 'Decisiones de Cartera y Detección de Adendas',
      icon: <BellRing className="w-4.5 h-4.5" />,
      iconColor: '#f59e0b',   // ámbar — alertas
      description:
        'Gestiona tu cartera marcando si presentas oferta (PURSUE) o la descartas (DISCARD). Todo tu equipo comparte el mismo contexto operativo.',
      detail:
        'Si el organismo publica una adenda o rectificación tras tu análisis, el sistema invalida atómicamente el resultado y te avisa con una alerta de reanálisis para que no presentes una oferta desfasada.',
      highlight: 'Alertas operativas + Protección contra cambios en pliegos publicados.',
      actionText: 'Ver Cartera y Decisiones',
      actionRoute: '/app/portfolio',
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleAction = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[640px] rounded-[16px] border border-[var(--hairline)] overflow-hidden flex flex-col bg-[var(--surface-1)] shadow-2xl"
      >
        {/* ── Cabecera ───────────────────────────────────────── */}
        <div
          className="px-5 py-4 border-b border-[var(--hairline)] flex items-center justify-between bg-[var(--surface-2)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">
              ✦
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em]">
                {isDemoMode
                  ? 'Guía Rápida de la Demostración Interactiva'
                  : '¿Cómo funciona Pliego AI? · Guía de la Plataforma'}
              </h2>
              <p className="text-[11px] text-[var(--ink-tertiary)] mt-0.5">
                {isDemoMode
                  ? 'Empresa simulada: TechConsulting Soluciones S.L. (CIF B-88776655)'
                  : `Entidad activa: ${activeTenant?.name || 'Organización Licitadora'} (CIF: ${activeTenant?.taxId || 'No asignado'})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer shrink-0"
            title="Cerrar guía"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Progress pills ─────────────────────────────────── */}
        <div className="px-5 pt-4 flex gap-1.5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentStep
                  ? 'bg-[var(--primary)]'
                  : index < currentStep
                  ? 'bg-[var(--primary)]/35'
                  : 'bg-[var(--hairline)]'
              }`}
              title={`Ir al paso ${index + 1}`}
            />
          ))}
        </div>

        {/* ── Cuerpo del paso ────────────────────────────────── */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          {/* Icono + badge + título */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: `${current.iconColor}18`,
                color: current.iconColor,
                border: `1px solid ${current.iconColor}30`,
              }}
            >
              {current.icon}
            </div>
            <div>
              <span
                className="text-[10px] font-mono uppercase tracking-widest font-medium block"
                style={{ color: current.iconColor }}
              >
                {current.badge}
              </span>
              <h3 className="text-base font-semibold text-[var(--ink)] tracking-[-0.03em] leading-snug mt-0.5">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Descripción principal */}
          <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
            {current.description}
          </p>

          {/* Bloque de detalle */}
          <div
            className="p-4 rounded-[10px] border border-[var(--hairline)] space-y-2.5 bg-[var(--surface-2)]"
          >
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              {current.detail}
            </p>
            <div
              className="flex items-center gap-1.5 text-[11px] font-medium"
              style={{ color: current.iconColor }}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{current.highlight}</span>
            </div>
          </div>

          {/* Botón de acción contextual */}
          <div className="pt-1">
            <button
              onClick={() => handleAction(current.actionRoute)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-medium transition-all duration-150 cursor-pointer border"
              style={{
                background: `${current.iconColor}10`,
                borderColor: `${current.iconColor}30`,
                color: current.iconColor,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${current.iconColor}1c`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${current.iconColor}50`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${current.iconColor}10`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${current.iconColor}30`;
              }}
            >
              <span>{current.actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Pie de controles ───────────────────────────────── */}
        <div
          className="px-5 py-3.5 border-t border-[var(--hairline)] flex items-center justify-between bg-[var(--surface-2)]"
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-[var(--ink-tertiary)]'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-1)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-[8px] text-xs font-medium text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer"
            >
              Saltar tutorial
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-[8px] bg-[var(--primary)] hover:opacity-90 text-white text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <span>{currentStep === steps.length - 1 ? '¡Comenzar a explorar!' : 'Siguiente paso'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
