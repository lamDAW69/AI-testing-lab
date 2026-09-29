import React from 'react';

/**
 * Fondo ambiental orgánico con la imagen 3D de alta definición de ondas de cristal líquido.
 * Posicionado en z-0 con pointer-events-none para garantizar que sea visible detrás de la
 * interfaz interactiva (z-10) y nunca quede oculto por el background del body.
 */
export const SilkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Imagen 3D fotorrealista de cristal líquido y ondas de seda (100% visible) */}
      <img
        src="/images/glass-background.jpg"
        alt=""
        className="w-full h-full object-cover object-left-top"
        loading="eager"
      />

      {/* 2. Sutil velo de iluminación superior derecho para enfatizar el halo violeta */}
      <div className="absolute top-0 right-0 w-[55vw] h-[45vh] bg-[radial-gradient(ellipse_at_80%_15%,rgba(175,155,235,0.18),transparent_65%)] pointer-events-none" />
    </div>
  );
};
