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
  amber: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
  },
  slate: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  blue: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  emerald: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  rose: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  teal: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    borderFocus: 'hover:border-slate-300 dark:hover:border-slate-700',
    lightBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'slate',
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
        'bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-4.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all duration-150',
        onClick && 'cursor-pointer hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 active:translate-y-0',
        styles.borderFocus,
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5',
            styles.iconBg
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-1.5 flex-wrap">
          {trend && (
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  trend.isPositive !== false
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                )}
              >
                {trend.isPositive !== false ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400 dark:text-slate-500">{trend.label}</span>}
            </div>
          )}

          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 text-xs">{subtitle}</span>
          )}

          {badge && (
            <span
              className={cn(
                'text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0',
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
