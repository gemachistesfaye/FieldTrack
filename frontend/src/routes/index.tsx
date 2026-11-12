import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
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
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main Authenticated Layout Shell */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/new" element={<NewReportPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="workflow" element={<WorkflowManagementPage />} />
        <Route path="sync" element={<OfflineSyncPage />} />
        <Route path="activity" element={<ActivityHistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
