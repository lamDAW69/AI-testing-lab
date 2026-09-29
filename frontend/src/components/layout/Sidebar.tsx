import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bell,
  FileCheck2,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { logout, activeTenant, user, switchTenant } = useAuth();
  const { unreadAlertsCount } = useData();
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);

  const mainNavItems = [
    {
      to: '/app/inicio',
      label: 'Inicio',
      icon: <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />,
    },
    {
      to: '/app/catalogo',
      label: 'Catálogo',
      icon: <Search className="w-[18px] h-[18px] shrink-0" />,
    },
    {
      to: '/app/portfolio',
      label: 'Portfolio',
      icon: <Briefcase className="w-[18px] h-[18px] shrink-0" />,
    },
    {
      to: '/app/alertas',
      label: 'Alertas',
      icon: <Bell className="w-[18px] h-[18px] shrink-0" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : 3,
    },
    {
      to: '/app/dossier',
      label: 'Dossier',
      icon: <FileCheck2 className="w-[18px] h-[18px] shrink-0" />,
    },
  ];

  const secondaryNavItems = [
    {
      to: '/app/configuracion',
      label: 'Configuración',
      icon: <Settings className="w-[18px] h-[18px] shrink-0" />,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Zona Superior: Brand + Navegación */}
      <div className="space-y-6">
        {/* Logo ◈ Pliego AI (Sección 8) */}
        <div className="flex items-center gap-2.5 px-2 py-1 select-none">
          <span className="text-[#685cff] text-xl font-semibold">◈</span>
          <span className="font-editorial text-2xl font-medium tracking-tight text-[#171719]">
            Pliego AI
          </span>
        </div>

        {/* Navegación Principal */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `sidebar-item group ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-[#685cff]' : 'text-[#69666d] group-hover:text-[#171719]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium tracking-tight truncate">
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[11px] font-mono font-semibold bg-[#ffeded] text-[#e44848] border border-[#fcd2d2]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador sutil */}
        <div className="border-t border-[rgba(30,24,38,0.06)]" />

        {/* Navegación Secundaria (Configuración) */}
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `sidebar-item group ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-[#685cff]' : 'text-[#69666d] group-hover:text-[#171719]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium tracking-tight truncate">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 9. Identidad del Tenant & Usuario (Sección 9) */}
      <div className="pt-4 border-t border-[rgba(30,24,38,0.08)] space-y-3">
        {/* Switcher de Tenant Autorizado */}
        <div className="relative">
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="w-full text-left p-2.5 rounded-[12px] bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.06)] hover:border-[#685cff]/30 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-xs text-[#171719] font-medium">
              <span className="truncate pr-1">
                {activeTenant?.name || 'Ayuntamiento de Madrid'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#929097] shrink-0" />
            </div>
            <div className="text-[11px] text-[#69666d] mt-0.5 capitalize">
              {activeTenant?.role === 'owner' ? 'Administrador' : activeTenant?.role || 'Administrador'}
            </div>
          </button>

          {/* Menú desplegable multi-tenant seguro */}
          <AnimatePresence>
            {isTenantDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTenantDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-[14px] bg-white border border-[rgba(30,24,38,0.12)] shadow-floating z-50 space-y-1"
                >
                  <p className="px-2 py-1 text-[10px] font-mono text-[#929097] uppercase">
                    Organizaciones autorizadas
                  </p>
                  {user?.memberships.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchTenant(m.id);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[9px] text-xs text-left cursor-pointer transition-colors ${
                        m.id === activeTenant?.id
                          ? 'bg-[#eeeaff] text-[#685cff] font-semibold'
                          : 'text-[#171719] hover:bg-[#f5f1ed]'
                      }`}
                    >
                      <span className="truncate">{m.name}</span>
                      {m.id === activeTenant?.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Perfil de Usuario con Avatar y Logout (Sección 9) */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#685cff] to-[#9c8fff] text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
              {user?.fullName?.charAt(0) || 'M'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs text-[#171719] truncate leading-tight">
                {user?.fullName || 'Marta García'}
              </p>
              <p className="text-[10px] text-[#69666d] truncate">
                {user?.email || 'marta@empresa.es'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-[#929097] hover:text-[#e44848] hover:bg-[#ffeded] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar flotante */}
      <aside className="hidden md:flex sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation (< 768px) */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="backdrop"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative z-10 w-[270px] h-full p-4 bg-white/95 backdrop-blur-[24px] shadow-floating border-r border-[rgba(30,24,38,0.08)]"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
