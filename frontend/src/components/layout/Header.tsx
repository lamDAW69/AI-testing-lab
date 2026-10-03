import React from 'react';
import { Menu, Search, Bell, Command } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user } = useAuth();
  const { unreadAlertsCount, setIsCommandPaletteOpen } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';
  const isHome = location.pathname === '/app/inicio' || location.pathname === '/app';

  return (
    <header
      className="flex items-center justify-between h-14 px-4 border-b border-[var(--hairline)] shrink-0 select-none bg-[var(--surface-1)] transition-colors duration-200"
    >
      {/* Columna Izquierda: Menú móvil */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-[8px] text-[var(--ink-subtle)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors duration-150"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Columna Central: Command Palette trigger (solo en Inicio) */}
      <div className="flex-1 flex justify-center px-4">
        {isHome && (
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Buscar pliegos, clientes y documentos"
            className="command-search w-full max-w-[480px] cursor-pointer flex items-center justify-center sm:justify-between px-3 py-2 rounded-[8px] border border-[var(--hairline)] bg-[var(--surface-2)] hover:border-[var(--primary)]/30 hover:bg-[var(--surface-3)] transition-colors duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[var(--ink-tertiary)] group-hover:text-[var(--primary)] transition-colors duration-150" />
              <span className="hidden sm:inline text-xs text-[var(--ink-subtle)] group-hover:text-[var(--ink)] transition-colors duration-150">
                Buscar pliegos, clientes, documentos...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--ink-subtle)] bg-[var(--surface-3)] border border-[var(--hairline-strong)] rounded-[4px]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </kbd>
          </button>
        )}
      </div>

      {/* Columna Derecha: Selector de Tema + Alertas + Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Botón de alternancia de tema Claro/Oscuro */}
        <ThemeToggle />

        <button
          onClick={() => navigate('/app/alertas')}
          className="relative p-2 rounded-[8px] text-[var(--ink-subtle)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors duration-150 cursor-pointer"
          aria-label="Ver alertas"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
          )}
        </button>

        <button
          onClick={() => navigate('/app/configuracion')}
          className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-xs hover:opacity-85 transition-opacity cursor-pointer shadow-xs"
          title={user?.fullName || 'Usuario'}
        >
          {userInitial}
        </button>
      </div>
    </header>
  );
};
