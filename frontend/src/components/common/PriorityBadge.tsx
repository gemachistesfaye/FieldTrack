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
    bg: 'bg-rose-50 text-rose-700',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: Flame,
  },
  HIGH: {
    label: 'High',
    bg: 'bg-orange-50 text-orange-700',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-50 text-blue-700',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Info,
  },
  LOW: {
    label: 'Low',
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    border: 'border-slate-300',
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
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
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
