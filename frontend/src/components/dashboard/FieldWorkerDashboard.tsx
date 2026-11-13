import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowRight,
  Wifi,
  WifiOff,
  ClipboardList,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { reportApi } from '../../services/reportApi';
import { useAuth } from '../../context/AuthContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { db } from '../../services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { CategoryGrid } from '../common/CategoryGrid';
import { Button } from '../common/Button';
import { CardSkeleton } from '../common/Skeleton';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';
import { ReportCategory } from '../../types/report';

export const FieldWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Query live Dexie.js offline drafts
  const offlineDrafts = useLiveQuery(() => db.reports.toArray(), []) || [];
  const pendingSyncCount = offlineDrafts.filter(d => d.syncStatus === 'PENDING').length;

  // Query aggregated statistics from PostgreSQL via TanStack Query
  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['reportStatistics'],
    queryFn: () => reportApi.getReportStatistics(),
  });

  // Query recent reports for this worker
  const {
    data: reportsRes,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['myRecentReports', selectedCategory],
    queryFn: () =>
      reportApi.getReports({
        limit: 8,
        category: selectedCategory === 'ALL' ? undefined : (selectedCategory as ReportCategory),
      }),
  });

  const stats = statsRes?.data;
  const reports = reportsRes?.data || [];

  const handleRefreshAll = () => {
    refetchStats();
    refetchReports();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Field Technician Command
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, {user?.fullName || 'Technician'} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Offline-first field operations active. You can safely record faults and maintenance issues
              without connectivity; your reports will be queued locally and synchronized automatically.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Link to="/reports/new">
              <Button
                variant="industrial"
                size="md"
                leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                className="shadow-sm font-bold"
              >
                Submit Incident
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Connectivity & Offline Storage Notice Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Network Status
              </p>
              <p className="text-sm font-bold text-slate-900">
                {isOnline ? 'Online (Direct Backend Link)' : 'Offline (Local Dexie Storage)'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOnline
                  ? 'All changes reconcile directly with PostgreSQL'
                  : 'Changes are safely stored locally in browser IndexedDB'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Offline Queue
              </p>
              <p className="text-sm font-bold text-slate-900">
                {pendingSyncCount} Pending Local Sync ({offlineDrafts.length} total local drafts)
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatic retry with idempotency UUID keying
              </p>
            </div>
          </div>
          <Link to="/sync">
            <Button variant="outline" size="xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Statistics */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : statsError ? (
        <ErrorState
          title="Could not load report statistics"
          message="Server statistics telemetry could not be retrieved."
          onRetry={refetchStats}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Total Reports"
            value={stats?.totalReports ?? 0}
            icon={ClipboardList}
            color="slate"
            subtitle="My Lifetime Submissions"
          />
          <StatCard
            title="Drafts"
            value={stats?.drafts ?? 0}
            icon={FileText}
            color="slate"
            subtitle="Editable Local Submissions"
          />
          <StatCard
            title="Submitted"
            value={stats?.submitted ?? 0}
            icon={AlertCircle}
            color="amber"
            subtitle="Awaiting Coordinator Review"
          />
          <StatCard
            title="In Progress"
            value={stats?.inProgress ?? 0}
            icon={Clock}
            color="amber"
            subtitle="Under Active Repair"
          />
          <StatCard
            title="Resolved"
            value={stats?.resolved ?? 0}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Completed & Verified"
          />
        </div>
      )}

      {/* Category Icon Grid matching Screen 2 of Heavy Ops Reference */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
        <CategoryGrid
          selectedCategory={selectedCategory as ReportCategory | 'ALL'}
          onSelectCategory={cat => setSelectedCategory(cat)}
        />
      </div>

      {/* Main Two-Column Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Reports Stream */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  My Recent Incident Reports
                </h3>
                <p className="text-xs text-slate-500">
                  Incident logs and infrastructure fault submissions filed by your account
                </p>
              </div>

              <Link to="/reports">
                <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All ({stats?.totalReports ?? 0})
                </Button>
              </Link>
            </div>

            {/* Filter Pills matching Screen 4 of UX Reference */}
            <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Category:
              </span>
              {['ALL', 'WATER', 'EQUIPMENT', 'ELECTRICAL', 'INFRASTRUCTURE', 'SAFETY'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 border border-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
                  }`}
                >
                  {cat === 'ALL' ? 'All Incidents' : cat.toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Reports List */}
            {reportsLoading ? (
              <div className="p-6 space-y-3">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : reportsError ? (
              <div className="p-6">
                <ErrorState message="Could not retrieve reports list." onRetry={refetchReports} />
              </div>
            ) : reports.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={ClipboardList}
                  title="No Incident Reports Found"
                  description={
                    selectedCategory === 'ALL'
                      ? 'You have not submitted any field incident reports yet.'
                      : `No reports found under the category "${selectedCategory}".`
                  }
                  actionLabel="Create First Incident Report"
                  onAction={() => {}}
                  action={
                    <Link to="/reports/new">
                      <Button variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                        File Incident
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map(report => (
                  <Link
                    key={report.id}
                    to={`/reports/${report.id}`}
                    className="block p-4 sm:p-5 hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CategoryBadge category={report.category} size="sm" />
                          <PriorityBadge priority={report.priority} size="sm" />
                          <StatusBadge status={report.status} size="sm" />
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                          {report.title}
                        </h4>

                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-600 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {report.location}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400 shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(report.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                          Inspect →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown & Quick Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Breakdown Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Report Status Distribution
              </h3>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Draft',
                  count: stats?.drafts ?? 0,
                  color: 'bg-slate-400',
                  bg: 'bg-slate-100',
                },
                {
                  label: 'Submitted',
                  count: stats?.submitted ?? 0,
                  color: 'bg-blue-500',
                  bg: 'bg-blue-50',
                },
                {
                  label: 'In Progress',
                  count: stats?.inProgress ?? 0,
                  color: 'bg-amber-500',
                  bg: 'bg-amber-50',
                },
                {
                  label: 'Resolved',
                  count: stats?.resolved ?? 0,
                  color: 'bg-emerald-500',
                  bg: 'bg-emerald-50',
                },
              ].map(item => {
                const total = stats?.totalReports || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.label} className="space-y-1">
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
          </div>

          {/* Quick Support & Sync Guidance */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              Field Technician Protocols
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When investigating water or electrical equipment hazards, record GPS landmarks clearly
              and mark severity as <span className="text-rose-400 font-semibold">CRITICAL</span> for
              any service stoppage exceeding 500 households.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Offline Dexie.js Engine</span>
              <span className="text-[11px] font-semibold text-teal-300">v0.1 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
