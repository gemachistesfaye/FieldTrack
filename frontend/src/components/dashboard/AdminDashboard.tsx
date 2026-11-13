import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  HardHat,
  UserCheck,
  ClipboardList,
  AlertOctagon,
  Activity,
  Shield,
  Server,
  Database,
  RefreshCw,
  Search,
  ArrowRight,
  UserPlus,
  Settings,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { reportApi } from '../../services/reportApi';
import { userApi } from '../../services/userApi';
import { systemApi } from '../../services/systemApi';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Button } from '../common/Button';
import { CardSkeleton } from '../common/Skeleton';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch system & report statistics
  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['reportStatistics'],
    queryFn: () => reportApi.getReportStatistics(),
  });

  // 2. Fetch users directory for administrative counts and roster breakdown
  const {
    data: usersRes,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: () => userApi.getUsers(),
  });

  // 3. Fetch system health and database telemetry
  const {
    data: healthRes,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ['systemHealthTelemetry'],
    queryFn: () => systemApi.getHealth(),
    refetchInterval: 30000, // Poll telemetry every 30s
  });

  // 4. Fetch recent reports for audit & inspection
  const {
    data: reportsRes,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['adminRecentReports', searchQuery],
    queryFn: () =>
      reportApi.getReports({
        limit: 8,
        search: searchQuery.trim() || undefined,
      }),
  });

  const stats = statsRes?.data;
  const users = usersRes?.data || [];
  const health = healthRes?.data;
  const reports = reportsRes?.data || [];

  // Computed administrative counts
  const totalUsers = stats?.totalUsers ?? users.length;
  const fieldWorkers = stats?.activeFieldWorkers ?? users.filter(u => u.role === 'FIELD_WORKER').length;
  const coordinators = stats?.totalCoordinators ?? users.filter(u => u.role === 'COORDINATOR').length;
  const admins = stats?.totalAdmins ?? users.filter(u => u.role === 'ADMIN').length;
  const totalReports = stats?.totalReports ?? 0;
  const unresolvedReports = (stats?.totalReports ?? 0) - (stats?.resolved ?? 0);

  const formatUptime = (seconds?: number): string => {
    if (!seconds) return 'Active';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const handleRefreshAll = () => {
    refetchStats();
    refetchUsers();
    refetchHealth();
    refetchReports();
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Command Banner */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-slate-300" />
              System Superuser • Full Audit & Governance Authority
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              System Administration Console — {user?.fullName || 'Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage system health, user access policies, database synchronizations, and monitor
              operational infrastructure logs across all field sectors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh All
            </Button>
            <Link to="/users">
              <Button
                variant="forest"
                size="md"
                leftIcon={<Users className="w-4 h-4 text-white" />}
                className="font-bold shadow-xs bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
              >
                User Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 KPI Metric Cards */}
      {statsLoading && usersLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : statsError ? (
        <ErrorState
          title="Could not load system statistics"
          message="Server statistics telemetry could not be retrieved."
          onRetry={refetchStats}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            color="slate"
            subtitle="Registered"
          />
          <StatCard
            title="Field Techs"
            value={fieldWorkers}
            icon={HardHat}
            color="slate"
            subtitle="Active on Field"
          />
          <StatCard
            title="Coordinators"
            value={coordinators}
            icon={UserCheck}
            color="slate"
            subtitle="Dispatchers"
          />
          <StatCard
            title="Total Reports"
            value={totalReports}
            icon={ClipboardList}
            color="slate"
            subtitle="Lifetime"
          />
          <StatCard
            title="Unresolved"
            value={unresolvedReports}
            icon={AlertOctagon}
            color="slate"
            badge={unresolvedReports > 5 ? 'High' : undefined}
            subtitle="In-Flight"
          />
          <StatCard
            title="System Health"
            value={health?.status === 'healthy' ? 'Healthy' : 'Degraded'}
            icon={Activity}
            color="slate"
            badge={health?.database.status === 'connected' ? 'Connected' : 'Warning'}
            subtitle={`Uptime: ${formatUptime(health?.uptime)}`}
          />
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): System Health & Recent Incident Stream */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live System Health & Infrastructure Telemetry Panel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                    Backend & Database Infrastructure Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time operational status of API services, PostgreSQL cluster, and cache
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  health?.status === 'healthy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    health?.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {health?.status === 'healthy' ? 'All Systems Operational' : 'Degraded Services'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <Database className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-slate-700">Database Engine</p>
                  <p className="font-bold text-slate-900">
                    PostgreSQL 16 ({health?.database.status === 'connected' ? 'Connected' : 'Error'})
                  </p>
                  <p className="text-slate-500 text-xs">Prisma Client ORM Active</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-slate-700">Process Uptime</p>
                  <p className="font-bold text-slate-900">{formatUptime(health?.uptime)}</p>
                  <p className="text-slate-500 text-xs">Node.js LTS Execution</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-slate-700">API Gateway Version</p>
                  <p className="font-bold text-slate-900">v{health?.version || '0.1.0'}</p>
                  <p className="text-slate-500 text-xs">
                    Env: <span className="uppercase font-semibold">{health?.environment || 'dev'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Reports Audit Stream */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  System-Wide Incident Stream
                </h3>
                <p className="text-xs text-slate-500">
                  Global activity audit across all municipal field technicians and sectors
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Audit search by title, location..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Reports List */}
            {reportsLoading ? (
              <div className="p-6 space-y-3">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : reportsError ? (
              <div className="p-6">
                <ErrorState message="Could not retrieve reports stream." onRetry={refetchReports} />
              </div>
            ) : reports.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={ClipboardList}
                  title="No Incident Reports Found"
                  description="No reports match your filter."
                  actionLabel="Reset Search"
                  onAction={() => setSearchQuery('')}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map(report => (
                  <div
                    key={report.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CategoryBadge category={report.category} size="sm" />
                        <PriorityBadge priority={report.priority} size="sm" />
                        <StatusBadge status={report.status} size="sm" />
                      </div>

                      <Link
                        to={`/reports/${report.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-slate-700 transition-colors block truncate"
                      >
                        {report.title}
                      </Link>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {report.location}
                        </span>
                        <span>
                          Created By: <strong className="text-slate-700">{report.createdBy?.fullName}</strong>
                        </span>
                        {report.assignedTo ? (
                          <span className="text-slate-700 font-bold">
                            Assigned: {report.assignedTo.fullName}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                        <span className="text-slate-400 shrink-0">
                          {new Date(report.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="outline" size="xs">
                          Inspect Audit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): User Role Distribution & Quick Administrative Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Role Distribution Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                User Roster Distribution
              </h3>
              <Users className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {[
                {
                  role: 'FIELD_WORKER',
                  label: 'Field Technicians',
                  count: fieldWorkers,
                  color: 'bg-slate-700',
                },
                {
                  role: 'COORDINATOR',
                  label: 'Coordinators / Dispatchers',
                  count: coordinators,
                  color: 'bg-slate-500',
                },
                {
                  role: 'ADMIN',
                  label: 'System Administrators',
                  count: admins,
                  color: 'bg-slate-900',
                },
              ].map(item => {
                const total = totalUsers || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.role} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">
                        {item.count}{' '}
                        <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link to="/users">
                <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Manage User Directory ({totalUsers})
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Administrative Operations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Administrative Commands
            </h3>

            <div className="space-y-2">
              <Link
                to="/users"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-slate-700">
                      Provision New User
                    </p>
                    <p className="text-xs text-slate-500">Add technician or coordinator</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/reports"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-slate-700">
                      Global Incident Audit
                    </p>
                    <p className="text-xs text-slate-500">Filter across all sectors</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/settings"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-slate-900">
                      System Configuration
                    </p>
                    <p className="text-xs text-slate-500">Security & sync policies</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* System Security Protocols Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-slate-400" />
              Security Governance
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              FieldSync enforces strict Role-Based Access Control (RBAC). Field workers are isolated to
              their own submissions, coordinators manage assignment pipelines, and administrators retain
              system-wide governance authority.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Token Rotation Active</span>
              <span className="font-semibold text-emerald-400">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
