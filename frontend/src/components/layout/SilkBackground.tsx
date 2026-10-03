import React from 'react';

/**
 * Fondo ambiental Linear puro — canvas #010102 con dos orbes radiales atmosféricos.
 * Sin imágenes, sin texturas, sin glass. Solo gradientes CSS puros compatibles con
 * el sistema de diseño Linear + Supabase.
 */
export const SilkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[var(--canvas)] transition-colors duration-300"
    >
      {/* Orbe radial superior — lavanda (#5e6ad2) */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.15),transparent_70%)] pointer-events-none" />

      {/* Orbe radial inferior-derecho — esmeralda (#10b981) */}
      <div className="absolute bottom-[-5%] right-[-5%] w-[50vw] h-[50vh] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_65%)] pointer-events-none" />
    </div>
  );
};
