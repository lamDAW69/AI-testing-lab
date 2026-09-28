import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-hairline bg-surface-50/50">
      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-ink-muted border border-hairline mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink-primary mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-ink-muted max-w-md leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {actionText && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
