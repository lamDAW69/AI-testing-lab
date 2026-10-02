import React from 'react';

/**
 * Fondo ambiental orgánico con estética Linear + Supabase.
 * Canvas negro ultra-profundo (#010102) con velo de cristal líquido en baja opacidad
 * y gradientes radiales atmosféricos en lavanda (#5e6ad2) y esmeralda (#10b981).
 */
export const SilkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#010102]"
    >
      {/* 1. Imagen 3D sutil de ondas de cristal líquido con mezcla suave */}
      <img
        src="/images/glass-background.jpg"
        alt=""
        className="w-full h-full object-cover object-left-top opacity-[0.12] mix-blend-screen"
        loading="eager"
      />

      {/* 2. Atmósfera radial superior Linear (lavanda-índigo) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[85vw] h-[55vh] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.18),transparent_70%)] pointer-events-none" />

      {/* 3. Acento sutil esmeralda Supabase en lateral derecho */}
      <div className="absolute top-[25%] right-[-5%] w-[45vw] h-[45vh] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_65%)] pointer-events-none" />

      {/* 4. Viñeta inferior oscura para fundir suavemente con el scroll */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(1,1,2,0.6)_100%)] pointer-events-none" />
    </div>
  );
};

