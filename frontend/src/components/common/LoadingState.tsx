import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading live telemetry data...',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};
