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
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Endpoints */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Main Authenticated Layout Shell (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/new" element={<NewReportPage />} />
          <Route path="reports/:id" element={<ReportDetailPage />} />
          <Route path="sync" element={<OfflineSyncPage />} />

          {/* Coordinator & Admin Authorized Routes */}
          <Route element={<ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']} />}>
            <Route path="workflow" element={<WorkflowManagementPage />} />
            <Route path="activity" element={<ActivityHistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>

          {/* Admin Only System Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
