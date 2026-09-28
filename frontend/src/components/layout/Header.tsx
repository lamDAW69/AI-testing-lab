import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Building2,
  ChevronDown,
  Check,
  Command,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, activeTenant, switchTenant } = useAuth();
  const { unreadAlertsCount, setIsCommandPaletteOpen } = useData();
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 pt-3 px-4 sm:px-8 pb-1 select-none">
      <div className="h-14 bg-white/70 backdrop-blur-[24px] border border-white/80 rounded-[18px] shadow-[0_4px_24px_rgba(20,20,30,0.04)] px-4 flex items-center justify-between gap-4">
        {/* Mobile Toggle & Command Bar Trigger */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#68656A] hover:text-[#161616] hover:bg-black/[0.04] transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Command Bar Trigger: Al hacer clic abre el Command Palette */}
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-[12px] bg-[#F6F3EF]/80 border border-[rgba(20,20,20,0.06)] hover:border-[#695CFF]/30 hover:bg-white transition-all cursor-pointer text-xs text-[#68656A] w-full max-w-md group"
          >
            <Search className="w-3.5 h-3.5 text-[#8F8B92] group-hover:text-[#695CFF] transition-colors" />
            <span className="flex-1 text-[#68656A] group-hover:text-[#161616]">
              Buscar pliegos, clientes, documentos…
            </span>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] bg-white border border-[rgba(20,20,20,0.08)] text-[10px] font-mono text-[#68656A] shadow-xs">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Organization Switcher, Alerts, User Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Tenant Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsTenantMenuOpen(!isTenantMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#F6F3EF]/80 border border-[rgba(20,20,20,0.06)] hover:border-[#695CFF]/40 hover:bg-white transition-all text-xs text-[#161616] cursor-pointer group shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-[#695CFF] group-hover:scale-105 transition-transform" />
              <span className="font-medium max-w-[130px] sm:max-w-[180px] truncate">
                {activeTenant?.name || 'Seleccionar Empresa'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#8F8B92]" />
            </button>

            <AnimatePresence>
              {isTenantMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsTenantMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-[24px] border border-white/80 rounded-[18px] shadow-[0_16px_40px_rgba(20,20,30,0.12)] p-2.5 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8F8B92] border-b border-[rgba(20,20,20,0.06)] mb-1 flex items-center justify-between">
                      <span>Espacios Autorizados</span>
                      <span className="text-[#695CFF] font-semibold">Multi-Tenant</span>
                    </div>
                    <div className="space-y-1">
                      {user?.memberships.map((membership) => {
                        const isSelected = membership.id === activeTenant?.id;
                        return (
                          <button
                            key={membership.id}
                            onClick={() => {
                              switchTenant(membership.id);
                              setIsTenantMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-[12px] text-xs text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#EEEAFE] text-[#5749F5] font-semibold border border-[#D5CCFE]'
                                : 'text-[#161616] hover:bg-[#F6F3EF]'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="block truncate text-[#161616] font-medium">
                                {membership.name}
                              </span>
                              <span className="text-[10px] text-[#68656A] block font-mono">
                                CIF: {membership.taxId} · Rol: {membership.role}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#695CFF] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Bell Icon / Alertas sincronizadas */}
          <button
            onClick={() => navigate('/app/alertas')}
            className="relative p-2 rounded-[12px] bg-[#F6F3EF]/80 border border-[rgba(20,20,20,0.06)] hover:bg-white text-[#68656A] hover:text-[#161616] transition-all cursor-pointer shadow-2xs"
            title="Bandeja de Alertas"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F25A5A] text-[9px] font-mono font-bold text-white shadow-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div
            onClick={() => navigate('/app/configuracion')}
            className="w-8 h-8 rounded-full bg-[#EEEAFE] border border-[#D5CCFE] flex items-center justify-center text-xs font-semibold text-[#695CFF] cursor-pointer hover:shadow-xs transition-shadow"
            title="Configuración de Cuenta"
          >
            {user?.fullName?.charAt(0) || 'L'}
          </div>
        </div>
      </div>
    </header>
  );
};
