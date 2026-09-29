import React from 'react';

/**
 * Fondo ambiental orgánico con ondas de seda translúcida y refracción lumínica.
 * Proporciona el contraste y gradientes tridimensionales necesarios para que
 * el glassmorphism de la barra lateral y los bloques luzca con el brillo (glossy)
 * y refracción vistos en el mockup de referencia.
 */
export const SilkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Base Cálida con Gradientes Elípticos */}
      <div className="absolute inset-0 bg-[#f5f1ed]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(175,155,235,0.22),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_90%,rgba(255,255,255,0.95),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(125deg,#eee8e3_0%,#fbf9f6_45%,#ede7ed_100%)] opacity-80" />

      {/* 2. Ondas de Seda Translúcidas 3D en SVG (Fluyen detrás de la Sidebar y los Bloques) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Degradado Onda Izquierda (detrás de la Sidebar) */}
          <linearGradient id="silk-left-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ede5dc" stopOpacity="0.65" />
            <stop offset="75%" stopColor="#ded5e8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="silk-left-2" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#f7f2ed" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#d8cfe5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#efe8df" stopOpacity="0.1" />
          </linearGradient>

          {/* Degradado Central y Derecho */}
          <linearGradient id="silk-center" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#e8dfd5" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#e2d8ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5efe9" stopOpacity="0.8" />
          </linearGradient>

          {/* Halo Violeta Superior Derecho */}
          <radialGradient id="halo-ai" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#685cff" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#9c8fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Filtro de desenfoque suave para bordes orgánicos de seda */}
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
        </defs>

        {/* Onda de seda principal: Cruza detrás de la barra lateral izquierda */}
        <path
          d="M-100,-50 C120,150 80,380 -50,560 C-180,740 60,880 280,950 C450,1000 600,850 480,700 C360,550 250,420 180,240 C110,60 20,-20 -100,-50 Z"
          fill="url(#silk-left-1)"
          filter="url(#soft-blur)"
        />

        {/* Segunda cinta de seda curvada bajo la sidebar */}
        <path
          d="M-50,300 C150,420 220,620 120,800 C20,980 -50,1050 -120,1100 L-150,350 Z"
          fill="url(#silk-left-2)"
          filter="url(#soft-blur)"
        />

        {/* Flujo horizontal suave que pasa bajo el área de bienvenida */}
        <path
          d="M100,280 C400,220 700,340 1050,260 C1350,190 1500,280 1700,220 L1700,450 C1400,520 1100,400 800,480 C500,560 250,490 100,280 Z"
          fill="url(#silk-center)"
          filter="url(#soft-blur)"
        />

        {/* Reflejo de seda en esquina inferior derecha */}
        <path
          d="M1100,750 C1300,680 1450,780 1650,720 L1700,1050 L1150,1050 C1200,950 1180,850 1100,750 Z"
          fill="url(#silk-left-1)"
          filter="url(#soft-blur)"
        />

        {/* Halo difuso posterior para el panel IA */}
        <ellipse cx="1200" cy="180" rx="300" ry="160" fill="url(#halo-ai)" filter="url(#soft-blur)" />
      </svg>
    </div>
  );
};
