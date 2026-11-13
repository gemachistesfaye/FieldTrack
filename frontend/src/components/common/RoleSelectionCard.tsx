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
        'group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none',
        selected
          ? 'bg-white border-[#1B4332] shadow-sm ring-1 ring-[#1B4332]'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white'
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-4">
        {/* Soft-tinted mint/sage icon container matching reference */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            selected
              ? 'bg-[#EAF3EE] text-[#1B4332]'
              : 'bg-slate-100 text-slate-600 group-hover:bg-[#EAF3EE]/70 group-hover:text-[#1B4332]'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
            {badge && (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed truncate sm:whitespace-normal">
            {description}
          </p>
        </div>
      </div>

      {/* Circular radio selector matching reference */}
      <div className="shrink-0 flex items-center justify-center pl-2">
        <div
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
            selected
              ? 'border-[#1B4332] bg-white'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          )}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />}
        </div>
      </div>
    </div>
  );
};
