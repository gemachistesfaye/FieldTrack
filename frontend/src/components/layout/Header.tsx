import React from 'react';
import { Menu, Wifi, WifiOff, RefreshCw, Bell, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isOnline } = useNetworkStatus();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FS';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'System Administrator';
      case 'COORDINATOR':
        return 'Field Coordinator';
      case 'FIELD_WORKER':
      default:
        return 'Field Technician';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              Field Operations Command
            </h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
              {getRoleLabel(user?.role)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Regional Infrastructure, Water & Maintenance Network
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Status Indicator */}
        <div
          data-testid="network-status"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors shadow-2xs ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={isOnline ? 'Direct network connection to PostgreSQL' : 'Offline storage active via Dexie.js'}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Online (Live)</span>
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
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          title="Inspect Offline Queue & Sync Diagnostics"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-semibold text-slate-700">Sync Engine</span>
        </Link>

        {/* Notifications Button */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative focus:outline-none transition-colors border border-transparent hover:border-slate-200"
          aria-label="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
        </button>

        {/* Quick Report CTA */}
        <Link to="/reports/new">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="shadow-xs"
          >
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </Link>

        {/* User Profile Dropdown Menu */}
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-600/10 border border-teal-500/20 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                {getInitials(user?.fullName)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[100px]">
                  {user?.fullName?.split(' ')[0] || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
              </div>
            </button>
          }
          items={[
            {
              label: `${user?.fullName || 'User'} (${user?.role})`,
              icon: <UserIcon className="w-3.5 h-3.5 text-slate-400" />,
              onClick: () => navigate('/settings'),
            },
            'divider',
            {
              label: 'Sign Out Session',
              icon: <LogOut className="w-3.5 h-3.5 text-rose-500" />,
              variant: 'danger',
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </header>
  );
};
