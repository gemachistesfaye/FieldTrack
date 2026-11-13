import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-rose-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
          <p className="text-sm text-slate-600">
            Your user account ({user?.email}) with role{' '}
            <span className="font-semibold text-slate-900">{user?.role}</span> does not have
            permission to access this resource.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">Role Permissions Guidance:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500">
            <li>Field Workers manage their own incident submissions.</li>
            <li>Coordinators review, assign, and update workflow statuses.</li>
            <li>Admins maintain system configuration and user accounts.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Dashboard
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
};
