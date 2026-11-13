import React from 'react';
import {
  Droplets,
  Wrench,
  Zap,
  Building2,
  ShieldAlert,
  AlertOctagon,
  LucideIcon,
} from 'lucide-react';
import { ReportCategory } from '../../types/report';
import { cn } from '../../utils/cn';

export interface CategoryGridItem {
  category: ReportCategory;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const CATEGORY_DEFINITIONS: CategoryGridItem[] = [
  {
    category: 'WATER',
    label: 'Water Point',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200 group-hover:border-blue-400',
  },
  {
    category: 'EQUIPMENT',
    label: 'Machinery',
    icon: Wrench,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200 group-hover:border-amber-400',
  },
  {
    category: 'ELECTRICAL',
    label: 'Electrical',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200 group-hover:border-yellow-400',
  },
  {
    category: 'INFRASTRUCTURE',
    label: 'Infrastructure',
    icon: Building2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200 group-hover:border-indigo-400',
  },
  {
    category: 'SAFETY',
    label: 'Safety Hazard',
    icon: ShieldAlert,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200 group-hover:border-rose-400',
  },
  {
    category: 'SERVICE_INTERRUPTION',
    label: 'Service Outage',
    icon: AlertOctagon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200 group-hover:border-orange-400',
  },
];

export interface CategoryGridProps {
  selectedCategory?: ReportCategory | 'ALL';
  onSelectCategory: (category: ReportCategory | 'ALL') => void;
  showAllOption?: boolean;
  className?: string;
}

/**
 * Category Icon Grid Component
 * Inspired by 6030449798499995434_121.jpg (Screen 2: "Excavators, Loaders, Bulldozers, Cranes")
 * Shows a horizontal/grid icon collection with clean square cards and vibrant selection state.
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  showAllOption = true,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Domain Category
        </h4>
        {showAllOption && (
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className={cn(
              'text-xs font-semibold hover:underline cursor-pointer',
              selectedCategory === 'ALL' ? 'text-amber-600 font-bold' : 'text-slate-400'
            )}
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {CATEGORY_DEFINITIONS.map(item => {
          const isSelected = selectedCategory === item.category;
          const Icon = item.icon;

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelectCategory(item.category)}
              className={cn(
                'group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-center',
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 border',
                  item.bgColor,
                  item.color
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={cn(
                  'text-[11px] font-bold tracking-tight line-clamp-1',
                  isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-700'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
