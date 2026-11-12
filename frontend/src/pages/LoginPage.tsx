import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('marcus.vance@fieldsync.local');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 items-center justify-center text-teal-600 mb-2">
            <Radio className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to FieldSync</h2>
          <p className="text-xs text-slate-500">
            Offline-First Field Issue Reporting & Infrastructure Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter Command Portal
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-[11px] text-slate-400">
            Offline authentication cached locally on trusted devices.
          </p>
        </div>
      </div>
    </div>
  );
};
