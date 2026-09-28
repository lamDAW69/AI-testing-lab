import React from 'react';
import { EligibilityStatus, HumanDecision, AnalysisValidity, RequirementStatus } from '../../types/qualification';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  dot = true,
}) => {
  const variantStyles = {
    default: 'bg-stone-100 text-[#161616] border-[rgba(20,20,20,0.08)]',
    success: 'bg-[#EDFBF2] text-[#137A43] border-[#C6F0D4]',
    warning: 'bg-[#FEF7EC] text-[#975A16] border-[#FCE1B8]',
    danger: 'bg-[#FEF0F0] text-[#D93838] border-[#FCD2D2]',
    info: 'bg-[#EEEAFE] text-[#5749F5] border-[#D5CCFE]',
    neutral: 'bg-[#EEEAE5] text-[#68656A] border-[rgba(20,20,20,0.06)]',
  };

  const dotStyles = {
    default: 'bg-[#68656A]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#F25A5A]',
    info: 'bg-[#695CFF]',
    neutral: 'bg-[#8F8B92]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const EligibilityBadge: React.FC<{ status: EligibilityStatus }> = ({ status }) => {
  switch (status) {
    case 'POTENTIALLY_ELIGIBLE':
      return <Badge variant="success">Potencialmente Elegible</Badge>;
    case 'NEEDS_REVIEW':
      return <Badge variant="warning">Necesita Revisión Humana</Badge>;
    case 'POTENTIALLY_INELIGIBLE':
      return <Badge variant="danger">Potencialmente Inelegible</Badge>;
    default:
      return <Badge variant="neutral">Estado Desconocido</Badge>;
  }
};

export const DecisionBadge: React.FC<{ decision: HumanDecision }> = ({ decision }) => {
  switch (decision) {
    case 'PURSUE':
      return <Badge variant="success">Avanzar (Pursue)</Badge>;
    case 'REVIEW':
      return <Badge variant="warning">En Revisión</Badge>;
    case 'DISCARD':
      return <Badge variant="danger">Descartada</Badge>;
    case 'UNDECIDED':
    default:
      return <Badge variant="neutral">Sin Decisión</Badge>;
  }
};

export const ValidityBadge: React.FC<{ validity: AnalysisValidity }> = ({ validity }) => {
  switch (validity) {
    case 'VALID':
      return <Badge variant="success">Análisis Vigente</Badge>;
    case 'REQUIRES_REANALYSIS':
      return <Badge variant="danger">Requiere Reanálisis</Badge>;
    case 'STALE':
      return <Badge variant="warning">Desactualizado</Badge>;
    default:
      return <Badge variant="neutral">—</Badge>;
  }
};

export const RequirementBadge: React.FC<{ status: RequirementStatus }> = ({ status }) => {
  switch (status) {
    case 'SUPPORTED':
      return <Badge variant="success">Cumplimiento Respaldado</Badge>;
    case 'PARTIALLY_SUPPORTED':
      return <Badge variant="warning">Respaldo Parcial</Badge>;
    case 'NOT_SUPPORTED':
      return <Badge variant="danger">Sin Respaldo (Riesgo)</Badge>;
    case 'UNKNOWN':
    default:
      return <Badge variant="neutral">Evidencia No Acreditada</Badge>;
  }
};
