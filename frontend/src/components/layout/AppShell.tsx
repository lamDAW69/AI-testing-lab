import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
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

  // Si entra en modo demo y no ha visto el tour en esta sesión, abrirlo automáticamente.
  // En entornos de testing automatizados (Playwright/navigator.webdriver) se previene el auto-open.
  useEffect(() => {
    if (isDemoMode) {
      const isAutomated = typeof window !== 'undefined' && Boolean(window.navigator && window.navigator.webdriver);
      const hasSeenTour = sessionStorage.getItem('pliego_demo_tour_seen');
      if (!hasSeenTour && !isAutomated) {
        setIsTourOpen(true);
      }
    }
  }, [isDemoMode]);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    sessionStorage.setItem('pliego_demo_tour_seen', 'true');
  };

  return (
    <div
      className="relative min-h-screen text-[#f7f8f8] antialiased overflow-x-hidden isolate flex flex-col"
      style={{ background: '#010102' }}
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

          <main id="main-content" className="flex-1 pt-2 pb-16 px-3 sm:px-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
