import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Lock, Mail, ChevronRight, Eye, EyeOff, AlertCircle, HardHat, Shield, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { RoleSelectionCard } from '../components/common/RoleSelectionCard';

/**
 * FieldSync Login Portal
 * Styled after the visual language in UX reference 6030449798499995438_121.jpg
 * Light surfaces, deep forest green primary accents (#1B4332), rounded-2xl inputs and role selectors.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('marcus.vance@fieldsync.local');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Preserve intended target or default to overview
  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      await login({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  const handleSelectRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setLocalError(null);
    clearError();
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200/90 p-7 sm:p-9 space-y-6">
        {/* Brand Logo & Header matching Screen 1 */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#EAF3EE] items-center justify-center text-[#1B4332] mb-1 shadow-2xs">
            <Radio className="w-7 h-7 text-[#1B4332]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            FieldSync
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Offline-First Infrastructure Operations
          </p>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-500">Sign in to access your dispatch command</p>
        </div>

        {/* Quick Demo Role Selector Drawer / Toggle */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Test Account Role:</span>
            <button
              type="button"
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="text-[#1B4332] font-semibold hover:underline cursor-pointer"
            >
              {showRoleSelector ? 'Hide Roles' : 'Switch Demo Role'}
            </button>
          </div>

          {showRoleSelector && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <RoleSelectionCard
                id="marcus.vance@fieldsync.local"
                title="Coordinator / Dispatcher"
                description="Review, prioritize, and assign incoming reports"
                icon={Shield}
                badge="🛡️ Coordinator"
                selected={email === 'marcus.vance@fieldsync.local'}
                onSelect={handleSelectRole}
              />
              <RoleSelectionCard
                id="amina.osei@fieldsync.local"
                title="Field Technician"
                description="Create offline reports and capture GPS landmarks"
                icon={HardHat}
                badge="👷 Worker"
                selected={email === 'amina.osei@fieldsync.local'}
                onSelect={handleSelectRole}
              />
              <RoleSelectionCard
                id="admin@fieldsync.local"
                title="System Administrator"
                description="Full system governance, telemetry, and user management"
                icon={Users}
                badge="👑 Admin"
                selected={email === 'admin@fieldsync.local'}
                onSelect={handleSelectRole}
              />
            </div>
          )}

          {!showRoleSelector && (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('admin@fieldsync.local')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  email === 'admin@fieldsync.local'
                    ? 'bg-[#EAF3EE] border-[#1B4332] text-[#1B4332] ring-1 ring-[#1B4332]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('marcus.vance@fieldsync.local')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  email === 'marcus.vance@fieldsync.local'
                    ? 'bg-[#EAF3EE] border-[#1B4332] text-[#1B4332] ring-1 ring-[#1B4332]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🛡️ Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('amina.osei@fieldsync.local')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  email === 'amina.osei@fieldsync.local'
                    ? 'bg-[#EAF3EE] border-[#1B4332] text-[#1B4332] ring-1 ring-[#1B4332]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                👷 Worker
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Authentication Notice</p>
              <p className="text-rose-700 mt-0.5">{activeError}</p>
            </div>
          </div>
        )}

        {/* Sign In Form matching Screen 1 inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all shadow-2xs"
                placeholder="name@fieldsync.local"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 text-sm bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all shadow-2xs"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="forest"
              size="lg"
              className="w-full justify-center rounded-2xl shadow-sm text-sm font-semibold h-12"
              isLoading={isLoading}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#1B4332] hover:text-[#143527] font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
