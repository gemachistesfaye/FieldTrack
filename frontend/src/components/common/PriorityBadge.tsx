import React from 'react';
import { cn } from '../../utils/cn';
import { Priority } from '../../types/report';
import { Flame, AlertTriangle, Info, ArrowDown } from 'lucide-react';

export interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<
  Priority,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  CRITICAL: {
    label: 'Critical',
    bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-900/60',
    icon: Flame,
  },
  HIGH: {
    label: 'High',
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-600',
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: Info,
  },
  LOW: {
    label: 'Low',
    bg: 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    icon: ArrowDown,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-2xs whitespace-nowrap',
        config.bg,
        config.border,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0')} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
