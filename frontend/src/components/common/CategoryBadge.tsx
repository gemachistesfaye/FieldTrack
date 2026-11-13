import React from 'react';
import { cn } from '../../utils/cn';
import { ReportCategory } from '../../types/report';
import {
  Droplets,
  Wrench,
  Zap,
  Building2,
  ShieldAlert,
  Radio,
  HelpCircle,
} from 'lucide-react';

export interface CategoryBadgeProps {
  category: ReportCategory;
  size?: 'sm' | 'md';
  className?: string;
}

const categoryConfig: Record<
  ReportCategory,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  WATER: {
    label: 'Water Point',
    icon: Droplets,
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
  },
  EQUIPMENT: {
    label: 'Equipment',
    icon: Wrench,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  ELECTRICAL: {
    label: 'Electrical',
    icon: Zap,
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  INFRASTRUCTURE: {
    label: 'Infrastructure',
    icon: Building2,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
  SAFETY: {
    label: 'Safety Hazard',
    icon: ShieldAlert,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  SERVICE_INTERRUPTION: {
    label: 'Service Outage',
    icon: Radio,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  OTHER: {
    label: 'General Issue',
    icon: HelpCircle,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
  className,
}) => {
  const config = categoryConfig[category] || categoryConfig.OTHER;
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border shadow-2xs whitespace-nowrap',
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
    >
      <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0')} />
      <span>{config.label}</span>
    </span>
  );
};
