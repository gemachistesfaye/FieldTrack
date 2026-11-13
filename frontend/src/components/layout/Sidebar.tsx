import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  GitPullRequest,
  CloudOff,
  History,
  BarChart3,
  Users,
  Settings,
  Radio,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  HardHat,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: Role[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Role-specific navigation items strictly adhering to Prompt 4 specifications
  const getNavItemsForRole = (role?: Role | null): NavItem[] => {
    if (role === 'FIELD_WORKER') {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'My Reports', path: '/reports', icon: ClipboardList, badge: 'Live' },
        { label: 'Create Report', path: '/reports/new', icon: PlusCircle },
        { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
        { label: 'Activity History', path: '/activity', icon: History },
        { label: 'Profile', path: '/settings', icon: UserIcon },
      ];
    }

    if (role === 'COORDINATOR') {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Reports', path: '/reports', icon: ClipboardList, badge: 'All' },
        { label: 'Assigned Reports', path: '/workflow', icon: GitPullRequest, badge: 'Board' },
        { label: 'Create Report', path: '/reports/new', icon: PlusCircle },
        { label: 'Team & Roles', path: '/users', icon: Users },
        { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
        { label: 'Activity History', path: '/activity', icon: History },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Profile', path: '/settings', icon: UserIcon },
      ];
    }

    // Default to ADMIN
    return [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Reports', path: '/reports', icon: ClipboardList, badge: 'All' },
      { label: 'Users', path: '/users', icon: Users },
      { label: 'Create Report', path: '/reports/new', icon: PlusCircle },
      { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
      { label: 'Activity History', path: '/activity', icon: History },
      { label: 'System Settings', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItemsForRole(user?.role);

  const getInitials = (name?: string) => {
    if (!name) return 'FS';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadge = (role?: Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <div className="flex items-center gap-1 text-[11px] font-medium text-rose-400">
            <ShieldAlert className="w-3 h-3" />
            <span className="truncate">System Admin</span>
          </div>
        );
      case 'COORDINATOR':
        return (
          <div className="flex items-center gap-1 text-[11px] font-medium text-blue-400">
            <ShieldCheck className="w-3 h-3" />
            <span className="truncate">Coordinator</span>
          </div>
        );
      case 'FIELD_WORKER':
      default:
        return (
          <div className="flex items-center gap-1 text-[11px] font-medium text-teal-400">
            <HardHat className="w-3 h-3" />
            <span className="truncate">Field Technician</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 select-none shadow-xl border-r border-slate-800',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-2xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base">FieldSync</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Offline Field Ops</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {user?.role === 'FIELD_WORKER'
              ? 'Technician Navigation'
              : user?.role === 'COORDINATOR'
                ? 'Coordinator Command'
                : 'System Administration'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all group',
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors shrink-0',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-md font-semibold',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 border border-slate-700/60'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Authenticated User Session Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold shrink-0">
              {getInitials(user?.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.fullName || 'Field Technician'}
              </p>
              {getRoleBadge(user?.role)}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out of session"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
