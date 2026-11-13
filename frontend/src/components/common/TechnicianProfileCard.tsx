import React from 'react';
import {
  User,
  ClipboardList,
  RefreshCw,
  FileCheck2,
  LifeBuoy,
  Settings,
  LogOut,
  ChevronRight,
  HardHat,
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface TechnicianProfileCardProps {
  fullName: string;
  role: string;
  email: string;
  stats: {
    totalReports: number;
    activeTasks: number;
    syncReliability?: string;
  };
  onEditProfile?: () => void;
  onLogout: () => void;
  onNavigateItem?: (route: string) => void;
  className?: string;
}

/**
 * Field Technician & User Profile Card
 * Direct adaptation of 6030449798499995434_121.jpg (Screen 7: "Ahmed Hassan - Contractor Profile")
 * Features a dark hero profile card, 3-stat metric bar, clean menu actions, and logout.
 */
export const TechnicianProfileCard: React.FC<TechnicianProfileCardProps> = ({
  fullName,
  role,
  email,
  stats,
  onEditProfile,
  onLogout,
  onNavigateItem,
  className,
}) => {
  const menuItems = [
    { label: 'My Incident Reports', icon: ClipboardList, route: '/reports' },
    { label: 'Offline Sync Queue', icon: RefreshCw, route: '/sync' },
    { label: 'Inspection History & Logs', icon: FileCheck2, route: '/activity' },
    { label: 'Safety Guidelines & Protocols', icon: LifeBuoy, route: '/support' },
    { label: 'Account & Security Settings', icon: Settings, route: '/settings' },
  ];

  return (
    <div className={cn('bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden max-w-md mx-auto', className)}>
      {/* Dark Hero Header */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-white space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-400 p-0.5 flex items-center justify-center text-amber-300">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{fullName}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                {role}
              </p>
              <p className="text-[11px] text-slate-500">{email}</p>
            </div>
          </div>

          {onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* 3 Metric Columns matching Screen 7 */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 pt-3 border-t border-slate-800/80 text-center">
          <div>
            <p className="text-xl font-bold text-white">{stats.totalReports}</p>
            <p className="text-[11px] text-slate-400">Total Reports</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">{stats.activeTasks}</p>
            <p className="text-[11px] text-slate-400">Active Tasks</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-400">
              {stats.syncReliability || '100%'}
            </p>
            <p className="text-[11px] text-slate-400">Sync Health</p>
          </div>
        </div>
      </div>

      {/* Menu Action Items */}
      <div className="p-4 sm:p-5 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigateItem && onNavigateItem(item.route)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-slate-700 group-hover:text-slate-900">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          );
        })}

        {/* Log Out Button matching reference */}
        <div className="pt-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onLogout}
            className="w-full justify-center rounded-2xl border-slate-200 text-slate-700 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};
