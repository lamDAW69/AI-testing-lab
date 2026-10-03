import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Sparkles, HelpCircle, LogOut, ArrowRight } from 'lucide-react';

interface DemoBannerProps {
  onOpenTour: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenTour }) => {
  const { isDemoMode, logout } = useAuth();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const handleExitDemo = async () => {
    await logout();
    navigate('/');
  };

  const handleRegisterCompany = async () => {
    await logout();
    navigate('/registro');
  };

  return (
    <div className="bg-[var(--surface-1)] text-[var(--ink)] px-3 sm:px-6 py-2 border-b border-[var(--hairline)] flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-xs z-40 select-none">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-3 h-3" />
          Modo Demostración
        </span>
        <span className="text-[var(--ink-secondary)] hidden sm:inline">
          Empresa simulada: <strong className="text-[var(--ink)]">TechConsulting Soluciones S.L.</strong> (CIF B-88776655)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTour}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--ink)] font-semibold text-[11px] transition-all cursor-pointer border border-[var(--hairline)]"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Guía: ¿Cómo funciona Pliego AI?</span>
        </button>

        <button
          onClick={handleRegisterCompany}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-[10px] bg-[var(--primary)] hover:opacity-90 text-white font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
        >
          <span>Dar de alta mi empresa</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={handleExitDemo}
          className="p-1.5 rounded-[10px] text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          title="Salir de la demostración"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
