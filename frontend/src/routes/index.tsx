import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { ReportsPage } from '../pages/ReportsPage';
import { NewReportPage } from '../pages/NewReportPage';
import { ReportDetailPage } from '../pages/ReportDetailPage';
import { WorkflowManagementPage } from '../pages/WorkflowManagementPage';
import { OfflineSyncPage } from '../pages/OfflineSyncPage';
import { ActivityHistoryPage } from '../pages/ActivityHistoryPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LandingPage } from '../pages/LandingPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { useAuth } from '../context/AuthContext';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root Route: displays Landing Page for visitors; displays AppLayout with Dashboard when authenticated */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <AppLayout />
          ) : (
            <LandingPage />
          )
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>

      {/* Public Marketing & Landing Overview */}
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Public Authentication Endpoints */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Main Authenticated Layout Shell (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/:id" element={<ReportDetailPage />} />
          <Route path="sync" element={<OfflineSyncPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<SettingsPage />} />

          {/* Field Worker Only Route (Only field workers submit reports) */}
          <Route element={<ProtectedRoute allowedRoles={['FIELD_WORKER']} />}>
            <Route path="reports/new" element={<NewReportPage />} />
          </Route>

          {/* Coordinator & Admin Authorized Routes */}
          <Route element={<ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']} />}>
            <Route path="workflow" element={<WorkflowManagementPage />} />
            <Route path="activity" element={<ActivityHistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
