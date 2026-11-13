import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Lock, Mail, User, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    try {
      await register({ fullName, email, password, confirmPassword });
      navigate('/', { replace: true });
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Registration failed. Please check the details entered.'
      );
    }
  };

  const activeError = validationError || error;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 items-center justify-center text-teal-400 mb-2">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Field Worker Account</h2>
          <p className="text-xs text-slate-400">
            Self-register for offline field incident reporting and maintenance operations
          </p>
        </div>

        {/* Security / Role Notice */}
        <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/60 flex items-start gap-2.5 text-xs text-teal-200">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
          <div>
            <p className="font-semibold text-teal-300">Registration Policy:</p>
            <p className="text-[11px] text-teal-200/80">
              Public registration automatically provisions a <span className="font-bold">FIELD_WORKER</span> profile. Coordinator and Administrator roles require elevated provisioning by system administrators.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold">Registration Notice</p>
              <p className="text-rose-200/90">{activeError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Samuel Kiprop"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="name@fieldsync.local"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password (min 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••••••"
                required
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              Complete Registration
            </Button>
          </div>
        </form>

        <div className="pt-2 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Already have an active account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
