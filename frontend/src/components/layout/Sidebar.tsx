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
  ShieldCheck,
  Radio,
  LogOut,
  ShieldAlert,
  HardHat,
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

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Field Reports', path: '/reports', icon: ClipboardList, badge: 'Active' },
  { label: 'Submit Issue', path: '/reports/new', icon: PlusCircle },
  {
    label: 'Coordinator Board',
    path: '/workflow',
    icon: GitPullRequest,
    allowedRoles: ['COORDINATOR', 'ADMIN'],
  },
  { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
  {
    label: 'Audit Trail',
    path: '/activity',
    icon: History,
    allowedRoles: ['COORDINATOR', 'ADMIN'],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    allowedRoles: ['COORDINATOR', 'ADMIN'],
  },
  {
    label: 'Team & Roles',
    path: '/users',
    icon: Users,
    allowedRoles: ['COORDINATOR', 'ADMIN'],
  },
  {
    label: 'System Settings',
    path: '/settings',
    icon: Settings,
    allowedRoles: ['ADMIN'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.allowedRoles) return true;
    if (!user) return false;
    return item.allowedRoles.includes(user.role);
  });

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
          <div className="flex items-center gap-1 text-[11px] text-rose-400">
            <ShieldAlert className="w-3 h-3" />
            <span className="truncate">System Admin</span>
          </div>
        );
      case 'COORDINATOR':
        return (
          <div className="flex items-center gap-1 text-[11px] text-blue-400">
            <ShieldCheck className="w-3 h-3" />
            <span className="truncate">Field Coordinator</span>
          </div>
        );
      case 'FIELD_WORKER':
      default:
        return (
          <div className="flex items-center gap-1 text-[11px] text-teal-400">
            <HardHat className="w-3 h-3" />
            <span className="truncate">Field Worker</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base">FieldSync</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                v0.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Offline Field Ops</p>
          </div>
        </div>

        {/* Navigation list (scoped to user's assigned role) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Navigation
          </div>
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-medium',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
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
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-semibold shrink-0">
              {getInitials(user?.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.fullName || 'Field Worker'}
              </p>
              {getRoleBadge(user?.role)}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out of session"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
