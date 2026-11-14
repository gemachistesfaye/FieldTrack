import React from 'react';
import { Menu, Plus, LogOut, Sun, Moon, Globe, Settings as SettingsIcon } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReportModal } from '../../context/ReportModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isOnline } = useNetworkStatus();
  const { user, logout } = useAuth();
  const { openCreateReportModal } = useReportModal();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
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
        return t('roleAdmin');
      case 'COORDINATOR':
        return t('roleCoordinator');
      case 'FIELD_WORKER':
      default:
        return t('roleFieldWorker');
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            <span className="hidden sm:inline">{t('headerTitle')}</span>
            <span className="sm:hidden">{t('appName')}</span>
          </span>
          <span className="hidden xs:inline-flex text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
            {getRoleLabel(user?.role)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Language Quick Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={language === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{language === 'en' ? 'አማ' : 'EN'}</span>
        </button>

        {/* Theme Quick Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          title={resolvedTheme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-slate-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Network Status Pill */}
        <div
          data-testid="network-status"
          className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0"
          title={isOnline ? t('online') : t('offline')}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOnline ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-400'
            }`}
          />
          <span className="hidden sm:inline">{isOnline ? t('online') : t('offline')}</span>
        </div>

        {/* Quick Report Action - ONLY FOR FIELD WORKERS */}
        {user?.role === 'FIELD_WORKER' && (
          <Button
            variant="forest"
            size="sm"
            onClick={openCreateReportModal}
            className="font-bold shadow-xs bg-slate-900 hover:bg-slate-800 text-white cursor-pointer px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
            leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
          >
            <span className="hidden sm:inline">{t('newReport')}</span>
            <span className="sm:hidden">{t('newReport')}</span>
          </Button>
        )}

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer shrink-0"
              aria-label="User Account Menu"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                {getInitials(user?.fullName)}
              </div>
            </button>
          }
          items={[
            {
              label: `${user?.fullName || 'User'} (${getRoleLabel(user?.role)})`,
              onClick: () => navigate('/settings'),
            },
            {
              label: t('navSettings'),
              icon: <SettingsIcon className="w-4 h-4 text-slate-400" />,
              onClick: () => navigate('/settings'),
            },
            'divider',
            {
              label: t('signOut'),
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
