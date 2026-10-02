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
    <div className="bg-gradient-to-r from-[#171719] via-[#211E2E] to-[#171719] text-white px-3 sm:px-6 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-xs z-40 select-none">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#685cff] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-3 h-3" />
          Modo Demostración
        </span>
        <span className="text-white/80 hidden sm:inline">
          Empresa simulada: <strong className="text-white">TechConsulting Soluciones S.L.</strong> (CIF B-88776655)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTour}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-white/15 hover:bg-white/25 text-white font-semibold text-[11px] transition-all cursor-pointer border border-white/10"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#A599FF]" />
          <span>Guía: ¿Cómo funciona Pliego AI?</span>
        </button>

        <button
          onClick={handleRegisterCompany}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-[10px] bg-[#685cff] hover:bg-[#5544ea] text-white font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
        >
          <span>Dar de alta mi empresa</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={handleExitDemo}
          className="p-1.5 rounded-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Salir de la demostración"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
