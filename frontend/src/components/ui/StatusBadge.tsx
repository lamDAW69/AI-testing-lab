import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  EligibilityStatus,
  HumanDecision,
  AnalysisValidity,
  RequirementStatus,
} from '../../types/qualification';
import { EvidenceStatus } from '../../types/dossier';

export type StatusTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type CertificationStatus = EvidenceStatus;

export interface StatusBadgeProps {
  tone?: StatusTone;
  icon?: React.ReactNode | 'warning' | 'check' | 'clock' | 'info' | 'danger' | 'shield';
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  tone = 'neutral',
  icon,
  children,
  className = '',
}) => {
  const toneClasses: Record<StatusTone, string> = {
    danger: 'bg-[#ffeded] text-[#e44848] border-[#fcd2d2]',
    success: 'bg-[#e8f7ef] text-[#218a58] border-[#c6f0d4]',
    info: 'bg-[#efedff] text-[#6054ef] border-[#d5ccfe]',
    warning: 'bg-[#fff3db] text-[#ca8517] border-[#fce1b8]',
    neutral: 'bg-[#efedef] text-[#69666d] border-[rgba(30,24,38,0.08)]',
    primary: 'bg-[#eeeaff] text-[#685cff] border-[#d5ccfe]',
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'string') {
      switch (icon) {
        case 'warning':
          return <AlertTriangle className="w-3 h-3 shrink-0" />;
        case 'danger':
          return <ShieldAlert className="w-3 h-3 shrink-0" />;
        case 'check':
          return <CheckCircle2 className="w-3 h-3 shrink-0" />;
        case 'clock':
          return <Clock className="w-3 h-3 shrink-0" />;
        case 'shield':
          return <ShieldCheck className="w-3 h-3 shrink-0" />;
        case 'info':
        default:
          return <Info className="w-3 h-3 shrink-0" />;
      }
    }
    return null;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 w-fit min-h-[23px] px-2 py-0.5 rounded-full text-[11px] font-medium border leading-none transition-colors select-none ${toneClasses[tone]} ${className}`}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};

// Aliases y Badges Semánticos del Dominio Pliego AI
export const EligibilityBadge: React.FC<{ status: EligibilityStatus }> = ({ status }) => {
  switch (status) {
    case 'POTENTIALLY_ELIGIBLE':
      return (
        <StatusBadge tone="success" icon="check">
          Potencialmente Elegible
        </StatusBadge>
      );
    case 'NEEDS_REVIEW':
      return (
        <StatusBadge tone="warning" icon="warning">
          Necesita revisión
        </StatusBadge>
      );
    case 'POTENTIALLY_INELIGIBLE':
      return (
        <StatusBadge tone="danger" icon="danger">
          Potencialmente Inelegible
        </StatusBadge>
      );
    default:
      return <StatusBadge tone="neutral">Desconocido</StatusBadge>;
  }
};

export const DecisionBadge: React.FC<{ decision: HumanDecision }> = ({ decision }) => {
  switch (decision) {
    case 'PURSUE':
      return (
        <StatusBadge tone="success" icon="check">
          Pursue
        </StatusBadge>
      );
    case 'REVIEW':
      return (
        <StatusBadge tone="info" icon="clock">
          Review
        </StatusBadge>
      );
    case 'DISCARD':
      return (
        <StatusBadge tone="danger" icon={<XCircle className="w-3 h-3 shrink-0" />}>
          Descartada
        </StatusBadge>
      );
    case 'UNDECIDED':
    default:
      return <StatusBadge tone="neutral">Sin decisión</StatusBadge>;
  }
};

export const ValidityBadge: React.FC<{ validity: AnalysisValidity }> = ({ validity }) => {
  switch (validity) {
    case 'VALID':
      return (
        <StatusBadge tone="success" icon="check">
          Vigente
        </StatusBadge>
      );
    case 'REQUIRES_REANALYSIS':
      return (
        <StatusBadge tone="danger" icon="warning">
          Reanalizar
        </StatusBadge>
      );
    case 'STALE':
      return (
        <StatusBadge tone="warning" icon="clock">
          Desactualizado
        </StatusBadge>
      );
    default:
      return <StatusBadge tone="neutral">—</StatusBadge>;
  }
};

export const RequirementBadge: React.FC<{ status: RequirementStatus }> = ({ status }) => {
  switch (status) {
    case 'SUPPORTED':
      return (
        <StatusBadge tone="success" icon="check">
          Acreditado
        </StatusBadge>
      );
    case 'PARTIALLY_SUPPORTED':
      return (
        <StatusBadge tone="warning" icon="warning">
          Parcial
        </StatusBadge>
      );
    case 'NOT_SUPPORTED':
      return (
        <StatusBadge tone="danger" icon="danger">
          Sin respaldo
        </StatusBadge>
      );
    default:
      return <StatusBadge tone="neutral">No acreditada</StatusBadge>;
  }
};

export const DossierStatusBadge: React.FC<{ status: EvidenceStatus }> = ({ status }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <StatusBadge tone="success" icon="shield">
          VERIFIED
        </StatusBadge>
      );
    case 'DECLARED':
      return (
        <StatusBadge tone="neutral" icon="info">
          DECLARED
        </StatusBadge>
      );
    case 'PENDING_REVIEW':
      return (
        <StatusBadge tone="info" icon="clock">
          PENDING_REVIEW
        </StatusBadge>
      );
    case 'EXPIRED':
      return (
        <StatusBadge tone="warning" icon="warning">
          EXPIRED
        </StatusBadge>
      );
    case 'REJECTED':
      return (
        <StatusBadge tone="danger" icon="danger">
          REJECTED
        </StatusBadge>
      );
    default:
      return <StatusBadge tone="neutral">{status}</StatusBadge>;
  }
};
