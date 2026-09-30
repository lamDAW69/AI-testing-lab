import React from 'react';
import { Menu, Search, Bell, Command } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user } = useAuth();
  const { unreadAlertsCount, setIsCommandPaletteOpen } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';
  const isHome = location.pathname === '/app/inicio' || location.pathname === '/app';

  return (
    <header className="topbar px-2 select-none">
      {/* Columna Izquierda: Botón Menú Móvil en pantallas pequeñas */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#69666d] hover:text-[#171719] hover:bg-white/80 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Columna Central: Solo visible en Inicio según Sección 12 */}
      <div className="flex-1 flex justify-center px-4">
        {isHome && (
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsCommandPaletteOpen(true);
              }
            }}
            className="command-search w-full max-w-[500px] cursor-pointer flex items-center justify-between text-xs text-[#69666d] group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#929097] group-hover:text-[#685cff] transition-colors" />
              <span className="group-hover:text-[#171719] transition-colors">
                Buscar pliegos, clientes, documentos...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#69666d] bg-white/80 border border-[rgba(30,24,38,0.08)] rounded-md shadow-xs">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </kbd>
          </div>
        )}
      </div>

      {/* Columna Derecha: Alertas y Avatar (Sección 12) */}
      <div className="flex items-center justify-end gap-3.5">
        {/* Notificaciones / Alertas */}
        <button
          onClick={() => navigate('/app/alertas')}
          className="relative p-2 rounded-full text-[#69666d] hover:text-[#171719] hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Ver alertas"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e44848] ring-2 ring-[#f5f1ed]" />
          )}
        </button>

        {/* Avatar de Usuario */}
        <button
          onClick={() => navigate('/app/configuracion')}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#685cff] to-[#9c8fff] text-white flex items-center justify-center font-semibold text-xs shadow-sm hover:scale-105 transition-transform cursor-pointer"
          title={user?.fullName || 'Marta García'}
        >
          {userInitial}
        </button>
      </div>
    </header>
  );
};
