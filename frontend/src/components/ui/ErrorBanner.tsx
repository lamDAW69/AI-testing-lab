import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Ha ocurrido un error',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 flex items-start gap-3.5 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
        <p className="text-xs text-rose-300/90 leading-relaxed">{message}</p>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="border-rose-500/30 hover:bg-rose-900/30 text-rose-200"
            >
              Reintentar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
