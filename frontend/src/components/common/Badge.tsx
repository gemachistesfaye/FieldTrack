import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'slate' | 'teal' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'slate',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-slate-100 text-slate-700 border-slate-200',
    emerald: 'bg-slate-100 text-slate-700 border-slate-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    purple: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    slate: 'bg-slate-400',
    teal: 'bg-slate-500',
    blue: 'bg-slate-500',
    emerald: 'bg-slate-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-slate-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
