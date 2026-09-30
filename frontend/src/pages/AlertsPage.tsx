import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  Clock,
  AlertTriangle,
  FileText,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useData();
  const navigate = useNavigate();
  const { canPerformAction } = useAuth();

  const [activeSegment, setActiveSegment] = useState<
    'all' | 'unread' | 'critical' | 'deadlines' | 'info'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');

  const canManageAlerts = canPerformAction('manage_alerts');

  // Métricas operativas
  const totalCount = alerts.length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(
    (a) => a.severity === 'WARNING' || a.type === 'DEADLINE_APPROACHING'
  ).length;
  const readCount = alerts.filter((a) => a.isRead).length;

  // Filtrado reactivo de alertas
  const filteredAlerts = alerts.filter((alert) => {
    // Filtro por segmento
    if (activeSegment === 'unread' && alert.isRead) return false;
    if (activeSegment === 'critical' && alert.severity !== 'CRITICAL') return false;
    if (
      activeSegment === 'deadlines' &&
      alert.severity !== 'WARNING' &&
      alert.type !== 'DEADLINE_APPROACHING'
    )
      return false;
    if (activeSegment === 'info' && alert.severity !== 'INFO') return false;

    // Filtro de búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        alert.title.toLowerCase().includes(term) ||
        alert.message.toLowerCase().includes(term) ||
        alert.fileReference.toLowerCase().includes(term) ||
        alert.tenderTitle.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const formatAlertTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Hace unos minutos';
      if (diffHours === 1) return 'Hace 1 hora';
      if (diffHours < 24) return `Hace ${diffHours} horas`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. HEADER EDITORIAL ALINEADO CON PORTFOLIO, CATÁLOGO Y DOSSIER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb contextual */}
          <nav className="text-xs text-[#929097] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[#171719] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[#171719] font-medium">Alertas</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171719] tracking-tight">
              Alertas
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#ffeded] text-[#e44848] border border-[#fcd2d2]">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#69666d] mt-1 max-w-xl">
            Notificaciones persistentes sobre cambios en PLACSP, plazos de licitación y vigencia de análisis.
          </p>
        </div>

        {/* Acción de Lote (Marcar todas como leídas) */}
        {canManageAlerts && unreadCount > 0 && (
          <button
            onClick={markAllAlertsAsRead}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[11px] bg-white/70 hover:bg-white text-[#171719] border border-[rgba(30,24,38,0.08)] hover:border-[#685cff]/30 text-xs font-semibold transition-all shadow-xs cursor-pointer self-start md:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#685cff]" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>

      {/* 2. FILA DE KPIS OPERATIVOS (4 TARJETAS .glass-soft CON BADGES CUADRADOS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Alertas */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-white/80 border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#171719] shrink-0 shadow-2xs">
            <Bell className="w-5 h-5 text-[#423d4c]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {totalCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Total alertas
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              Monitorizadas en PLACSP
            </div>
          </div>
        </div>

        {/* Críticas / Adendas */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#ffeded] border border-[#fcd2d2] flex items-center justify-center text-[#e44848] shrink-0 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e44848] tabular-nums tracking-tight leading-none">
              {criticalCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Críticas / Adendas
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              Invalidan análisis previo
            </div>
          </div>
        </div>

        {/* Plazos Próximos */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#fff3db] border border-[#ffe2a8] flex items-center justify-center text-[#ca8517] shrink-0 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {warningCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Plazos próximos
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              &lt; 5 días hábiles
            </div>
          </div>
        </div>

        {/* Resueltas / Leídas */}
        <div className="glass-soft p-4 rounded-[18px] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#e8f7ef] border border-[#c2ebd5] flex items-center justify-center text-[#218a58] shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#171719] tabular-nums tracking-tight leading-none">
              {readCount}
            </div>
            <div className="text-xs font-semibold text-[#171719] mt-1 leading-tight">
              Revisadas
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5">
              Atendidas por el equipo
            </div>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE CONTROL: SEGMENTOS RÁPIDOS + BÚSQUEDA GLASS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmentos estilo píldora */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveSegment('all')}
            className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSegment === 'all'
                ? 'text-[#685cff] bg-[#eeeaff] border border-[#685cff]/20 font-semibold shadow-2xs'
                : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
            }`}
          >
            Todas {totalCount}
          </button>

          <button
            onClick={() => setActiveSegment('unread')}
            className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSegment === 'unread'
                ? 'text-[#685cff] bg-[#eeeaff] border border-[#685cff]/20 font-semibold shadow-2xs'
                : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
            }`}
          >
            <span>No leídas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                unreadCount > 0
                  ? 'bg-[#ffeded] text-[#e44848]'
                  : 'bg-white/80 text-[#69666d]'
              }`}
            >
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSegment('critical')}
            className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSegment === 'critical'
                ? 'text-[#e44848] bg-[#ffeded] border border-[#e44848]/25 font-semibold shadow-2xs'
                : 'text-[#69666d] hover:text-[#e44848] bg-white/60 hover:bg-white border border-transparent'
            }`}
          >
            Críticas / Adendas {criticalCount}
          </button>

          <button
            onClick={() => setActiveSegment('deadlines')}
            className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSegment === 'deadlines'
                ? 'text-[#ca8517] bg-[#fff3db] border border-[#ca8517]/25 font-semibold shadow-2xs'
                : 'text-[#69666d] hover:text-[#ca8517] bg-white/60 hover:bg-white border border-transparent'
            }`}
          >
            Plazos {warningCount}
          </button>

          <button
            onClick={() => setActiveSegment('info')}
            className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSegment === 'info'
                ? 'text-[#685cff] bg-[#eeeaff] border border-[#685cff]/20 font-semibold shadow-2xs'
                : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
            }`}
          >
            Informativas {alerts.filter((a) => a.severity === 'INFO').length}
          </button>
        </div>

        {/* Búsqueda dentro de la vista */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929097]" />
          <input
            type="text"
            placeholder="Buscar por expediente o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-white/70 focus:bg-white border border-[rgba(30,24,38,0.06)] focus:border-[#685cff] rounded-[11px] text-xs text-[#171719] placeholder-[#929097] transition-all focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* 4. BANDEJA DE ALERTAS (.surface CON BISEL ESPECULAR Y BORDES SEMÁNTICOS) */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#929097] px-1">
          Notificaciones registradas ({filteredAlerts.length})
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="surface p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#e8f7ef] text-[#218a58] flex items-center justify-center mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#171719]">
              Bandeja de alertas al día
            </h3>
            <p className="text-xs text-[#69666d] max-w-md leading-relaxed">
              No hay notificaciones pendientes en este filtro. Pliego AI continuará monitorizando automáticamente las publicaciones de PLACSP.
            </p>
            {(activeSegment !== 'all' || searchTerm !== '') && (
              <button
                onClick={() => {
                  setActiveSegment('all');
                  setSearchTerm('');
                }}
                className="mt-2 text-xs font-semibold text-[#685cff] hover:underline cursor-pointer"
              >
                Ver todas las alertas
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className={`surface p-5 rounded-[20px] transition-all relative overflow-hidden group ${
                    isCritical
                      ? 'border-l-[4px] border-l-[#e44848]'
                      : isWarning
                      ? 'border-l-[4px] border-l-[#ca8517]'
                      : 'border-l-[4px] border-l-[#685cff]'
                  } ${
                    alert.isRead
                      ? 'opacity-80 hover:opacity-100'
                      : 'shadow-[0_4px_20px_rgba(21,17,30,0.04)]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Contenido principal de la alerta */}
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Metadatos superiores */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Indicador de no leído */}
                        {!alert.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#685cff] ring-4 ring-[#eeeaff] shrink-0" />
                        )}

                        {/* Badge de severidad / origen */}
                        <span
                          className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                            isCritical
                              ? 'bg-[#ffeded] text-[#e44848] border-[#fcd2d2]'
                              : isWarning
                              ? 'bg-[#fff3db] text-[#ca8517] border-[#ffe2a8]'
                              : 'bg-[#eeeaff] text-[#685cff] border-[#d5ccfe]'
                          }`}
                        >
                          {isCritical
                            ? 'ADENDA / CRÍTICA'
                            : isWarning
                            ? 'PLAZO PERENTORIO'
                            : 'ACTUALIZACIÓN'}
                        </span>

                        {/* Expediente monoespaciado */}
                        <span className="text-[11px] font-mono text-[#69666d] bg-white/70 px-2 py-0.5 rounded-[6px] border border-[rgba(30,24,38,0.06)]">
                          {alert.fileReference}
                        </span>

                        {/* Tiempo relativo */}
                        <span className="text-[11px] text-[#929097] font-mono ml-auto lg:ml-0">
                          {formatAlertTime(alert.createdAt)}
                        </span>
                      </div>

                      {/* Título de la alerta */}
                      <h3 className="text-sm font-semibold text-[#171719] leading-snug">
                        {alert.title}
                      </h3>

                      {/* Mensaje explicativo */}
                      <p className="text-xs text-[#69666d] leading-relaxed max-w-3xl">
                        {alert.message}
                      </p>

                      {/* Banner de invalidación si requiere reanálisis */}
                      {alert.requiresReanalysis && (
                        <div className="p-2.5 rounded-[12px] bg-[#ffeded]/80 border border-[#fcd2d2] flex items-center gap-2 text-xs text-[#e44848]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium text-[11px]">
                            Invalida el análisis vigente: Requiere reanálisis documental con los pliegos vigentes de la licitación.
                          </span>
                        </div>
                      )}

                      {/* Referencia a la licitación vinculada */}
                      <div className="pt-1 flex items-center gap-1.5 text-xs text-[#929097]">
                        <span>Licitación:</span>
                        <Link
                          to={`/app/portfolio/${alert.tenderId}`}
                          className="text-[#171719] hover:text-[#685cff] font-medium truncate hover:underline"
                        >
                          {alert.tenderTitle}
                        </Link>
                      </div>
                    </div>

                    {/* Acciones de la alerta (Abrir / Marcar leída) */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 pt-2 lg:pt-0 border-t sm:border-t-0 border-[rgba(30,24,38,0.06)]">
                      <button
                        onClick={() => {
                          markAlertAsRead(alert.id);
                          navigate(`/app/portfolio/${alert.tenderId}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171719] hover:bg-[#2c2b30] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                      >
                        <span>Abrir Oportunidad</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {!alert.isRead ? (
                        <button
                          onClick={() => markAlertAsRead(alert.id)}
                          className="text-xs text-[#69666d] hover:text-[#171719] transition-colors cursor-pointer flex items-center gap-1 py-1 px-1.5"
                        >
                          <Check className="w-3 h-3 text-[#685cff]" />
                          <span>Marcar leída</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#929097] flex items-center gap-1 py-1 px-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#218a58]" />
                          <span>Leída</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
