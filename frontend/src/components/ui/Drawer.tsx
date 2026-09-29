import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur muy sutil (Sección 49) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="backdrop"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel Lateral Drawer (Sección 48) */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="drawer flex flex-col justify-between"
          >
            {/* Header del Drawer */}
            <div className="flex items-start justify-between pb-4 border-b border-[rgba(30,24,38,0.08)]">
              <div>
                <h3
                  id="drawer-title"
                  className="font-editorial text-2xl font-normal text-[#171719] tracking-tight"
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#69666d] mt-1 leading-normal">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#929097] hover:text-[#171719] hover:bg-black/[0.04] transition-colors cursor-pointer"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con scroll independiente */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4 text-sm text-[#171719]">
              {children}
            </div>

            {/* Footer con acciones */}
            {footer && (
              <div className="pt-4 border-t border-[rgba(30,24,38,0.08)] flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
