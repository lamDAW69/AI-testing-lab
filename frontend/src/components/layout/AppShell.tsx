import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-background relative min-h-screen text-[#171719] font-ui antialiased">
      {/* Modal global de atajo ⌘K */}
      <CommandPalette />

      {/* Grid del Shell de la aplicación (Sección 7) */}
      <div className="app-shell">
        {/* Barra lateral flotante */}
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
