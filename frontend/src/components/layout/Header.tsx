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
    <header
      className="flex items-center justify-between h-14 px-4 border-b border-[#23252a] shrink-0 select-none"
      style={{ background: '#0f1011' }}
    >
      {/* Columna Izquierda: Menú móvil */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-[8px] text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#141516] transition-colors duration-150"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Columna Central: Command Palette trigger (solo en Inicio) */}
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
            className="w-full max-w-[480px] cursor-pointer flex items-center justify-between px-3 py-2 rounded-[8px] border border-[#23252a] bg-[#141516] hover:border-[#5e6ad2]/30 hover:bg-[#18191a] transition-all duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#62666d] group-hover:text-[#5e6ad2] transition-colors duration-150" />
              <span className="text-xs text-[#62666d] group-hover:text-[#8a8f98] transition-colors duration-150">
                Buscar pliegos, clientes, documentos...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#62666d] bg-[#23252a] border border-[#34343a] rounded-[4px]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </kbd>
          </div>
        )}
      </div>

      {/* Columna Derecha: Alertas + Avatar */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate('/app/alertas')}
          className="relative p-2 rounded-[8px] text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#141516] transition-colors duration-150 cursor-pointer"
          aria-label="Ver alertas"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D93838]" />
          )}
        </button>

        <button
          onClick={() => navigate('/app/configuracion')}
          className="w-7 h-7 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center font-semibold text-xs hover:opacity-80 transition-opacity cursor-pointer"
          title={user?.fullName || 'Marta García'}
        >
          {userInitial}
        </button>
      </div>
    </header>
  );
};
