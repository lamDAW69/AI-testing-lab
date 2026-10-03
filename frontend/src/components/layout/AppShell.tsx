import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { SilkBackground } from './SilkBackground';
import { DemoBanner } from './DemoBanner';
import { ProductTourModal } from './ProductTourModal';
import { useAuth } from '../../lib/auth-context';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { isDemoMode } = useAuth();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // Si entra en modo demo o es un usuario recién registrado, abrir el tour automáticamente.
  // En entornos de testing automatizados (Playwright/navigator.webdriver) se previene el auto-open.
  useEffect(() => {
    const isAutomated = typeof window !== 'undefined' && Boolean(window.navigator && window.navigator.webdriver);
    if (isAutomated) return;

    const isFirstTimeUser = typeof window !== 'undefined' && sessionStorage.getItem('pliego_first_time_user') === 'true';
    const hasSeenTour = typeof window !== 'undefined' && sessionStorage.getItem('pliego_demo_tour_seen');

    if (isFirstTimeUser || (isDemoMode && !hasSeenTour)) {
      setIsTourOpen(true);
      if (isFirstTimeUser) {
        sessionStorage.removeItem('pliego_first_time_user');
      }
    }
  }, [isDemoMode]);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    sessionStorage.setItem('pliego_demo_tour_seen', 'true');
  };

  return (
    <div
      className="app-workspace relative min-h-screen text-[var(--ink)] antialiased overflow-x-hidden isolate flex flex-col transition-colors duration-200"
      style={{ background: 'var(--canvas)' }}
    >
      {/* Fondo ambiental Linear: canvas #010102 + orbes CSS */}
      <SilkBackground />

      {/* Modal global de atajo ⌘K */}
      <CommandPalette />

      {/* Modal interactivo de Tour de Producto */}
      <ProductTourModal isOpen={isTourOpen} onClose={handleCloseTour} />

      {/* Banner superior en Modo Demostración */}
      <DemoBanner onOpenTour={() => setIsTourOpen(true)} />

      {/* Shell: sidebar izquierdo + contenido derecho */}
      <div className="relative z-10 flex flex-1 min-h-0">
        {/* Barra lateral */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Zona de trabajo (Workspace) */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

          <main id="main-content" className="app-main flex-1 pt-3 pb-16 px-3 sm:px-6 overflow-y-auto">
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="app-route-stage max-w-[1560px] mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};
