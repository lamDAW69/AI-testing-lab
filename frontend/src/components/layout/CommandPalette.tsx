import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Briefcase,
  Bell,
  FileCheck2,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  Command,
  X,
} from 'lucide-react';
import { useData } from '../../lib/data-context';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, tenders, alerts } = useData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Acciones y opciones de navegación rápida
  const navigationItems = [
    {
      id: 'nav-inicio',
      title: 'Ir a Inicio Operativo',
      category: 'Navegación',
      icon: <LayoutDashboard className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/inicio'),
    },
    {
      id: 'nav-catalogo',
      title: 'Ir al Catálogo de Licitaciones',
      category: 'Navegación',
      icon: <Search className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/catalogo'),
    },
    {
      id: 'nav-portfolio',
      title: 'Ir al Portfolio de Oportunidades',
      category: 'Navegación',
      icon: <Briefcase className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/portfolio'),
    },
    {
      id: 'nav-alertas',
      title: 'Ir a la Bandeja de Alertas',
      category: 'Navegación',
      icon: <Bell className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/alertas'),
    },
    {
      id: 'nav-dossier',
      title: 'Ir al Dossier y Evidencias',
      category: 'Navegación',
      icon: <FileCheck2 className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/dossier'),
    },
    {
      id: 'nav-config',
      title: 'Configuración de Cuenta',
      category: 'Navegación',
      icon: <Settings className="w-4 h-4 text-[#695CFF]" />,
      action: () => navigate('/app/configuracion'),
    },
  ];

  // Resultados de expedientes
  const tenderItems = tenders.map((t) => ({
    id: `tender-${t.id}`,
    title: `${t.fileReference} · ${t.title}`,
    category: 'Expedientes PLACSP',
    icon: <FileText className="w-4 h-4 text-[#8F8B92]" />,
    action: () => navigate(`/app/oportunidades/${t.id}`),
  }));

  const allItems = [...navigationItems, ...tenderItems];

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mantener visible el elemento seleccionado durante la navegación por flechas
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  const handleSelect = (item: typeof allItems[0]) => {
    setIsCommandPaletteOpen(false);
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
      >
        {/* Backdrop con oscurecimiento según Sección 7 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          onClick={() => setIsCommandPaletteOpen(false)}
        />

        {/* Modal Command Palette (scale 0.98 → 1, opacity 0 → 1, 220ms) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -6 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-2xl bg-white/95 backdrop-blur-[24px] border border-white/80 rounded-[22px] shadow-[0_20px_60px_rgba(20,20,30,0.18)] overflow-hidden z-10"
        >
          {/* Input de Búsqueda */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[rgba(20,20,20,0.06)]">
            <Search className="w-4 h-4 text-[#695CFF] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-autocomplete="list"
              aria-controls="command-results"
              placeholder="Escribe para buscar pliegos, clientes, expedientes o módulos…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-[#161616] placeholder-[#8F8B92] focus:outline-none"
            />
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#8F8B92] bg-[#F6F3EF] px-2 py-0.5 rounded-[6px]">
              <span>ESC</span>
            </div>
          </div>

          {/* Lista de Resultados */}
          <div
            id="command-results"
            ref={listRef}
            role="listbox"
            className="max-h-[360px] overflow-y-auto p-2 space-y-1"
          >
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8F8B92]">
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-[12px] text-xs transition-colors cursor-pointer ${
                    selectedIndex === idx
                      ? 'bg-[#EEEAFE] text-[#161616]'
                      : 'text-[#68656A] hover:bg-[#F6F3EF]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate font-medium text-[#161616]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8F8B92] shrink-0 ml-2">
                    {item.category}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer de atajos */}
          <div className="px-5 py-2.5 bg-[#F6F3EF]/60 border-t border-[rgba(20,20,20,0.06)] flex items-center justify-between text-[11px] text-[#8F8B92]">
            <span>Usa <strong>↑</strong> <strong>↓</strong> para navegar</span>
            <span>Pulsa <strong>ENTER</strong> para seleccionar</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
