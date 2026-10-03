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
      className={`app-card bg-[var(--surface-1)] border border-[var(--hairline)] rounded-[18px] text-[var(--ink)] ${
        hoverable
          ? 'app-card--interactive cursor-pointer'
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
    <div className={`p-5 pb-3.5 border-b border-[var(--hairline)] flex items-start justify-between gap-4 ${className}`}>
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">{title}</h3>
        {description && <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">{description}</p>}
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
  return <div className={`p-4 px-5 bg-[var(--surface-2)] border-t border-[var(--hairline)] rounded-b-[18px] ${className}`}>{children}</div>;
};
