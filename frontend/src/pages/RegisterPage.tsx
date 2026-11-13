import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Lock, Mail, User, ChevronRight, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join FieldSync to manage infrastructure & field reporting
          </p>
        </div>

        {/* Policy Pill */}
        <div className="p-3 rounded-2xl bg-[#EAF3EE] border border-[#1B4332]/20 flex items-start gap-2.5 text-xs text-[#1B4332]">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1B4332]" />
          <p className="text-[11px] leading-relaxed">
            Public registration provisions an isolated <span className="font-bold">FIELD_WORKER</span> account. Coordinator and Admin roles are granted by system administrators.
          </p>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Registration Notice</p>
              <p className="text-rose-700 mt-0.5">{activeError}</p>
            </div>
          </div>
        )}

        {/* Registration Form matching Screen 1 inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all shadow-2xs"
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
              Password (min 8 characters)
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
                minLength={8}
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

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all shadow-2xs"
                placeholder="••••••••••••"
                required
              />
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
              Sign Up
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#1B4332] hover:text-[#143527] font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
