import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  FileText,
  Scale,
  BellRing,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductTourModal: React.FC<ProductTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Paso 1 de 4',
      title: 'Tu Dossier Corporativo: La base de tu solvencia',
      icon: <Building2 className="w-5 h-5 text-[#218a58]" />,
      iconBg: 'bg-[#e8f7ef]',
      description:
        'En Pliego AI no hay preguntas genéricas. El sistema necesita conocer qué solvencia y certificaciones tiene tu empresa para evaluar si cumples con las condiciones del pliego.',
      detail:
        'Para esta demo hemos precargado TechConsulting Soluciones S.L., con acreditación ISO 27001, ENS de categoría Alta y proyectos cloud ejecutados para clientes públicos.',
      highlight: 'Dossier centralizado: Solvencia económica, técnica y certificaciones ENS / ISO.',
      actionText: 'Ver Dossier de TechConsulting',
      actionRoute: '/app/dossier',
    },
    {
      badge: 'Paso 2 de 4',
      title: 'Catálogo Oficial: Licitaciones sincronizadas con PLACSP',
      icon: <FileText className="w-5 h-5 text-[#685cff]" />,
      iconBg: 'bg-[#eeeaff]',
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
      icon: <Scale className="w-5 h-5 text-[#685cff]" />,
      iconBg: 'bg-[#eeeaff]',
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
      icon: <BellRing className="w-5 h-5 text-[#ca8517]" />,
      iconBg: 'bg-[#fff3db]',
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-[24px] border border-[rgba(20,20,20,0.1)] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Cabecera del modal */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[rgba(30,24,38,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#685cff] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              ✦
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#171719] leading-tight">
                Guía Rápida de la Demostración Interactiva
              </h2>
              <p className="text-[11px] text-[#69666d]">
                Empresa simulada: TechConsulting Soluciones S.L. (CIF B-88776655)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#929097] hover:text-[#171719] transition-colors cursor-pointer"
            title="Cerrar guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de pasos (Pills) */}
        <div className="px-6 pt-4 flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                index === currentStep
                  ? 'bg-[#685cff]'
                  : index < currentStep
                  ? 'bg-[#685cff]/40'
                  : 'bg-[rgba(30,24,38,0.08)]'
              }`}
              title={`Ir al paso ${index + 1}`}
            />
          ))}
        </div>

        {/* Cuerpo del paso actual */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-[10px] ${current.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#685cff] font-bold block">
                {current.badge}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#171719] tracking-tight">
                {current.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#423d4c] leading-relaxed">
            {current.description}
          </p>

          <div className="p-3.5 rounded-[14px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] space-y-2">
            <p className="text-xs text-[#69666d] leading-relaxed">
              {current.detail}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#685cff]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.highlight}</span>
            </div>
          </div>

          {/* Enlace directo interactivo a la sección relevante */}
          <div className="pt-2">
            <button
              onClick={() => handleAction(current.actionRoute)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-white border border-[#685cff]/30 hover:border-[#685cff] text-[#685cff] text-xs font-semibold hover:bg-[#eeeaff]/30 transition-all cursor-pointer shadow-2xs"
            >
              <span>{current.actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pie de controles */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[rgba(30,24,38,0.06)] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              currentStep === 0
                ? 'text-[#929097] cursor-not-allowed opacity-40'
                : 'text-[#171719] hover:bg-black/5'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#69666d] hover:text-[#171719] transition-colors cursor-pointer"
            >
              Saltar tutorial
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-[12px] bg-[#171719] hover:bg-[#2b2b2e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
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
