import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Search,
  Check,
  Circle,
  FileText,
  Clock,
  Building2,
  FolderOpen,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { portfolio, tenders } = useData();

  // Nombre de usuario para el saludo editorial
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Marta';

  // Fecha en formato editorial español: "Miércoles, 24 de septiembre"
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Oportunidades que requieren atención
  const attentionCount = portfolio.filter(
    (p) => p.hasBlockers || p.validity === 'REQUIRES_REANALYSIS'
  ).length || 4;

  const priorityItems = portfolio.slice(0, 3);

  return (
    <div className="space-y-8 select-none">
      {/* 13 & 14. HERO DE INICIO & AI QUICK PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lado Izquierdo: Bienvenida Editorial (Sección 14) */}
        <section className="lg:col-span-7 pt-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#929097] mb-2">
            {capitalizedDate}
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-[-0.035em] leading-[0.98] text-[#171719] mb-3">
            <span>Hola, {firstName}.</span>
            <br />
            <span className="text-[#555159]">
              {attentionCount} oportunidades<br />
              necesitan tu atención.
            </span>
          </h1>
        </section>

        {/* Lado Derecho: AI Quick Panel (Sección 15) */}
        <aside className="lg:col-span-5 ai-panel">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#685cff]">
              <span>✦</span>
              <span>Pliego AI</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eeeaff] text-[#685cff] font-semibold border border-[#d5ccfe]">
              Beta
            </span>
          </div>

          <p className="text-xs text-[#69666d] mb-4">
            ¿En qué puedo ayudarte hoy?
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/app/portfolio/t-101')}
              className="px-3 py-1.5 rounded-[10px] bg-white/80 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Analiza este pliego
            </button>
            <button
              onClick={() => navigate('/app/portfolio')}
              className="px-3 py-1.5 rounded-[10px] bg-white/80 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Compara requisitos
            </button>
            <button
              onClick={() => navigate('/app/catalogo')}
              className="px-3 py-1.5 rounded-[10px] bg-white/80 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Busca oportunidades
            </button>
            <button
              onClick={() => navigate('/app/portfolio/t-101')}
              className="px-3 py-1.5 rounded-[10px] bg-white/80 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Resume documento
            </button>
          </div>
        </aside>
      </div>

      {/* 16. MÉTRICAS DE INICIO (Sección 16) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* 1. Activas */}
        <div className="glass-soft p-4 rounded-[16px] border border-white/60">
          <div className="text-2xl sm:text-3xl font-bold text-[#171719] tabular-nums tracking-tight">
            12
          </div>
          <div className="text-xs font-semibold text-[#171719] mt-0.5">
            Oportunidades activas
          </div>
          <div className="text-[11px] text-[#218a58] font-medium mt-1">
            +20% vs mes anterior
          </div>
        </div>

        {/* 2. En curso */}
        <div className="glass-soft p-4 rounded-[16px] border border-white/60">
          <div className="text-2xl sm:text-3xl font-bold text-[#171719] tabular-nums tracking-tight">
            7
          </div>
          <div className="text-xs font-semibold text-[#171719] mt-0.5">
            En curso
          </div>
          <div className="text-[11px] text-[#69666d] font-medium mt-1">
            +2 nuevas esta semana
          </div>
        </div>

        {/* 3. Bloqueos */}
        <div className="glass-soft p-4 rounded-[16px] border border-white/60">
          <div className="text-2xl sm:text-3xl font-bold text-[#e44848] tabular-nums tracking-tight">
            3
          </div>
          <div className="text-xs font-semibold text-[#171719] mt-0.5">
            Bloqueos
          </div>
          <div className="text-[11px] text-[#e44848] font-medium mt-1">
            Requieren tu atención
          </div>
        </div>

        {/* 4. Cobertura Documental (MANDATO: NO PROBABILIDAD DE GANAR) */}
        <div className="glass-soft p-4 rounded-[16px] border border-white/60">
          <div className="text-2xl sm:text-3xl font-bold text-[#685cff] tabular-nums tracking-tight">
            86%
          </div>
          <div className="text-xs font-semibold text-[#171719] mt-0.5">
            Cobertura documental
          </div>
          <div className="text-[11px] text-[#69666d] font-medium mt-1">
            Evidencia acreditada
          </div>
        </div>
      </div>

      {/* 17. BLOQUE CENTRAL: PRIORIDADES, ESTADO DE ANÁLISIS, ACTIVIDAD (Sección 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Columna 1 (1.55fr -> col-span-6): Oportunidades Prioritarias */}
        <div className="lg:col-span-6 surface p-5 rounded-[20px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.08)]">
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

            <div className="divide-y divide-[rgba(30,24,38,0.06)] mt-2">
              {priorityItems.map((item) => {
                const deadlineDays = Math.ceil(
                  (new Date(item.submissionDeadline).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
                const isCriticalDeadline = deadlineDays <= 7 && deadlineDays > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/app/portfolio/${item.tenderId}`)}
                    className="py-3 px-2 rounded-[12px] hover:bg-white/80 transition-all cursor-pointer group flex items-center gap-3.5"
                  >
                    {/* Thumbnail o Abstracción Geométrica (Sección 63) */}
                    <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#f3eeea] to-[#e7e1ff] border border-[rgba(30,24,38,0.06)] flex items-center justify-center shrink-0 text-[#685cff]">
                      <FileText className="w-5 h-5 opacity-80" />
                    </div>

                    {/* Información del Expediente */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#69666d] truncate">
                        {item.contractingAuthority}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.hasBlockers && (
                          <StatusBadge tone="danger" icon="warning">
                            Bloqueo
                          </StatusBadge>
                        )}
                        {item.validity === 'REQUIRES_REANALYSIS' && (
                          <StatusBadge tone="warning" icon="warning">
                            Cambio documental
                          </StatusBadge>
                        )}
                        <span className="text-[11px] font-mono text-[#69666d] tabular-nums">
                          {formatCurrency(item.budgetAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Plazo */}
                    <div className="text-right shrink-0">
                      <div className="text-xs text-[#171719] font-medium">
                        {new Intl.DateTimeFormat('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        }).format(new Date(item.submissionDeadline))}
                      </div>
                      <div
                        className={`text-[11px] font-semibold tabular-nums ${
                          isCriticalDeadline ? 'text-[#e44848]' : 'text-[#69666d]'
                        }`}
                      >
                        {formatDeadlineDays(item.submissionDeadline).label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna 2 (0.9fr -> col-span-3): Estado de Análisis Técnico (Sección 19) */}
        <div className="lg:col-span-3 surface p-5 rounded-[20px] flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[rgba(30,24,38,0.08)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Estado de análisis técnico
              </h2>
            </div>

            {/* Círculo de progreso técnico de procesamiento (MANDATO: 17 de 24 docs) */}
            <div className="my-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#efedef]"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#685cff]"
                    strokeDasharray="78, 100"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#171719] font-ui tabular-nums">
                    78%
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-[#171719] mt-2">
                Análisis en curso
              </p>
              <p className="text-[11px] text-[#69666d]">
                17 de 24 documentos procesados
              </p>
            </div>

            {/* Checklist de estados de extracción técnica */}
            <div className="space-y-2 text-xs pt-1 border-t border-[rgba(30,24,38,0.06)]">
              <div className="flex items-center justify-between text-[#218a58]">
                <span>Documentación procesada</span>
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between text-[#218a58]">
                <span>Extracción requisitos</span>
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between text-[#685cff] font-medium">
                <span>Análisis de elegibilidad</span>
                <span className="w-2 h-2 rounded-full bg-[#685cff] animate-ping inline-block" />
              </div>
              <div className="flex items-center justify-between text-[#929097]">
                <span>Generación resultados</span>
                <Circle className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3 (0.8fr -> col-span-3): Actividad Reciente (Sección 20) */}
        <div className="lg:col-span-3 surface p-5 rounded-[20px] flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[rgba(30,24,38,0.08)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Actividad reciente
              </h2>
            </div>

            {/* Timeline ligero: acciones críticas primero */}
            <div className="space-y-3.5 mt-3">
              {/* Evento crítico 1 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#ffeded] text-[#e44848] shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171719] leading-tight">
                    Cambio documental detectado
                  </p>
                  <p className="text-[11px] text-[#69666d]">
                    Plataforma contratación Estado
                  </p>
                  <span className="text-[10px] text-[#929097] font-mono">
                    Hace 2 horas
                  </span>
                </div>
              </div>

              {/* Evento informativo 2 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#eeeaff] text-[#685cff] shrink-0 mt-0.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171719] leading-tight">
                    Nuevo análisis completado
                  </p>
                  <p className="text-[11px] text-[#69666d]">
                    Servicio limpieza edificios
                  </p>
                  <span className="text-[10px] text-[#929097] font-mono">
                    Hace 4 horas
                  </span>
                </div>
              </div>

              {/* Evento colaborativo 3 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#efedef] text-[#69666d] shrink-0 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171719] leading-tight">
                    Documentación sincronizada
                  </p>
                  <p className="text-[11px] text-[#69666d]">
                    Ministerio de Interior · Lote 2
                  </p>
                  <span className="text-[10px] text-[#929097] font-mono">
                    Hace 6 horas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 21. CARDS INFERIORES DE INICIO (Sección 21) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Analiza una oportunidad */}
        <div className="surface p-5 rounded-[18px] flex flex-col justify-between interactive-card">
          <div>
            <div className="w-8 h-8 rounded-[10px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#171719]">
              Analiza una oportunidad
            </h3>
            <p className="text-xs text-[#69666d] mt-1.5 leading-relaxed">
              Selecciona una licitación pública y analízala con la evidencia de tu organización.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/catalogo')}
            className="mt-4 w-full py-2 px-3 rounded-[10px] bg-[#171719] hover:bg-[#28282b] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Buscar oportunidad
          </button>
        </div>

        {/* Card 2: Gestiona tu dossier */}
        <div className="surface p-5 rounded-[18px] flex flex-col justify-between interactive-card">
          <div>
            <div className="w-8 h-8 rounded-[10px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center mb-3">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#171719]">
              Gestiona tu dossier
            </h3>
            <p className="text-xs text-[#69666d] mt-1.5 leading-relaxed">
              Mantén actualizadas las certificaciones, solvencia y experiencia de tu empresa.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/dossier')}
            className="mt-4 w-full py-2 px-3 rounded-[10px] bg-white hover:bg-[#f5f1ed] text-[#171719] border border-[rgba(30,24,38,0.12)] text-xs font-medium transition-colors cursor-pointer"
          >
            Ir al dossier
          </button>
        </div>

        {/* Card 3: Explora el catálogo */}
        <div className="surface p-5 rounded-[18px] flex flex-col justify-between interactive-card">
          <div>
            <div className="w-8 h-8 rounded-[10px] bg-[#fff3db] text-[#ca8517] flex items-center justify-center mb-3">
              <FolderOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#171719]">
              Explora el catálogo
            </h3>
            <p className="text-xs text-[#69666d] mt-1.5 leading-relaxed">
              Descubre nuevos expedientes del sector público estatal y autonómico.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/catalogo')}
            className="mt-4 w-full py-2 px-3 rounded-[10px] bg-white hover:bg-[#f5f1ed] text-[#171719] border border-[rgba(30,24,38,0.12)] text-xs font-medium transition-colors cursor-pointer"
          >
            Ver catálogo oficial
          </button>
        </div>
      </div>
    </div>
  );
};
