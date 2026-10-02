import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Check,
  Circle,
  FileText,
  Building2,
  Filter,
  Layers,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  ExternalLink,
  ChevronRight,
  User,
  BellRing,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';
import { ProductTourModal } from '../components/layout/ProductTourModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();
  const { portfolio, tenders, alerts, certifications, evidences } = useData();
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  const firstName = user?.fullName === 'Operador Demo'
    ? 'Operador Demo (TechConsulting)'
    : user?.fullName
    ? user.fullName.split(' ')[0]
    : 'Marta';

  // Fecha en formato editorial español: "Miércoles, 24 de septiembre"
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Métricas dinámicas calculadas desde el store real del tenant
  const totalInPortfolio = portfolio.length;
  const inProgressCount = portfolio.filter(
    (p) => p.decision === 'REVIEW' || p.decision === 'UNDECIDED'
  ).length;
  const blockersCount = portfolio.filter(
    (p) => p.hasBlockers || p.validity === 'REQUIRES_REANALYSIS'
  ).length;
  const totalDossierAccreditations = certifications.length + evidences.length;

  // Oportunidades prioritarias (las que tienen bloqueos o fecha límite más próxima)
  const priorityOpportunities = [...portfolio]
    .sort((a, b) => {
      if ((a.hasBlockers || a.validity === 'REQUIRES_REANALYSIS') && !(b.hasBlockers || b.validity === 'REQUIRES_REANALYSIS')) return -1;
      if (!(a.hasBlockers || a.validity === 'REQUIRES_REANALYSIS') && (b.hasBlockers || b.validity === 'REQUIRES_REANALYSIS')) return 1;
      return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
    })
    .slice(0, 3);

  // Salud del pipeline de decisiones
  const decidedCount = portfolio.filter((p) => p.decision !== 'UNDECIDED').length;
  const pipelinePercent = totalInPortfolio > 0 ? Math.round((decidedCount / totalInPortfolio) * 100) : 0;
  const eligibleCount = portfolio.filter((p) => p.eligibility === 'POTENTIALLY_ELIGIBLE').length;

  // Actividad reciente desde las alertas reales
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-6 select-none">
      {/* Modal interactivo de Tour bajo demanda */}
      <ProductTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      {/* BANNER GUÍA DE DEMOSTRACIÓN (Solo visible en Modo Demo) */}
      {isDemoMode && (
        <section className="p-4 sm:p-5 rounded-[20px] bg-gradient-to-r from-[#eeeaff] via-white to-[#f6f4fb] border border-[#d5ccfe] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#685cff] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#685cff] bg-white px-2 py-0.5 rounded-full border border-[#d5ccfe]">
                  Demostración Interactiva
                </span>
                <span className="text-xs font-bold text-[#171719]">
                  ¿Cómo funciona Pliego AI?
                </span>
              </div>
              <p className="text-xs text-[#69666d] mt-1 leading-relaxed max-w-2xl">
                Has entrado con la empresa de prueba <strong>TechConsulting Soluciones S.L.</strong>. La IA monitoriza el feed de PLACSP, sella pliegos con hash SHA-256 y precalifica solvencia técnica y económica frente a tu dossier.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white hover:bg-white/80 border border-[#685cff]/30 text-[#685cff] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ver Guía Paso a Paso</span>
            </button>
            <button
              onClick={() => navigate('/app/catalogo')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#685cff] hover:bg-[#5544ea] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span>1. Explorar Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 1. HERO DE INICIO: EDITORIAL + DOT-MATRIX + ACCESO OPERATIVO */}
      <section className="home-hero grid grid-cols-1 lg:grid-cols-[minmax(400px,0.95fr)_minmax(480px,1.05fr)] gap-8 lg:gap-10 items-center">
        {/* Lado Izquierdo: Saludo editorial + oportunidades en Dot-Matrix */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#929097] mb-2 flex items-center gap-2">
            <span>{capitalizedDate}</span>
          </p>
          <h1 className="home-greeting text-[#171719]">
            Hola, {firstName}.
          </h1>
        </div>

        {/* Lado Derecho: Acceso Rápido y Panel Operativo */}
        <aside className="ai-command">
          <div className="flex items-center justify-between mb-3">
            <div className="w-7 h-7 rounded-full bg-[#685cff]/10 flex items-center justify-center text-[#685cff]">
              <span className="text-sm font-bold">◈</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#171719]">Flujos Operativos</span>
              <button
                onClick={() => navigate('/app/portfolio')}
                className="w-6 h-6 rounded-full bg-[#685cff] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-xs"
                title="Ver Cartera"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-[#171719] mb-4">
            Gestión y Control de Licitaciones
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/app/catalogo')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#685cff] border border-[#685cff]/20 hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Explorar Catálogo
            </button>
            <button
              onClick={() => navigate('/app/portfolio')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Ver Cartera
            </button>
            <button
              onClick={() => navigate('/app/alertas')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Bandeja de Alertas
            </button>
            <button
              onClick={() => navigate('/app/dossier')}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              <span>Gestionar Dossier</span>
              <ArrowRight className="w-3 h-3 text-[#929097]" />
            </button>
          </div>
        </aside>
      </section>

      {/* 2. MÉTRICAS DINÁMICAS BASADAS EN LOS DATOS REALES DEL TENANT */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Métrica 1: Oportunidades en cartera */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-white/80 border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#171719] shrink-0 shadow-2xs">
            <Layers className="w-5 h-5 text-[#423d4c]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {totalInPortfolio}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Oportunidades en cartera
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              {totalInPortfolio === 1 ? '1 expediente analizado' : `${totalInPortfolio} expedientes analizados`}
            </div>
          </div>
        </div>

        {/* Métrica 2: En curso */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#eeeaff] border border-[#d5ccfe] flex items-center justify-center text-[#685cff] shrink-0 shadow-2xs">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {inProgressCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              En evaluación
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              Pendientes de decisión
            </div>
          </div>
        </div>

        {/* Métrica 3: Bloqueos */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#ffeded] border border-[#fcd2d2] flex items-center justify-center text-[#e44848] shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e44848] tabular-nums tracking-tight leading-none">
              {blockersCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Bloqueos o adendas
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              {blockersCount > 0 ? 'Requieren tu atención' : 'Cartera al día'}
            </div>
          </div>
        </div>

        {/* Métrica 4: Acreditaciones */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#e8f7ef] border border-[#c6f0d4] flex items-center justify-center text-[#218a58] shrink-0 shadow-2xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {totalDossierAccreditations}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Acreditaciones en dossier
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              {certifications.length} certs · {evidences.length} evidencias
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOQUE CENTRAL: PRIORIDADES, ESTADO DE ANÁLISIS, ACTIVIDAD */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr_0.95fr] gap-4 items-stretch">
        {/* Columna 1: Oportunidades prioritarias */}
        <div className="surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.06)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Oportunidades prioritarias
              </h2>
              <Link
                to="/app/portfolio"
                className="text-xs font-medium text-[#685cff] hover:underline flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[rgba(30,24,38,0.055)] mt-1">
              {priorityOpportunities.length === 0 ? (
                <div className="py-8 text-center text-[#69666d]">
                  <p className="text-xs">No tienes licitaciones en seguimiento actualmente.</p>
                  <button
                    onClick={() => navigate('/app/catalogo')}
                    className="mt-3 text-xs font-semibold text-[#685cff] hover:underline cursor-pointer"
                  >
                    Explorar el catálogo oficial →
                  </button>
                </div>
              ) : (
                priorityOpportunities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/app/portfolio/${item.tenderId}`)}
                    className="py-3 px-2 rounded-[14px] hover:bg-white/70 transition-all cursor-pointer group flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-[12px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center shrink-0 border border-white/80 shadow-2xs font-mono font-bold text-[10px]">
                      {item.fileReference.length > 12 ? item.fileReference.slice(0, 12) : item.fileReference}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#69666d] truncate">
                        {item.contractingAuthority}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.hasBlockers ? (
                          <StatusBadge tone="danger" icon="warning">
                            Bloqueo crítico
                          </StatusBadge>
                        ) : item.validity === 'REQUIRES_REANALYSIS' ? (
                          <StatusBadge tone="warning" icon="warning">
                            Cambio documental
                          </StatusBadge>
                        ) : item.decision === 'PURSUE' ? (
                          <StatusBadge tone="success" icon="check">
                            Presentar oferta
                          </StatusBadge>
                        ) : item.decision === 'DISCARD' ? (
                          <StatusBadge tone="neutral">Descartada</StatusBadge>
                        ) : (
                          <StatusBadge tone="primary" icon="clock">
                            En evaluación
                          </StatusBadge>
                        )}
                        <span className="text-[11px] text-[#69666d] bg-black/[0.04] px-2 py-0.5 rounded-full border border-black/[0.04]">
                          {formatDeadlineDays(item.submissionDeadline).label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#171719] tabular-nums font-mono block">
                        {formatCurrency(item.budgetAmount)}
                      </span>
                      <span className="text-[11px] text-[#69666d] block">
                        {new Date(item.submissionDeadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#929097] group-hover:text-[#171719] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna 2: Estado de análisis y salud de la cartera */}
        <div className="surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.06)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Salud de la cartera
              </h2>
              <Link
                to="/app/portfolio"
                className="text-xs font-medium text-[#685cff] hover:underline flex items-center gap-1"
              >
                <span>Ver cartera</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="my-4 flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#efedef]"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#685cff]"
                    strokeDasharray={`${pipelinePercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#171719] font-ui tabular-nums">
                    {pipelinePercent}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#171719]">
                  Decisiones tomadas
                </p>
                <p className="text-[11px] text-[#69666d] mt-0.5 leading-relaxed">
                  {decidedCount} de {totalInPortfolio} oportunidades cuentan con decisión estratégica.
                </p>
              </div>
            </div>

            {/* Desglose dinámico de la cartera */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-[rgba(30,24,38,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#e8f7ef] text-[#218a58] flex items-center justify-center text-[10px]">✓</span>
                  <span className="text-[#171719] font-medium">Potencialmente elegibles</span>
                </div>
                <span className="text-[11px] text-[#218a58] font-bold tabular-nums">{eligibleCount} licitaciones</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#eeeaff] text-[#685cff] flex items-center justify-center text-[10px]">●</span>
                  <span className="text-[#171719] font-medium">En evaluación / revisión</span>
                </div>
                <span className="text-[11px] text-[#685cff] font-semibold tabular-nums">{inProgressCount} licitaciones</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#ffeded] text-[#e44848] flex items-center justify-center text-[10px]">!</span>
                  <span className="text-[#171719] font-medium">Bloqueos o reanálisis</span>
                </div>
                <span className="text-[11px] text-[#e44848] font-bold tabular-nums">{blockersCount} {blockersCount === 1 ? 'bloqueo' : 'bloqueos'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-stone-100 text-[#69666d] flex items-center justify-center text-[10px]">◈</span>
                  <span className="text-[#69666d]">Total en seguimiento</span>
                </div>
                <span className="text-[11px] text-[#69666d] font-mono tabular-nums">{totalInPortfolio} expedientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Alertas recientes dinámicas */}
        <div className="surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.06)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Alertas recientes
              </h2>
              <Link
                to="/app/alertas"
                className="text-xs font-medium text-[#685cff] hover:underline flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {recentAlerts.length === 0 ? (
                <div className="py-8 text-center text-[#69666d]">
                  <p className="text-xs">No hay alertas activas en tu bandeja.</p>
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => navigate(`/app/portfolio/${alert.tenderId}`)}
                    className="flex items-start gap-2.5 p-1.5 rounded-[10px] hover:bg-white/60 transition-colors cursor-pointer"
                  >
                    <div
                      className={`p-1 rounded-md shrink-0 mt-0.5 ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-[#ffeded] text-[#e44848]'
                          : alert.severity === 'WARNING'
                          ? 'bg-[#fff3db] text-[#ca8517]'
                          : 'bg-[#eeeaff] text-[#685cff]'
                      }`}
                    >
                      {alert.severity === 'CRITICAL' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : alert.severity === 'WARNING' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <BellRing className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-[#69666d] truncate">
                        {alert.tenderTitle || alert.message}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#929097] font-mono shrink-0">
                      {new Date(alert.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLOQUE INFERIOR: ACCIONES Y COBERTURA DOCUMENTAL */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Precalifica un expediente de la PLACSP */}
        <div className="surface p-5 border border-[#d5ccfe]/80 bg-white/75 flex flex-col justify-between interactive-card">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[9px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#171719]">
                Precalifica una licitación
              </h3>
            </div>
            <p className="text-xs text-[#69666d] leading-relaxed mb-4">
              Selecciona cualquier expediente del catálogo oficial para analizar requisitos, solvencia y riesgos frente a tu dossier.
            </p>
          </div>

          <button
            onClick={() => navigate('/app/catalogo')}
            className="w-full p-3 rounded-[14px] bg-[#f8f6fc]/80 hover:bg-[#eeeaff]/60 border border-[#685cff]/30 hover:border-[#685cff] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-semibold text-[#685cff]"
          >
            <span>Explorar catálogo oficial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Gestiona tu dossier con datos dinámicos */}
        <div
          onClick={() => navigate('/app/dossier')}
          className="surface p-5 flex flex-col justify-between interactive-card cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[9px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#171719]">
                Gestiona tu dossier
              </h3>
            </div>
            <p className="text-xs text-[#69666d] leading-relaxed mb-4">
              Mantén actualizadas tus acreditaciones empresariales, solvencia y certificaciones activas.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[rgba(30,24,38,0.06)]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#171719] tabular-nums font-ui">
                  {totalDossierAccreditations}
                </span>
                <span className="text-[11px] text-[#69666d]">Acreditaciones</span>
              </div>
              <div className="text-[10px] text-[#218a58] font-medium mt-0.5">
                {certifications.filter((c) => c.status === 'VERIFIED').length} verificadas · {evidences.length} evidencias
              </div>
            </div>

            {/* Fichas apiladas de certificaciones reales */}
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {certifications.slice(0, 3).map((cert) => (
                  <div
                    key={cert.id}
                    title={cert.name}
                    className="w-7 h-8 rounded-[4px] bg-white border border-[rgba(30,24,38,0.12)] shadow-2xs text-[8px] flex items-center justify-center font-mono font-bold text-[#171719] uppercase overflow-hidden"
                  >
                    {cert.name.slice(0, 3)}
                  </div>
                ))}
              </div>
              {certifications.length > 3 && (
                <span className="text-[11px] font-semibold text-[#685cff] ml-1">
                  +{certifications.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Explora el catálogo con acceso directo */}
        <div className="surface p-5 relative overflow-hidden flex flex-col justify-between interactive-card">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[9px] bg-[#fff3db] text-[#ca8517] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#171719]">
                Explora el catálogo
              </h3>
            </div>
            <p className="text-xs text-[#69666d] leading-relaxed max-w-[210px] mb-4">
              Busca nuevas oportunidades públicas y filtra por sector, importe o plazos de entrega.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={() => navigate('/app/catalogo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#171719] hover:bg-[#171719] hover:text-white border border-[rgba(30,24,38,0.1)] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>Buscar oportunidades</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gráfico de Cinta 3D translúcida en esquina inferior derecha */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 pointer-events-none opacity-85">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M20,80 C40,30 70,20 85,50 C95,70 70,95 40,85 C20,75 10,90 20,80 Z"
                fill="url(#ribbon-grad)"
              />
              <path
                d="M35,65 C55,25 75,35 80,60 C85,75 60,90 35,65 Z"
                fill="url(#ribbon-grad-2)"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8d7dff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#5544ea" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#baabff" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="ribbon-grad-2" x1="10%" y1="90%" x2="90%" y2="10%">
                  <stop offset="0%" stopColor="#b4a7ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4f3fe0" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};
