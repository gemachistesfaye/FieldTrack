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
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    category: 'EQUIPMENT',
    label: 'Machinery',
    icon: Wrench,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    category: 'ELECTRICAL',
    label: 'Electrical',
    icon: Zap,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    category: 'INFRASTRUCTURE',
    label: 'Infrastructure',
    icon: Building2,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    category: 'SAFETY',
    label: 'Safety Hazard',
    icon: ShieldAlert,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    category: 'SERVICE_INTERRUPTION',
    label: 'Service Outage',
    icon: AlertOctagon,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
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
              selectedCategory === 'ALL' ? 'text-slate-900 font-bold underline' : 'text-slate-400'
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
                'group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-150 cursor-pointer text-center',
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-1.5 transition-colors border',
                  isSelected
                    ? 'bg-slate-800 text-amber-400 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-200'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={cn(
                  'text-xs font-semibold tracking-tight line-clamp-1',
                  isSelected ? 'text-white font-bold' : 'text-slate-700'
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
