import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Lock, Mail, User, ChevronRight, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

/**
 * FieldSync Register Page
 * Styled directly after UX reference 6030449798499995438_121.jpg (Screen 1: "Create Account")
 * Features soft rounded-2xl inputs with leading icons, deep forest green CTA, and clean light surface.
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-5">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 items-center justify-center text-amber-400 mb-1 shadow-2xs">
            <Radio className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            FieldSync
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Offline-First Infrastructure Operations
          </p>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join FieldSync to manage infrastructure & field reporting
          </p>
        </div>

        {/* Policy Pill */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" />
          <p className="text-xs leading-relaxed">
            Public registration provisions an isolated <span className="font-bold text-slate-900">FIELD_WORKER</span> account. Coordinator and Admin roles are granted by system administrators.
          </p>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Registration Notice</p>
              <p className="text-rose-700 mt-0.5">{activeError}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                placeholder="Samuel Kiprop"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                placeholder="name@fieldsync.local"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password (min 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                placeholder="••••••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="industrial"
              size="lg"
              className="w-full justify-center rounded-lg shadow-xs text-sm font-bold h-11 text-slate-950"
              isLoading={isLoading}
              rightIcon={<ChevronRight className="w-4 h-4 text-slate-950" />}
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
          <div className="pt-1">
            <Link
              to="/welcome"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to FieldSync Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
