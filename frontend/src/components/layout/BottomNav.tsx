import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, RefreshCw, Plus, GitPullRequest, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useReportModal } from '../../context/ReportModalContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Mobile Bottom Navigation Bar
 * Fixed on small/medium mobile devices with prominent tabs tailored by role.
 */
export const BottomNav: React.FC = () => {
  const { openCreateReportModal } = useReportModal();
  const { user } = useAuth();
  const { t } = useLanguage();

  const isFieldWorker = user?.role === 'FIELD_WORKER';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 h-16 flex items-center justify-around px-2 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.05)] transition-colors duration-200"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive
              ? 'text-slate-900 dark:text-white font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white scale-105'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 truncate max-w-[64px]">
              {t('navDashboard')}
            </span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/reports"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive
              ? 'text-slate-900 dark:text-white font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white scale-105'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 truncate max-w-[64px]">
              {isFieldWorker ? t('navMyReports') : t('navAllReports')}
            </span>
          </>
        )}
      </NavLink>

      {/* Central Action Tab: Only Field Workers have quick incident creation; Coordinators/Admins have Workflow */}
      {isFieldWorker ? (
        <button
          type="button"
          onClick={openCreateReportModal}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 border border-slate-700">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 text-slate-700 dark:text-slate-300">
            {t('newReport')}
          </span>
        </button>
      ) : (
        <NavLink
          to="/workflow"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
              isActive
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white scale-105'
                    : 'text-slate-400 dark:text-slate-500'
                )}
              >
                <GitPullRequest className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 truncate max-w-[64px]">
                {t('navWorkflow')}
              </span>
            </>
          )}
        </NavLink>
      )}

      <NavLink
        to="/sync"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive
              ? 'text-slate-900 dark:text-white font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white scale-105'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 truncate max-w-[64px]">
              {t('navSync')}
            </span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all select-none',
            isActive
              ? 'text-slate-900 dark:text-white font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                'w-9 h-8 rounded-full flex items-center justify-center transition-transform',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white scale-105'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight font-bold tracking-tight mt-0.5 truncate max-w-[64px]">
              {t('navSettings')}
            </span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
