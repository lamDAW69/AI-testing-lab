import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[rgba(20,20,20,0.06)] rounded-[18px] shadow-[0_1px_3px_rgba(20,20,30,0.02)] ${
        hoverable
          ? 'hover:border-[rgba(20,20,20,0.12)] hover:shadow-[0_4px_16px_rgba(20,20,30,0.05)] transition-all cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, className = '' }) => {
  return (
    <div className={`p-5 pb-3.5 border-b border-[rgba(20,20,20,0.06)] flex items-start justify-between gap-4 ${className}`}>
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold text-[#161616] tracking-tight">{title}</h3>
        {description && <p className="text-xs text-[#68656A] leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 px-5 bg-[#F6F3EF]/40 border-t border-[rgba(20,20,20,0.06)] rounded-b-[18px] ${className}`}>{children}</div>;
};
