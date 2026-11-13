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
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Strictly role-guarded navigation items (never show pages that produce 403 Forbidden)
  const getNavItems = (role?: Role | null): NavItem[] => {
    if (role === 'FIELD_WORKER') {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'My Reports', path: '/reports', icon: ClipboardList },
        { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
        { label: 'Offline Sync', path: '/sync', icon: CloudOff },
      ];
    }

    if (role === 'COORDINATOR') {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'All Reports', path: '/reports', icon: ClipboardList },
        { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
        { label: 'Workflow Board', path: '/workflow', icon: GitPullRequest },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Activity Log', path: '/activity', icon: History },
        { label: 'Team Directory', path: '/users', icon: Users },
        { label: 'Offline Sync', path: '/sync', icon: CloudOff },
      ];
    }

    // Default: ADMIN (Has access to all modules including System Settings)
    return [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'All Reports', path: '/reports', icon: ClipboardList },
      { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
      { label: 'Workflow Board', path: '/workflow', icon: GitPullRequest },
      { label: 'Team Directory', path: '/users', icon: Users },
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Activity Log', path: '/activity', icon: History },
      { label: 'Offline Sync', path: '/sync', icon: CloudOff },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems(user?.role);

  const getInitials = (name?: string) => {
    if (!name) return 'FS';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role?: Role) => {
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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 select-none shadow-xl border-r border-slate-800 lg:h-screen lg:sticky lg:top-0',
          isOpen ? 'translate-x-0 w-60' : '-translate-x-full',
          isCollapsed ? 'lg:w-20' : 'lg:w-60'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-white tracking-tight text-lg">FieldSync</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
              title="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Short, Clean Navigation List with Generous Spacing */}
        <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;

            if (item.action) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action?.();
                    onClose?.();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3.5 px-3.5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800/60 text-left',
                    isCollapsed && 'justify-center px-0 py-3'
                  )}
                >
                  <Icon className="w-5 h-5 text-slate-400 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path || item.label}
                to={item.path!}
                onClick={onClose}
                end={item.path === '/'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3.5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer',
                    isCollapsed && 'justify-center px-0 py-3',
                    isActive
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors shrink-0',
                        isActive ? 'text-amber-400' : 'text-slate-400'
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Sign Out Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}>
            <div
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 text-xs font-bold shrink-0"
              title={user?.fullName || 'User'}
            >
              {getInitials(user?.fullName)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
