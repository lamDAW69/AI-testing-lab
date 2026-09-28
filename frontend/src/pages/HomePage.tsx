import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EligibilityBadge, DecisionBadge, ValidityBadge } from '../components/ui/Badge';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { PortfolioItem } from '../types/portfolio';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { portfolio, tenders, unreadAlertsCount } = useData();

  // Nombre de usuario 100% dinámico según sesión autenticada
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Luis';

  const criticalBlockersCount = portfolio.filter((p) => p.hasBlockers).length;

  // Fecha dinámica en formato legible
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="space-y-8 select-none">
      {/* 1. HERO EDITORIAL DINÁMICO + ASISTENTE IA GLASS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lado izquierdo: Tipografía unificada moderna y saludo dinámico */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-7 space-y-2 pt-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#8F8B92]">
              {capitalizedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#161616] tracking-tight leading-[1.12]">
            Hola, {firstName}.
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-[#68656A] tracking-tight leading-snug">
            {portfolio.length} oportunidades en seguimiento en tu portfolio.
          </p>
        </motion.div>

        {/* Lado derecho: Asistente IA Flotante Glass con micro-interacciones */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-5 p-5 rounded-[22px] bg-white/65 backdrop-blur-[24px] border border-white/80 shadow-[0_12px_40px_rgba(20,20,30,0.06)] hover:shadow-[0_16px_48px_rgba(20,20,30,0.09)] hover:border-white transition-all space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#695CFF]">
              <span className="text-sm">✦</span>
              <span>Asistente de Precalificación</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEEAFE] text-[#5749F5] font-semibold">
              IA Activa
            </span>
          </div>

          <p className="text-xs text-[#68656A] leading-relaxed">
            ¿En qué puedo ayudarte hoy? Cotejo pliegos oficiales contra el dossier de solvencias de tu empresa.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/app/portfolio/t-101')}
              className="px-3.5 py-1.5 rounded-[11px] bg-white/80 hover:bg-white border border-[rgba(20,20,20,0.08)] hover:border-[#695CFF]/40 text-xs font-semibold text-[#161616] hover:text-[#5749F5] transition-all cursor-pointer shadow-2xs"
            >
              Analiza este pliego
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/app/portfolio')}
              className="px-3.5 py-1.5 rounded-[11px] bg-white/80 hover:bg-white border border-[rgba(20,20,20,0.08)] hover:border-[#695CFF]/40 text-xs font-semibold text-[#161616] hover:text-[#5749F5] transition-all cursor-pointer shadow-2xs"
            >
              Compara requisitos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/app/catalogo')}
              className="px-3.5 py-1.5 rounded-[11px] bg-white/80 hover:bg-white border border-[rgba(20,20,20,0.08)] hover:border-[#695CFF]/40 text-xs font-semibold text-[#161616] hover:text-[#5749F5] transition-all cursor-pointer shadow-2xs"
            >
              Busca en PLACSP
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 2. ACCIÓN PRIORITARIA VIVA: Gran dominancia visual de la adenda */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="p-5 sm:p-6 rounded-[22px] bg-white/80 backdrop-blur-[20px] border-l-[4px] border-l-[#F25A5A] border-t border-r border-b border-white/80 shadow-[0_8px_30px_rgba(242,90,90,0.07)] hover:shadow-[0_16px_40px_rgba(242,90,90,0.12)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#D93838]">
                Prioridad Alta · Cambio Documental
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F6F3EF] text-[#161616] font-semibold">
                EXP-2026/00941
              </span>
            </div>
            <h2 className="text-base font-bold text-[#161616] mt-1 tracking-tight">
              Servicio de desarrollo y modernización cloud para la DGT
            </h2>
            <p className="text-xs text-[#68656A] mt-1 leading-relaxed max-w-2xl">
              El órgano de contratación ha publicado la <strong>Adenda v2 en PLACSP</strong> modificando cláusulas técnicas mínimas de ciberseguridad. El análisis anterior ya no es vinculante.
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/app/portfolio/t-101')}
          className="shrink-0 shadow-sm"
        >
          Revisar Cambios
        </Button>
      </motion.div>

      {/* 3. MÉTRICAS CLAVE VIVAS: Cards con animación táctil al pasar el ratón */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/app/catalogo')}
          className="p-5 rounded-[20px] bg-white/70 backdrop-blur-[18px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] hover:border-[#695CFF]/30 transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-[#68656A] group-hover:text-[#161616] transition-colors block">
            Licitaciones Activas
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-[#161616] mt-1.5 group-hover:text-[#695CFF] transition-colors">
            {tenders.length}
          </div>
          <span className="text-[11px] text-[#8F8B92] mt-1 block">
            En seguimiento PLACSP
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/app/portfolio')}
          className="p-5 rounded-[20px] bg-white/70 backdrop-blur-[18px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] hover:border-[#695CFF]/40 transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-[#68656A] group-hover:text-[#161616] transition-colors block">
            En Curso / Análisis
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-[#5749F5] mt-1.5">
            {portfolio.length}
          </div>
          <span className="text-[11px] text-[#695CFF] font-medium mt-1 block">
            Evaluándose con IA
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/app/portfolio')}
          className="p-5 rounded-[20px] bg-white/70 backdrop-blur-[18px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(242,90,90,0.1)] hover:border-[#F25A5A]/40 transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-[#68656A] group-hover:text-[#161616] transition-colors block">
            Bloqueos Críticos
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-[#D93838] mt-1.5">
            {criticalBlockersCount}
          </div>
          <span className="text-[11px] text-[#D93838] font-medium mt-1 block">
            Requieren decisión
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/app/alertas')}
          className="p-5 rounded-[20px] bg-white/70 backdrop-blur-[18px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(245,158,11,0.1)] hover:border-[#F59E0B]/40 transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-[#68656A] group-hover:text-[#161616] transition-colors block">
            Alertas No Leídas
          </span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-[#161616] mt-1.5 group-hover:text-[#975A16] transition-colors">
            {unreadAlertsCount}
          </div>
          <span className="text-[11px] text-[#975A16] font-medium mt-1 block">
            {unreadAlertsCount > 0 ? `${unreadAlertsCount} pendientes` : 'Al día'}
          </span>
        </motion.div>
      </div>

      {/* 4. EXPEDIENTES EN SEGUIMIENTO CON ANIMACIÓN AL PASAR EL RATÓN */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#161616] tracking-tight">
              Oportunidades en Preparación
            </h2>
            <p className="text-xs text-[#68656A]">
              Expedientes precalificados frente a tu Dossier que requieren supervisión técnica
            </p>
          </div>
          <Link
            to="/app/portfolio"
            className="text-xs text-[#695CFF] hover:text-[#5749F5] transition-colors flex items-center gap-1 font-bold"
          >
            <span>Ver todo el portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {portfolio.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3, scale: 1.004 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              onClick={() => navigate(`/app/portfolio/${item.tenderId}`)}
              className={`p-5 rounded-[20px] bg-white/80 backdrop-blur-[18px] border transition-all cursor-pointer shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] group ${
                item.hasBlockers
                  ? 'border-l-[4px] border-l-[#F25A5A] border-t border-r border-b border-white/80'
                  : 'border border-white/80 hover:border-[#695CFF]/30'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-[8px] bg-[#EEEAE5] text-[#161616] font-semibold">
                      {item.fileReference}
                    </span>
                    <DecisionBadge decision={item.decision} />
                    <ValidityBadge validity={item.validity} />
                  </div>

                  <h3 className="text-sm font-bold text-[#161616] group-hover:text-[#695CFF] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-xs text-[#68656A]">
                    {item.contractingAuthority}
                  </div>

                  {item.hasBlockers && item.blockerSummary && (
                    <div className="p-2.5 rounded-[11px] bg-[#FEF0F0]/80 border border-[#FCD2D2] text-xs text-[#D93838] flex items-center gap-2 mt-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">{item.blockerSummary}</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col justify-between sm:items-end gap-3 shrink-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8F8B92] font-mono uppercase tracking-wider block">
                      Presupuesto Base
                    </span>
                    <span className="text-sm font-bold text-[#161616] font-mono tabular-nums">
                      {formatCurrency(item.budgetAmount)}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8F8B92] font-mono uppercase tracking-wider block">
                      Plazo
                    </span>
                    <span className="text-xs text-[#975A16] font-semibold">
                      {formatDeadlineDays(item.submissionDeadline).label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#695CFF] font-bold group-hover:translate-x-1 transition-transform">
                    <span>Auditar Expediente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
