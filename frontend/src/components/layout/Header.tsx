import React from 'react';
import { Menu, Search, Bell, Command } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user } = useAuth();
  const { unreadAlertsCount, setIsCommandPaletteOpen } = useData();
  const navigate = useNavigate();

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

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

      {/* Columna Central: Barra de búsqueda flotante con atajo ⌘K (Sección 10) */}
      <div className="flex justify-center">
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsCommandPaletteOpen(true);
            }
          }}
          className="command-search w-full max-w-[540px] cursor-pointer flex items-center justify-between text-xs text-[#69666d] group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#929097] group-hover:text-[#685cff] transition-colors" />
            <span className="group-hover:text-[#171719] transition-colors">
              Buscar pliegos, documentos...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-medium text-[#69666d] bg-white/80 border border-[rgba(30,24,38,0.08)] rounded-md shadow-xs">
            <Command className="w-3 h-3" />
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* Columna Derecha: Alertas y Avatar (Sección 10) */}
      <div className="flex items-center justify-end gap-3.5">
        {/* Notificaciones / Alertas */}
        <button
          onClick={() => navigate('/app/alertas')}
          className="relative p-2.5 rounded-full text-[#69666d] hover:text-[#171719] hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Ver alertas"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e44848] ring-2 ring-[#f5f1ed]" />
          )}
        </button>

        {/* Avatar de Usuario */}
        <button
          onClick={() => navigate('/app/configuracion')}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#685cff] to-[#9c8fff] text-white flex items-center justify-center font-semibold text-xs shadow-sm hover:scale-105 transition-transform cursor-pointer"
          title={user?.fullName || 'Marta García'}
        >
          {userInitial}
        </button>
      </div>
    </header>
  );
};
