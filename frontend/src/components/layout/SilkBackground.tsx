import React from 'react';

/**
 * Fondo ambiental orgánico con la imagen 3D de alta definición de ondas de cristal líquido.
 * Proporciona el fondo exacto con cintas de cristal esculpido, cáusticas, reflejos y halo violeta
 * que se aprecian a través de la barra lateral y los bloques con efecto glassmorphism.
 */
export const SilkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Fondo base de seguridad en tono cálido (#f6f3ef) */}
      <div className="absolute inset-0 bg-[#f6f3ef]" />

      {/* 2. Imagen 3D fotorrealista de cristal líquido y ondas de seda */}
      <img
        src="/images/glass-background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-left-top opacity-90 transition-opacity duration-700"
        loading="eager"
        fetchPriority="high"
      />

      {/* 3. Halo difuso violeta superior derecho que armoniza con la tarjeta IA */}
      <div className="absolute top-0 right-0 w-[55vw] h-[45vh] bg-[radial-gradient(ellipse_at_80%_15%,rgba(175,155,235,0.25),transparent_65%)] pointer-events-none" />

      {/* 4. Sutil viñeta ambiental cálida para balance de contraste */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(238,233,229,0.25)_100%)] pointer-events-none" />
    </div>
  );
};
