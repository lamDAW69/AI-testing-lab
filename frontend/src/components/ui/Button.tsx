import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'app-button relative inline-flex items-center justify-center font-medium rounded-[8px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010102] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[32px] gap-1.5',
    md: 'text-xs px-4 py-2 min-h-[38px] gap-2',
    lg: 'text-sm px-5 py-2.5 min-h-[44px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#5e6ad2] text-white hover:bg-[#828fff] border border-[#828fff]/20 font-semibold',
    secondary:
      'bg-[#141516] text-[#f7f8f8] hover:bg-[#18191a] border border-[#34343a]',
    danger:
      'bg-[#D93838]/15 text-[#ff8585] hover:bg-[#D93838]/22 border border-[#D93838]/30 font-medium',
    ghost:
      'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.06]',
    outline:
      'bg-transparent text-[#f7f8f8] border border-[#34343a] hover:bg-white/[0.06]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
          <span>Cargando…</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
