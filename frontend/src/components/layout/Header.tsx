import React from 'react';
import { Menu, Wifi, WifiOff, RefreshCw, Bell, Plus } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isOnline } = useNetworkStatus();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-slate-900">Field Operations Command</h1>
          <p className="text-xs text-slate-500">Regional Infrastructure & Water Services</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Network Status Indicator */}
        <div
          data-testid="network-status"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Online (Live Sync)</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Mode</span>
            </>
          )}
        </div>

        {/* Sync queue indicator */}
        <Link
          to="/sync"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          title="IndexedDB Sync Engine"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-medium">Sync Queue (0)</span>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
        </button>

        {/* Quick Report CTA */}
        <Link to="/reports/new">
          <Button variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            New Report
          </Button>
        </Link>
      </div>
    </header>
  );
};
