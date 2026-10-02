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
      icon: <LayoutDashboard className="w-[17px] h-[17px] shrink-0" />,
    },
    {
      to: '/app/catalogo',
      label: 'Catálogo',
      icon: <Search className="w-[17px] h-[17px] shrink-0" />,
    },
    {
      to: '/app/portfolio',
      label: 'Portfolio',
      icon: <Briefcase className="w-[17px] h-[17px] shrink-0" />,
    },
    {
      to: '/app/alertas',
      label: 'Alertas',
      icon: <Bell className="w-[17px] h-[17px] shrink-0" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    {
      to: '/app/dossier',
      label: 'Dossier',
      icon: <FileCheck2 className="w-[17px] h-[17px] shrink-0" />,
    },
  ];

  const secondaryNavItems = [
    {
      to: '/app/configuracion',
      label: 'Configuración',
      icon: <Settings className="w-[17px] h-[17px] shrink-0" />,
    },
  ];

  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-sm font-medium transition-all duration-150 cursor-pointer ${
      isActive
        ? 'bg-[#141516] text-[#f7f8f8] border-l-2 border-[#5e6ad2] pl-[10px]'
        : 'text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#141516]/60 border-l-2 border-transparent pl-[10px]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Zona Superior: Brand + Navegación */}
      <div className="space-y-5">
        {/* Logo Pliego AI */}
        <div className="flex items-center gap-2 px-1 py-1 select-none">
          <div className="w-7 h-7 rounded-[8px] bg-[#5e6ad2] flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✦
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#f7f8f8]">
            Pliego AI
          </span>
        </div>

        {/* Navegación Principal */}
        <nav className="space-y-0.5">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#5e6ad2]' : 'text-[#62666d]'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#D93838]/15 text-[#ff6b6b] border border-[#D93838]/25">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador */}
        <div className="border-t border-[#23252a] mx-1" />

        {/* Navegación Secundaria */}
        <nav className="space-y-0.5">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#5e6ad2]' : 'text-[#62666d]'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Zona Inferior: Tenant + Usuario */}
      <div className="pt-4 border-t border-[#23252a] space-y-3">
        {/* Switcher de Tenant */}
        <div className="relative">
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="w-full text-left px-3 py-2.5 rounded-[8px] bg-[#141516] hover:bg-[#18191a] border border-[#23252a] hover:border-[#5e6ad2]/30 transition-all duration-150 cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-[#d0d6e0] font-medium">
              <span className="truncate pr-1">
                {activeTenant?.name || 'Ayuntamiento de Madrid'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#62666d] shrink-0" />
            </div>
            <div className="text-[11px] text-[#62666d] mt-0.5 capitalize">
              {activeTenant?.role === 'owner' ? 'Administrador' : activeTenant?.role || 'Administrador'}
            </div>
          </button>

          {/* Dropdown multi-tenant */}
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
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-[12px] border border-[#23252a] shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-50 space-y-0.5"
                  style={{ background: '#18191a' }}
                >
                  <p className="px-2 py-1 text-[10px] font-mono text-[#62666d] uppercase tracking-wider">
                    Organizaciones autorizadas
                  </p>
                  {user?.memberships.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchTenant(m.id);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs text-left cursor-pointer transition-colors ${
                        m.id === activeTenant?.id
                          ? 'bg-[#5e6ad2]/15 text-[#828fff] font-semibold'
                          : 'text-[#d0d6e0] hover:bg-[#23252a]'
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

        {/* Perfil de Usuario */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
            <div className="w-7 h-7 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {user?.fullName?.charAt(0) || 'M'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs text-[#d0d6e0] truncate leading-tight">
                {user?.fullName || 'Marta García'}
              </p>
              <p className="text-[10px] text-[#62666d] truncate">
                {user?.email || 'marta@empresa.es'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 rounded-[6px] text-[#62666d] hover:text-[#ff6b6b] hover:bg-[#D93838]/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[220px] shrink-0 h-screen sticky top-0 p-4 border-r border-[#23252a] overflow-y-auto"
        style={{ background: '#0f1011' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative z-10 w-[260px] h-full p-4 border-r border-[#23252a] overflow-y-auto"
              style={{ background: '#0f1011' }}
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
