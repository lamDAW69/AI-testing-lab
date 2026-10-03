import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'compact' | 'pill';
}

/**
 * High-End Theme Toggle — Directiva /high-end-visual-design
 * Micro-interacción háptica con arquitectura "Island", morphing cinemático
 * y física de resorte.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={!isDark}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--hairline)] bg-[var(--surface-2)] hover:border-[var(--hairline-strong)] hover:bg-[var(--surface-3)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer select-none ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="dark-icon"
                initial={{ rotate: -45, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 45, scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                className="text-[#828fff]"
              >
                <Moon className="w-4 h-4" strokeWidth={1.8} />
              </motion.div>
            ) : (
              <motion.div
                key="light-icon"
                initial={{ rotate: 45, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -45, scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                className="text-[#f59e0b]"
              >
                <Sun className="w-4 h-4" strokeWidth={1.8} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-xs font-medium text-[var(--ink-subtle)] group-hover:text-[var(--ink)] transition-colors">
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      </button>
    );
  }

  // Variant 'icon' por defecto para Header y Navbars
  return (
    <motion.button
      onClick={toggleTheme}
      type="button"
      whileTap={{ scale: 0.90 }}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className={`relative p-2 rounded-[8px] sm:rounded-full border border-[var(--hairline)] bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)] hover:border-[var(--hairline-strong)] text-[var(--ink-subtle)] hover:text-[var(--ink)] transition-all duration-200 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${className}`}
    >
      <div className="relative w-[18px] h-[18px] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="text-[#8a8f98] group-hover:text-[#d0d6e0]"
            >
              <Moon className="w-4 h-4" strokeWidth={1.75} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="text-[#ca8517] hover:text-[#b45309]"
            >
              <Sun className="w-4 h-4" strokeWidth={1.75} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};
