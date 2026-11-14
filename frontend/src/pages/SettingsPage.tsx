import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Key,
  Palette,
  Globe,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/authApi';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'system'>(
    'profile'
  );

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // System Sync Settings
  const [autoSync, setAutoSync] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(5);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return 'FS';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: t('roleAdmin'),
          desc: t('roleDescAdmin'),
          badgeClass: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'COORDINATOR':
        return {
          label: t('roleCoordinator'),
          desc: t('roleDescCoordinator'),
          badgeClass: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      case 'FIELD_WORKER':
      default:
        return {
          label: t('roleFieldWorker'),
          desc: t('roleDescFieldWorker'),
          badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsUpdatingProfile(true);
    try {
      const res = await authApi.updateProfile({ fullName: fullName.trim() });
      if (res.data) {
        updateUser(res.data);
      }
      success(t('profileUpdatedSuccess'), `${t('fullName')}: ${fullName}`);
    } catch (err) {
      toastError('Update Failed', err instanceof Error ? err.message : 'Could not update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError(t('passwordRequirement'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwordMismatch'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      success('Password Updated', t('passwordChangedSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordError(msg);
      toastError('Password Change Failed', msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePurgeCache = () => {
    if (window.confirm('Purge non-essential offline telemetry cache?')) {
      setFeedback('Offline cache purged. Only pending reports retained.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('settingsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('settingsSubtitle')}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="font-bold border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 self-start sm:self-auto cursor-pointer"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          {t('signOut')}
        </Button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          {t('tabProfile')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          {t('tabSecurity')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          {t('tabAppearance')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          {t('tabSystem')}
        </button>
      </div>

      {/* TAB 1: PROFILE & ACCOUNT */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    {t('accountInfo')}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    {t('accountInfoDesc')}
                  </CardDescription>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${roleInfo.badgeClass}`}
                >
                  {roleInfo.label}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              {/* User Avatar & Role Overview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
                  {getInitials(user?.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {user?.fullName || 'Technician'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                    {roleInfo.desc}
                  </p>
                </div>
              </div>

              {/* Edit Full Name Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Organization email is managed by your administrator.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {t('accountStatus')}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('activeStatus')}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {t('roleLabel')}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {roleInfo.label}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="forest"
                    size="sm"
                    isLoading={isUpdatingProfile}
                    className="font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  >
                    {t('updateProfileBtn')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PASSWORD & SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  {t('changePasswordTitle')}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {t('changePasswordDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('currentPassword')} *
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('newPassword')} *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="At least 8 characters..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('confirmNewPassword')} *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Re-type new password..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>

                <p className="text-xs text-slate-400">
                  {t('passwordRequirement')}
                </p>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="forest"
                    size="sm"
                    isLoading={isChangingPassword}
                    className="font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  >
                    {t('changePasswordBtn')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: APPEARANCE & LANGUAGE */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Appearance (Theme) Card */}
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  {t('appearanceTitle')}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {t('appearanceDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    theme === 'light'
                      ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800 ring-2 ring-slate-900 dark:ring-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' && (
                      <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('themeLight')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('themeLightDesc')}
                    </p>
                  </div>
                </button>

                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800 ring-2 ring-slate-900 dark:ring-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' && (
                      <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('themeDark')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('themeDarkDesc')}
                    </p>
                  </div>
                </button>

                {/* System Mode Option */}
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    theme === 'system'
                      ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800 ring-2 ring-slate-900 dark:ring-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <Laptop className="w-5 h-5" />
                    </div>
                    {theme === 'system' && (
                      <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('themeSystem')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('themeSystemDesc')}
                    </p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Language Selection Card */}
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  {t('languageTitle')}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {t('languageDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* English Option */}
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    language === 'en'
                      ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800 ring-2 ring-slate-900 dark:ring-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇺🇸</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {t('langEnglish')}
                      </p>
                      <p className="text-xs text-slate-400">English interface</p>
                    </div>
                  </div>
                  {language === 'en' && (
                    <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  )}
                </button>

                {/* Amharic Option */}
                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    language === 'am'
                      ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800 ring-2 ring-slate-900 dark:ring-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇪🇹</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {t('langAmharic')}
                      </p>
                      <p className="text-xs text-slate-400">የአማርኛ በይነገጽ</p>
                    </div>
                  </div>
                  {language === 'am' && (
                    <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: SYSTEM & OFFLINE STORAGE */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Sync Policy Card */}
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Cloud className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <CardTitle>{t('offlineSyncTitle')}</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {t('offlineSyncDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('backgroundSync')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('backgroundSyncDesc')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('maxRetry')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('maxRetryDesc')}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={retryAttempts}
                  onChange={e => setRetryAttempts(parseInt(e.target.value) || 3)}
                  className="w-20 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('purgeCache')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('purgeCacheDesc')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePurgeCache}
                  leftIcon={<HardDrive className="w-3.5 h-3.5 text-slate-400" />}
                  className="font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {t('purgeCacheBtn')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access Policy Card */}
          <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Shield className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <CardTitle>Security & Role-Based Access Controls</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Audit logging enforcement and session rotation policy
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Strict Token Rotation (RTR)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Single-use refresh token verification with automated reuse detection
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Immutable Audit Trail</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All report status changes and coordinator assignments cryptographically logged
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Enforced
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
