import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('marcus.vance@fieldsync.local');
  const [password, setPassword] = useState('Password123!');
  const [localError, setLocalError] = useState<string | null>(null);

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

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setLocalError(null);
    clearError();
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 items-center justify-center text-teal-400 mb-2">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to FieldSync</h2>
          <p className="text-xs text-slate-400">
            Offline-First Field Issue Reporting & Infrastructure Management
          </p>
        </div>

        {/* Demo Account Quick Switcher */}
        <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            Quick Demo Logins (Password: Password123!)
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectDemo('admin@fieldsync.local')}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                email === 'admin@fieldsync.local'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo('marcus.vance@fieldsync.local')}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                email === 'marcus.vance@fieldsync.local'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🛡️ Coordinator
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo('amina.osei@fieldsync.local')}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                email === 'amina.osei@fieldsync.local'
                  ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              👷 Worker
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="text-rose-200/90">{activeError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="name@fieldsync.local"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full justify-center"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Command Center
            </Button>
          </div>
        </form>

        <div className="pt-2 border-t border-slate-700/60 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Need an account?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium underline">
              Register as Field Worker
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Short-lived tokens + HTTP-only refresh rotation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
