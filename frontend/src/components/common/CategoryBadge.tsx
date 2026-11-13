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
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  EQUIPMENT: {
    label: 'Equipment',
    icon: Wrench,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  ELECTRICAL: {
    label: 'Electrical',
    icon: Zap,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  INFRASTRUCTURE: {
    label: 'Infrastructure',
    icon: Building2,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  SAFETY: {
    label: 'Safety Hazard',
    icon: ShieldAlert,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  SERVICE_INTERRUPTION: {
    label: 'Service Outage',
    icon: Radio,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  OTHER: {
    label: 'General Issue',
    icon: HelpCircle,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
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
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
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
