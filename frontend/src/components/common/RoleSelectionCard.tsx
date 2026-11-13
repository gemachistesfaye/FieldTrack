import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface RoleSelectionCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (id: string) => void;
  badge?: string;
  disabled?: boolean;
}

/**
 * Role & Account Type selection card
 * Matches the exact UX pattern from 6030449798499995438_121.jpg (Screen 2: "What type of account are you?")
 * Features a soft-tinted left icon box, bold title, subtitle, and custom circular radio selector.
 */
export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  selected,
  onSelect,
  badge,
  disabled,
}) => {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onSelect(id)}
      onKeyDown={e => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className={cn(
        'group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none',
        selected
          ? 'bg-amber-400/10 border-amber-500 shadow-2xs ring-1 ring-amber-500/30'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white'
      )}
    >
      <div className="flex items-center gap-3 min-w-0 pr-4">
        {/* Soft-tinted icon container */}
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
            selected
              ? 'bg-amber-400 text-slate-950 border-amber-400'
              : 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-200'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
            {badge && (
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed truncate sm:whitespace-normal">
            {description}
          </p>
        </div>
      </div>

      {/* Circular radio selector */}
      <div className="shrink-0 flex items-center justify-center pl-2">
        <div
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
            selected
              ? 'border-amber-500 bg-white'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          )}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
        </div>
      </div>
    </div>
  );
};
