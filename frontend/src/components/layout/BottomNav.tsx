import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, RefreshCw, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useReportModal } from '../../context/ReportModalContext';

/**
 * Mobile Bottom Navigation Bar
 * Fixed on small/medium mobile devices with 4 prominent tabs and quick incident creation modal.
 */
export const BottomNav: React.FC = () => {
  const { openCreateReportModal } = useReportModal();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 h-16 flex items-center justify-around px-3 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.05)]"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive ? 'bg-slate-100 text-slate-900 scale-105' : 'text-slate-400'
              )}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs leading-tight font-bold tracking-tight mt-0.5">
              Home
            </span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/reports"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive ? 'bg-slate-100 text-slate-900 scale-105' : 'text-slate-400'
              )}
            >
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xs leading-tight font-bold tracking-tight mt-0.5">
              Reports
            </span>
          </>
        )}
      </NavLink>

      {/* Central Quick Report Dialog Trigger */}
      <button
        type="button"
        onClick={openCreateReportModal}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 text-slate-700">
          New
        </span>
      </button>

      <NavLink
        to="/sync"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive ? 'bg-slate-100 text-slate-900 scale-105' : 'text-slate-400'
              )}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-xs leading-tight font-bold tracking-tight mt-0.5">
              Sync
            </span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
