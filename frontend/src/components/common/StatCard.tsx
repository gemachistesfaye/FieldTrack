import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export type StatColor = 'teal' | 'blue' | 'amber' | 'emerald' | 'rose' | 'slate';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: StatColor;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
  badge?: string;
}

const colorStyles: Record<
  StatColor,
  { iconBg: string; iconColor: string; borderFocus: string; lightBadge: string }
> = {
  teal: {
    iconBg: 'bg-teal-500/10 text-teal-600 border border-teal-500/20',
    iconColor: 'text-teal-600',
    borderFocus: 'hover:border-teal-300',
    lightBadge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  blue: {
    iconBg: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    iconColor: 'text-blue-600',
    borderFocus: 'hover:border-blue-300',
    lightBadge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    iconColor: 'text-amber-600',
    borderFocus: 'hover:border-amber-300',
    lightBadge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    iconColor: 'text-emerald-600',
    borderFocus: 'hover:border-emerald-300',
    lightBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rose: {
    iconBg: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    iconColor: 'text-rose-600',
    borderFocus: 'hover:border-rose-300',
    lightBadge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  slate: {
    iconBg: 'bg-slate-500/10 text-slate-700 border border-slate-500/20',
    iconColor: 'text-slate-700',
    borderFocus: 'hover:border-slate-300',
    lightBadge: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'teal',
  subtitle,
  trend,
  onClick,
  className,
  badge,
}) => {
  const styles = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        styles.borderFocus,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 truncate">
            {value}
          </p>
        </div>

        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
            styles.iconBg
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  trend.isPositive !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                )}
              >
                {trend.isPositive !== false ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400">{trend.label}</span>}
            </div>
          ) : subtitle ? (
            <span className="text-slate-500 truncate">{subtitle}</span>
          ) : (
            <div />
          )}

          {subtitle && trend && (
            <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>
          )}

          {badge && (
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0',
                styles.lightBadge
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
