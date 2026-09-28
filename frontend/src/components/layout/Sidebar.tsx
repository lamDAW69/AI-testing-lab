import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bell,
  FileCheck2,
  Settings,
  LogOut,
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
  const { logout, activeTenant, user } = useAuth();
  const { unreadAlertsCount } = useData();
  const location = useLocation();

  const mainNavItems = [
    {
      to: '/app/inicio',
      label: 'Inicio',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: '/app/catalogo',
      label: 'Catálogo',
      icon: <Search className="w-4 h-4" />,
    },
    {
      to: '/app/portfolio',
      label: 'Portfolio',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      to: '/app/alertas',
      label: 'Alertas',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    {
      to: '/app/dossier',
      label: 'Dossier',
      icon: <FileCheck2 className="w-4 h-4" />,
    },
  ];

  const secondaryNavItems = [
    {
      to: '/app/configuracion',
      label: 'Configuración',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white/75 backdrop-blur-[22px] border border-white/80 shadow-[0_12px_40px_rgba(20,20,30,0.07)] rounded-[22px] p-3.5 select-none justify-between">
      {/* Brand Header */}
      <div>
        <div className="px-3 py-3 flex items-center justify-between border-b border-[rgba(20,20,20,0.06)] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#695CFF] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(105,92,255,0.35)]">
              <span className="text-xs font-bold leading-none">✦</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-[#161616] block">
                Pliego AI
              </span>
              <span className="text-[10px] text-[#68656A] font-medium block">
                Auditoría Inteligente
              </span>
            </div>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive: linkActive }) =>
                  `group relative flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-160 cursor-pointer hover:translate-x-[2px] ${
                    linkActive
                      ? 'bg-[#EEEAFE] text-[#161616] shadow-[0_2px_8px_rgba(105,92,255,0.1)]'
                      : 'text-[#68656A] hover:text-[#161616] hover:bg-black/[0.03]'
                  }`
                }
              >
                {({ isActive: linkActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 z-10">
                      <motion.span
                        animate={{ scale: linkActive ? 1 : 0.96 }}
                        transition={{ duration: 0.18 }}
                        className={`transition-colors ${
                          linkActive ? 'text-[#695CFF]' : 'text-[#8F8B92] group-hover:text-[#161616]'
                        }`}
                      >
                        {item.icon}
                      </motion.span>
                      <span className={linkActive ? 'font-bold text-[#161616]' : 'font-medium'}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Separador */}
        <div className="my-3 border-t border-[rgba(20,20,20,0.06)]" />

        {/* Configuración */}
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-160 cursor-pointer hover:translate-x-[2px] ${
                  isActive
                    ? 'bg-[#EEEAFE] text-[#161616] shadow-[0_2px_8px_rgba(105,92,255,0.1)]'
                    : 'text-[#68656A] hover:text-[#161616] hover:bg-black/[0.03]'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-2.5 z-10">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-[#695CFF]' : 'text-[#8F8B92] group-hover:text-[#161616]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? 'font-bold text-[#161616]' : 'font-medium'}>
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Zona Inferior: Organización Activa, Rol, Avatar */}
      <div className="pt-3 border-t border-[rgba(20,20,20,0.06)] space-y-2">
        {activeTenant && (
          <div className="p-2.5 rounded-[14px] bg-[#F6F3EF]/90 border border-[rgba(20,20,20,0.06)]">
            <div className="flex items-center justify-between text-[11px] mb-0.5">
              <span className="font-bold text-[#161616] truncate max-w-[130px]">
                {activeTenant.name}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EEEAFE] text-[#5749F5] border border-[#D5CCFE] capitalize font-semibold">
                {activeTenant.role}
              </span>
            </div>
            <span className="text-[10px] text-[#68656A] font-mono block">
              CIF: {activeTenant.taxId}
            </span>
          </div>
        )}

        {/* User Card & Logout */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-[12px] hover:bg-black/[0.03] transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EEEAFE] border border-[#D5CCFE] flex items-center justify-center text-xs font-bold text-[#695CFF]">
              {user?.fullName?.charAt(0) || 'L'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-[#161616] truncate">
                {user?.fullName || 'Luis Méndez'}
              </span>
              <span className="block text-[10px] text-[#68656A] truncate">
                {user?.email || 'usuario@techconsulting.es'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 rounded-md text-[#8F8B92] hover:text-[#D93838] hover:bg-[#FEF0F0] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-20 py-4 pl-4 pr-1 w-[240px]">
        {content}
      </aside>

      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
              onClick={onCloseMobile}
            />

            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 h-full w-[260px] p-3"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
