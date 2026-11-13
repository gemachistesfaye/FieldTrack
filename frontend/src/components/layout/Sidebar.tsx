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
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
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

  // Structured navigation sections by role
  const getNavSectionsForRole = (role?: Role | null): NavSection[] => {
    if (role === 'FIELD_WORKER') {
      return [
        {
          title: 'Field Operations',
          items: [
            { label: 'Dashboard', path: '/', icon: LayoutDashboard },
            { label: 'My Reports', path: '/reports', icon: ClipboardList, badge: 'Live' },
            { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
            { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
          ],
        },
        {
          title: 'History & Identity',
          items: [
            { label: 'Activity History', path: '/activity', icon: History },
            { label: 'My Profile', path: '/settings', icon: UserIcon },
          ],
        },
      ];
    }

    if (role === 'COORDINATOR') {
      return [
        {
          title: 'Field Operations',
          items: [
            { label: 'Dashboard', path: '/', icon: LayoutDashboard },
            { label: 'All Reports', path: '/reports', icon: ClipboardList, badge: 'All' },
            { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
            { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
          ],
        },
        {
          title: 'Dispatch & Triage',
          items: [
            { label: 'Workflow Board', path: '/workflow', icon: GitPullRequest, badge: 'Board' },
            { label: 'Team Directory', path: '/users', icon: Users },
            { label: 'Ops Analytics', path: '/analytics', icon: BarChart3 },
          ],
        },
        {
          title: 'Audit & Settings',
          items: [
            { label: 'Activity History', path: '/activity', icon: History },
            { label: 'Profile & Settings', path: '/settings', icon: Settings },
          ],
        },
      ];
    }

    // Default to ADMIN
    return [
      {
        title: 'Operations',
        items: [
          { label: 'Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'All Reports', path: '/reports', icon: ClipboardList, badge: 'All' },
          { label: 'Log Incident', path: '/reports/new', icon: PlusCircle },
          { label: 'Offline & Sync', path: '/sync', icon: CloudOff },
        ],
      },
      {
        title: 'Administration',
        items: [
          { label: 'User Management', path: '/users', icon: Users },
          { label: 'Workflow Board', path: '/workflow', icon: GitPullRequest },
          { label: 'System Analytics', path: '/analytics', icon: BarChart3 },
          { label: 'Audit Trail', path: '/activity', icon: History },
          { label: 'System Settings', path: '/settings', icon: Settings },
        ],
      },
    ];
  };

  const navSections = getNavSectionsForRole(user?.role);

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
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">System Admin</span>
          </div>
        );
      case 'COORDINATOR':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Coordinator</span>
          </div>
        );
      case 'FIELD_WORKER':
      default:
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <HardHat className="w-3.5 h-3.5 text-slate-400" />
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar navigation container with collapsible desktop width */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 select-none shadow-2xl border-r border-slate-800 lg:h-screen lg:sticky lg:top-0',
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full',
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-2xs shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white tracking-tight text-lg">FieldSync</span>
                  <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium truncate">Offline Field Ops</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile close button */}
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

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-none">
          {navSections.map(section => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 pb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              ) : (
                <div className="h-px bg-slate-800 my-2" />
              )}

              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    end={item.path === '/'}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all group cursor-pointer',
                        isCollapsed && 'justify-center px-0 py-2.5',
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
                            isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!isCollapsed && item.badge && (
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-md font-bold',
                              isActive
                                ? 'bg-slate-700 text-slate-200'
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
            </div>
          ))}
        </nav>

        {/* Authenticated User Session Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 shrink-0">
          <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}>
            <div
              className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 text-sm font-bold shrink-0"
              title={user?.fullName || 'Technician'}
            >
              {getInitials(user?.fullName)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {user?.fullName || 'Field Technician'}
                </p>
                {getRoleBadge(user?.role)}
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out of session"
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
