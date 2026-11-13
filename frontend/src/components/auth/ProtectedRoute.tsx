import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import { UnauthorizedPage } from '../../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading skeleton while verifying persistent session on startup
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 animate-pulse">
          Authenticating Field Operations...
        </p>
      </div>
    );
  }

  // Not authenticated: preserve intended target route and redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specific roles are required
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  return children ? <>{children}</> : <Outlet />;
};
