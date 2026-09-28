import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, ShieldAlert, Clock, AlertTriangle, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimatedTabs, TabItem } from '../components/ui/AnimatedTabs';
import { formatDateTime } from '../lib/formatters';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { TenantAlert } from '../types/alerts';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useData();
  const [activeTab, setActiveTab] = useState<string>('all');
  const navigate = useNavigate();
  const { canPerformAction } = useAuth();

  const canManageAlerts = canPerformAction('manage_alerts');
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const alertTabs: TabItem[] = [
    { id: 'all', label: 'Todas las Alertas', badge: alerts.length },
    {
      id: 'unread',
      label: 'No Leídas',
      badge: unreadCount,
      badgeVariant: unreadCount > 0 ? 'rose' : 'default',
    },
    {
      id: 'CRITICAL',
      label: 'Críticas / Adendas',
      badge: alerts.filter((a) => a.severity === 'CRITICAL').length,
      badgeVariant: 'rose',
    },
  ];

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'unread') return !a.isRead;
    if (activeTab === 'CRITICAL') return a.severity === 'CRITICAL';
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Cabecera Unificada */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[rgba(20,20,20,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">
              Alertas
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] font-semibold">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <p className="text-xs text-[#68656A] mt-0.5">
            Notificaciones persistentes sobre cambios en PLACSP, plazos de licitación y vigencia de análisis
          </p>
        </div>

        {canManageAlerts && (
          <Button
            variant="outline"
            size="sm"
            icon={<CheckCheck className="w-3.5 h-3.5" />}
            onClick={markAllAlertsAsRead}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Tabs animadas con Glider */}
      <AnimatedTabs
        tabs={alertTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="segmented"
        size="md"
      />

      {/* Inbox de Alertas según Sección 15 */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#8F8B92] pt-1">
          Hoy
        </div>

        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-[#10B981]" />}
            title="Sin alertas pendientes"
            description="Todas las notificaciones operativas han sido revisadas."
          />
        ) : (
          filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              transition={{ duration: 0.2 }}
              className={`p-5 rounded-[18px] bg-white border transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'border-l-[4px] border-l-[#F25A5A] border-t border-r border-b border-[rgba(20,20,20,0.06)]'
                  : alert.severity === 'WARNING'
                  ? 'border-l-[4px] border-l-[#F59E0B] border-t border-r border-b border-[rgba(20,20,20,0.06)]'
                  : 'border border-[rgba(20,20,20,0.06)]'
              } ${alert.isRead ? 'opacity-65' : 'shadow-[0_2px_12px_rgba(20,20,30,0.03)]'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                        alert.severity === 'CRITICAL'
                          ? 'text-[#D93838]'
                          : alert.severity === 'WARNING'
                          ? 'text-[#975A16]'
                          : 'text-[#695CFF]'
                      }`}
                    >
                      {alert.severity} · {alert.type}
                    </span>
                    <span className="text-xs font-mono text-[#8F8B92]">
                      {alert.fileReference}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#161616]">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-[#68656A] leading-relaxed max-w-2xl">
                    {alert.message}
                  </p>

                  <div className="text-[11px] text-[#8F8B92] font-mono pt-1">
                    {formatDateTime(alert.createdAt)}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 pt-2 sm:pt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => {
                      markAlertAsRead(alert.id);
                      navigate(`/app/portfolio/${alert.tenderId}`);
                    }}
                  >
                    Abrir Oportunidad
                  </Button>

                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-xs text-[#8F8B92] hover:text-[#161616] transition-colors cursor-pointer"
                    >
                      Marcar leída
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
