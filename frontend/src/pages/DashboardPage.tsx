import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FieldWorkerDashboard } from '../components/dashboard/FieldWorkerDashboard';
import { CoordinatorDashboard } from '../components/dashboard/CoordinatorDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { LoadingState } from '../components/common/LoadingState';

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading your FieldSync workspace..." />;
  }

  // Dynamic role-based dashboard rendering
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'COORDINATOR') {
    return <CoordinatorDashboard />;
  }

  // Default to Field Worker Dashboard
  return <FieldWorkerDashboard />;
};
