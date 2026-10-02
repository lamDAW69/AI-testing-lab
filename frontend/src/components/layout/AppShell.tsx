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
  // En entornos de testing automatizados (Playwright/navigator.webdriver) se previene el auto-open para no interceptar clics.
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
    <div className="app-background relative min-h-screen text-[#171719] font-ui antialiased overflow-x-hidden isolate flex flex-col">
      {/* Fondo ambiental orgánico con ondas de cristal translúcido (z-0) */}
      <SilkBackground />

      {/* Modal global de atajo ⌘K */}
      <CommandPalette />

      {/* Modal interactivo de Tour de Producto */}
      <ProductTourModal isOpen={isTourOpen} onClose={handleCloseTour} />

      {/* Banner superior en Modo Demostración */}
      <DemoBanner onOpenTour={() => setIsTourOpen(true)} />

      {/* Grid del Shell de la aplicación (Sección 7) */}
      <div className="app-shell relative z-10 flex-1">
        {/* Barra lateral flotante ultra-glossy */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Zona de trabajo (Workspace) */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

          <main id="main-content" className="flex-1 pt-2 pb-16 px-1 sm:px-4 page-enter">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
