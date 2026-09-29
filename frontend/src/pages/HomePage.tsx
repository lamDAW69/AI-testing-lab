import React from 'react';
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
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { portfolio } = useData();

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Marta';

  // Fecha en formato editorial español: "Miércoles, 24 de septiembre"
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const attentionCount = portfolio.filter(
    (p) => p.hasBlockers || p.validity === 'REQUIRES_REANALYSIS'
  ).length || 4;

  return (
    <div className="space-y-6 select-none">
      {/* 1. HERO DE INICIO: EDITORIAL + DOT-MATRIX + PANEL IA CON HALO */}
      <section className="home-hero grid grid-cols-1 lg:grid-cols-[minmax(400px,0.95fr)_minmax(480px,1.05fr)] gap-8 lg:gap-10 items-center">
        {/* Lado Izquierdo: Saludo editorial + 4 oportunidades en Dot-Matrix */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#929097] mb-2 flex items-center gap-2">
            <span>{capitalizedDate}</span>
          </p>
          <h1 className="home-greeting text-[#171719]">
            Hola, {firstName}.
          </h1>
          <div className="home-attention mt-1.5">
            {attentionCount} oportunidades<br />
            necesitan tu atención.
          </div>
        </div>

        {/* Lado Derecho: Panel IA con Halo Difuso y Botón de flecha circular */}
        <aside className="ai-command">
          <div className="flex items-center justify-between mb-3">
            <div className="w-7 h-7 rounded-full bg-[#685cff]/10 flex items-center justify-center text-[#685cff]">
              <span className="text-sm font-bold">✦</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#171719]">Pliego AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eeeaff] text-[#685cff] font-semibold">
                Beta
              </span>
              <button
                onClick={() => navigate('/app/catalogo')}
                className="w-6 h-6 rounded-full bg-[#685cff] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-xs"
                title="Explorar"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-[#171719] mb-4">
            ¿En qué puedo ayudarte hoy?
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/app/portfolio/t-101')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#685cff] border border-[#685cff]/20 hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Analiza este pliego
            </button>
            <button
              onClick={() => navigate('/app/portfolio')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Compara requisitos
            </button>
            <button
              onClick={() => navigate('/app/catalogo')}
              className="px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              Busca oportunidades
            </button>
            <button
              onClick={() => navigate('/app/portfolio/t-101')}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[12px] bg-white/75 hover:bg-white text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/40 shadow-xs transition-all cursor-pointer"
            >
              <span>Resume un documento</span>
              <ArrowRight className="w-3 h-3 text-[#929097]" />
            </button>
          </div>
        </aside>
      </section>

      {/* 2. MÉTRICAS CON BADGES CUADRADOS EXACTOS DEL MOCKUP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Métrica 1: 12 Oportunidades activas */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-white/80 border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#171719] shrink-0 shadow-2xs">
            <Layers className="w-5 h-5 text-[#423d4c]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              12
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Oportunidades activas
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              +20% vs. mes anterior
            </div>
          </div>
        </div>

        {/* Métrica 2: 7 En curso */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#eeeaff] border border-[#d5ccfe] flex items-center justify-center text-[#685cff] shrink-0 shadow-2xs">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              7
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              En curso
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              +2 nuevas esta semana
            </div>
          </div>
        </div>

        {/* Métrica 3: 3 Bloqueos */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#ffeded] border border-[#fcd2d2] flex items-center justify-center text-[#e44848] shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e44848] tabular-nums tracking-tight leading-none">
              3
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Bloqueos
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              Requieren tu atención
            </div>
          </div>
        </div>

        {/* Métrica 4: 86% Cobertura Documental */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#e8f7ef] border border-[#c6f0d4] flex items-center justify-center text-[#218a58] shrink-0 shadow-2xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              86%
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Cobertura documental
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              +12% vs. mes anterior
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
              {/* Oportunidad 1: Ministerio de Transformación Digital */}
              <div
                onClick={() => navigate('/app/portfolio/t-101')}
                className="py-3 px-2 rounded-[14px] hover:bg-white/70 transition-all cursor-pointer group flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-[12px] bg-stone-200 overflow-hidden shrink-0 border border-white/80 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=160&q=80"
                    alt="Ministerio TIC"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                    Servicio de mantenimiento de infraestructura TIC
                  </h3>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Ministerio de Transformación Digital
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <StatusBadge tone="danger" icon="warning">
                      Alta prioridad
                    </StatusBadge>
                    <StatusBadge tone="danger" icon="warning">
                      Cambio documental
                    </StatusBadge>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#171719] tabular-nums font-mono block">
                    12,5 M€
                  </span>
                  <span className="text-[11px] text-[#69666d] block">
                    24 oct 2026
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#929097] group-hover:text-[#171719] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Oportunidad 2: Junta de Andalucía */}
              <div
                onClick={() => navigate('/app/portfolio/t-102')}
                className="py-3 px-2 rounded-[14px] hover:bg-white/70 transition-all cursor-pointer group flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-[12px] bg-stone-200 overflow-hidden shrink-0 border border-white/80 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=160&q=80"
                    alt="Junta de Andalucía"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                    Asistencia técnica para la gestión de fondos europeos
                  </h3>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Junta de Andalucía
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <StatusBadge tone="primary" icon="clock">
                      En análisis
                    </StatusBadge>
                    <span className="text-[11px] text-[#69666d] bg-black/[0.04] px-2 py-0.5 rounded-full border border-black/[0.04]">
                      Entrega en 7 días
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#171719] tabular-nums font-mono block">
                    8,2 M€
                  </span>
                  <span className="text-[11px] text-[#69666d] block">
                    27 oct 2026
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#929097] group-hover:text-[#171719] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Oportunidad 3: Ayuntamiento de Madrid */}
              <div
                onClick={() => navigate('/app/portfolio/t-103')}
                className="py-3 px-2 rounded-[14px] hover:bg-white/70 transition-all cursor-pointer group flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-[12px] bg-stone-200 overflow-hidden shrink-0 border border-white/80 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=160&q=80"
                    alt="Ayuntamiento de Madrid"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                    Desarrollo de plataforma de administración electrónica
                  </h3>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Ayuntamiento de Madrid
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <StatusBadge tone="primary" icon="clock">
                      En propuesta
                    </StatusBadge>
                    <span className="text-[11px] text-[#69666d] bg-black/[0.04] px-2 py-0.5 rounded-full border border-black/[0.04]">
                      Entrega en 12 días
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#171719] tabular-nums font-mono block">
                    4,1 M€
                  </span>
                  <span className="text-[11px] text-[#69666d] block">
                    2 nov 2026
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#929097] group-hover:text-[#171719] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Estado de análisis técnico */}
        <div className="surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.06)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Estado de análisis
              </h2>
              <Link
                to="/app/portfolio"
                className="text-xs font-medium text-[#685cff] hover:underline flex items-center gap-1"
              >
                <span>Ver todas</span>
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
                    strokeDasharray="78, 100"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#171719] font-ui tabular-nums">
                    78%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#171719]">
                  Análisis en curso
                </p>
                <p className="text-[11px] text-[#69666d] mt-0.5 leading-relaxed">
                  La IA está analizando la documentación y extrayendo los requisitos clave.
                </p>
              </div>
            </div>

            {/* Checklist de 4 pasos */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-[rgba(30,24,38,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#e8f7ef] text-[#218a58] flex items-center justify-center text-[10px]">✓</span>
                  <span className="text-[#171719] font-medium">Documentación procesada</span>
                </div>
                <span className="text-[11px] text-[#69666d]">17 de 24 documentos</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#eeeaff] text-[#685cff] flex items-center justify-center text-[10px]">✓</span>
                  <span className="text-[#171719] font-medium">Extracción de requisitos</span>
                </div>
                <span className="text-[11px] text-[#69666d]">124 requisitos identificados</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#685cff] text-white flex items-center justify-center text-[10px] animate-pulse">●</span>
                  <span className="text-[#685cff] font-semibold">Análisis de elegibilidad</span>
                </div>
                <span className="text-[11px] text-[#685cff]">En curso...</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#929097] text-[#929097] flex items-center justify-center text-[10px]">○</span>
                  <span className="text-[#929097]">Generación de resultados</span>
                </div>
                <span className="text-[11px] text-[#929097]">Pendiente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Actividad reciente (5 items) */}
        <div className="surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,24,38,0.06)]">
              <h2 className="text-sm font-semibold text-[#171719]">
                Actividad reciente
              </h2>
              <Link
                to="/app/alertas"
                className="text-xs font-medium text-[#685cff] hover:underline flex items-center gap-1"
              >
                <span>Ver toda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {/* Item 1 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#ffeded] text-[#e44848] shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                    Cambio documental detectado
                  </p>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Plataforma de contratación del Estado
                  </p>
                </div>
                <span className="text-[10px] text-[#929097] font-mono shrink-0">
                  Hace 2h
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#eeeaff] text-[#685cff] shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                    Nuevo análisis completado
                  </p>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Servicio de limpieza de edificios
                  </p>
                </div>
                <span className="text-[10px] text-[#929097] font-mono shrink-0">
                  Hace 4h
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-stone-100 text-[#171719] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#69666d]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                    María López ha comentado
                  </p>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Documento técnico · Lote 2
                  </p>
                </div>
                <span className="text-[10px] text-[#929097] font-mono shrink-0">
                  Hace 5h
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#ffeded] text-[#e44848] shrink-0 mt-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                    Se ha detectado un posible bloqueo
                  </p>
                  <p className="text-[11px] text-[#69666d] truncate">
                    Garantía provisional insuficiente
                  </p>
                </div>
                <span className="text-[10px] text-[#929097] font-mono shrink-0">
                  Hace 1d
                </span>
              </div>

              {/* Item 5 */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#eeeaff] text-[#685cff] shrink-0 mt-0.5">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171719] truncate leading-tight">
                    Nueva oportunidad relevante
                  </p>
                  <p className="text-[11px] text-[#69666d] truncate">
                    CPV 72000000 · Servicios TI
                  </p>
                </div>
                <span className="text-[10px] text-[#929097] font-mono shrink-0">
                  Hace 1d
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLOQUE INFERIOR: 3 CARDS EXACTAS AL MOCKUP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Analiza un nuevo pliego con caja de subida/selección */}
        <div className="surface p-5 border border-[#d5ccfe]/80 bg-white/75 flex flex-col justify-between interactive-card">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[9px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#171719]">
                Analiza un nuevo pliego
              </h3>
            </div>
            <p className="text-xs text-[#69666d] leading-relaxed mb-4">
              Sube la documentación o introduce la URL para analizar requisitos, riesgos y elegibilidad.
            </p>
          </div>

          <div
            onClick={() => navigate('/app/catalogo')}
            className="p-3.5 rounded-[14px] bg-[#f8f6fc]/80 border border-dashed border-[#685cff]/30 hover:border-[#685cff] flex items-center justify-center gap-2.5 cursor-pointer transition-colors group"
          >
            <FileText className="w-4 h-4 text-[#685cff]" />
            <div className="text-xs text-center">
              <span className="font-semibold text-[#171719] block">Arrastra un archivo aquí</span>
              <span className="text-[11px] text-[#685cff] group-hover:underline">o selecciona un documento</span>
            </div>
          </div>
        </div>

        {/* Card 2: Gestiona tu dossier con barra 82% y fichas apiladas */}
        <div className="surface p-5 flex flex-col justify-between interactive-card">
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
              Mantén actualizadas tus certificaciones, experiencia y evidencias empresariales.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[rgba(30,24,38,0.06)]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#171719] tabular-nums font-ui">82%</span>
                <span className="text-[11px] text-[#69666d]">Cobertura documental</span>
              </div>
              <div className="w-28 h-1.5 bg-[#efedef] rounded-full overflow-hidden mt-1">
                <div className="w-[82%] h-full bg-[#685cff] rounded-full" />
              </div>
            </div>

            {/* Fichas apiladas +12 */}
            <div
              onClick={() => navigate('/app/dossier')}
              className="flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-8 rounded-[4px] bg-white border border-[rgba(30,24,38,0.12)] shadow-2xs text-[8px] flex items-center justify-center font-mono">ISO</div>
                <div className="w-6 h-8 rounded-[4px] bg-white border border-[rgba(30,24,38,0.12)] shadow-2xs text-[8px] flex items-center justify-center font-mono">ENS</div>
                <div className="w-6 h-8 rounded-[4px] bg-white border border-[rgba(30,24,38,0.12)] shadow-2xs text-[8px] flex items-center justify-center font-mono">UNE</div>
              </div>
              <span className="text-[11px] font-semibold text-[#685cff] ml-1">+12</span>
            </div>
          </div>
        </div>

        {/* Card 3: Explora el catálogo con cinta 3D violeta */}
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
              Busca nuevas oportunidades públicas y filtra por sector, importe o territorio.
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
