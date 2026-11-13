import React from 'react';
import { Menu, Plus, LogOut } from 'lucide-react';
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
        return 'Admin';
      case 'COORDINATOR':
        return 'Coordinator';
      case 'FIELD_WORKER':
      default:
        return 'Field Tech';
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

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Field Operations Command
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            {getRoleLabel(user?.role)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Status Pill */}
        <div
          data-testid="network-status"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700"
          title={isOnline ? 'Online mode' : 'Offline mode'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Quick Report Action */}
        <Link to="/reports/new">
          <Button
            variant="forest"
            size="sm"
            className="font-bold shadow-xs bg-slate-900 hover:bg-slate-800 text-white"
            leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
          >
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="User Account Menu"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                {getInitials(user?.fullName)}
              </div>
            </button>
          }
          items={[
            {
              label: `${user?.fullName || 'User'} (${getRoleLabel(user?.role)})`,
              onClick: () => {
                if (user?.role === 'ADMIN') {
                  navigate('/settings');
                } else {
                  navigate('/sync');
                }
              },
            },
            'divider',
            {
              label: 'Sign Out',
              icon: <LogOut className="w-4 h-4" />,
              variant: 'danger',
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </header>
  );
};
