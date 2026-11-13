import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, RefreshCw, User } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Mobile Bottom Navigation Bar
 * Inspired by 6030449798499995434_121.jpg (Screens 2, 4, 6, 7)
 * Fixed on small/medium mobile devices with 4 prominent tabs and vibrant active amber indicators.
 */
export const BottomNav: React.FC = () => {
  const tabs = [
    { label: 'Home', path: '/', icon: Home, end: true },
    { label: 'Reports', path: '/reports', icon: ClipboardList },
    { label: 'Sync', path: '/sync', icon: RefreshCw },
    { label: 'Profile', path: '/settings', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 h-16 flex items-center justify-around px-3 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.05)]"
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
                isActive ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-600'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                    isActive ? 'bg-amber-400/15 text-amber-600 scale-105' : 'text-slate-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
