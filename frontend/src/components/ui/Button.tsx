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
    'relative inline-flex items-center justify-center font-medium rounded-[8px] transition-all duration-120 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#695CFF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.01] active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[32px] gap-1.5',
    md: 'text-xs px-4 py-2 min-h-[38px] gap-2',
    lg: 'text-sm px-5 py-2.5 min-h-[44px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#695CFF] text-white hover:bg-[#5749F5] shadow-[0_2px_8px_rgba(105,92,255,0.22)] border border-[#695CFF]/30 font-semibold',
    secondary:
      'bg-white text-[#161616] hover:bg-stone-50 border border-[rgba(20,20,20,0.1)] shadow-[0_1px_3px_rgba(20,20,30,0.04)]',
    danger:
      'bg-[#FEF0F0] text-[#F25A5A] hover:bg-[#FDE2E2] border border-[#FCD2D2] font-medium',
    ghost:
      'text-[#68656A] hover:text-[#161616] hover:bg-black/[0.04]',
    outline:
      'bg-transparent text-[#161616] border border-[rgba(20,20,20,0.14)] hover:bg-white/70',
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
