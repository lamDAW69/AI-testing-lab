import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { ChevronRight } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'app');

  const breadcrumbLabels: Record<string, string> = {
    inicio: 'Inicio',
    catalogo: 'Catálogo Oficial',
    oportunidades: 'Expediente',
    portfolio: 'Portfolio de Oportunidades',
    alertas: 'Bandeja de Alertas',
    dossier: 'Dossier de Empresa',
    configuracion: 'Configuración',
  };

  return (
    <div className="relative flex min-h-screen bg-[#F6F3EF] overflow-hidden">
      {/* Modal global flotante de comandos ⌘K */}
      <CommandPalette />

      {/* 
        GRADIENTES AMBIENTALES SUBYACENTES:
        Hacen que el glassmorphism (backdrop-filter: blur(24px) y rgba(255,255,255,0.65))
        refrácte luz suave y se sienta tridimensional y vivo.
      */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Orbe violeta suave en esquina superior izquierda */}
        <div className="absolute -top-[12%] left-[10%] w-[550px] h-[550px] rounded-full bg-[#EEEAFE]/70 blur-[130px] opacity-80" />
        {/* Orbe cálido dorado en lateral derecho */}
        <div className="absolute top-[25%] -right-[5%] w-[500px] h-[500px] rounded-full bg-[#FCECD8]/60 blur-[140px] opacity-75" />
        {/* Orbe ámbar/lavanda inferior */}
        <div className="absolute -bottom-[10%] left-[30%] w-[650px] h-[650px] rounded-full bg-[#EAE3DC]/70 blur-[150px] opacity-80" />
      </div>

      {/* Barra lateral flotante glass */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenido principal flexible */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main id="main-content" className="flex-1 px-4 sm:px-8 py-6 max-w-[1560px] w-full mx-auto">
          {/* Breadcrumb discreto */}
          <nav aria-label="Migas de pan" className="mb-5 flex items-center gap-1.5 text-xs text-[#8F8B92]">
            <Link to="/app/inicio" className="hover:text-[#161616] transition-colors font-medium">
              Pliego AI
            </Link>
            {pathnames.map((name, index) => {
              const routeTo = `/app/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const label = breadcrumbLabels[name] || name;

              return (
                <React.Fragment key={routeTo}>
                  <ChevronRight className="w-3 h-3 text-[#B6B2B0]" />
                  {isLast ? (
                    <span className="text-[#161616] font-semibold" aria-current="page">
                      {label}
                    </span>
                  ) : (
                    <Link to={routeTo} className="hover:text-[#161616] transition-colors">
                      {label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Renderizado de vistas */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
