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
import { useReportModal } from '../../context/ReportModalContext';
import { useLanguage } from '../../context/LanguageContext';

export const FieldWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { openCreateReportModal } = useReportModal();
  const { t } = useLanguage();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
            {t('techCommand')}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('welcomeBack')}, {user?.fullName || 'Technician'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('techSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {t('refresh')}
          </Button>

          <Button
            variant="forest"
            size="sm"
            onClick={openCreateReportModal}
            className="font-bold shadow-xs bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
          >
            {t('newIncidentReport')}
          </Button>
        </div>
      </div>

      {/* Connectivity & Offline Storage Notice Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-4.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
              {isOnline ? <Wifi className="w-4.5 h-4.5" /> : <WifiOff className="w-4.5 h-4.5 text-slate-400" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Network Status
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isOnline ? 'Online (Direct Backend Link)' : 'Offline (Local Dexie Storage)'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isOnline
                  ? 'All changes reconcile directly with PostgreSQL'
                  : 'Changes are safely stored locally in browser IndexedDB'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-4.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Offline Queue
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {pendingSyncCount} Pending Local Sync ({offlineDrafts.length} total local drafts)
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
            color="slate"
            subtitle="Awaiting Coordinator Review"
          />
          <StatCard
            title="In Progress"
            value={stats?.inProgress ?? 0}
            icon={Clock}
            color="slate"
            subtitle="Under Active Repair"
          />
          <StatCard
            title="Resolved"
            value={stats?.resolved ?? 0}
            icon={CheckCircle2}
            color="slate"
            subtitle="Completed & Verified"
          />
        </div>
      )}

      {/* Category Icon Grid matching Screen 2 of Heavy Ops Reference */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
        <CategoryGrid
          selectedCategory={selectedCategory as ReportCategory | 'ALL'}
          onSelectCategory={cat => setSelectedCategory(cat)}
        />
      </div>

      {/* Main Two-Column Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Reports Stream */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  My Recent Incident Reports
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Incident logs and infrastructure fault submissions filed by your account
                </p>
              </div>

              <Link to="/reports">
                <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All ({stats?.totalReports ?? 0})
                </Button>
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Category:
              </span>
              {['ALL', 'WATER', 'EQUIPMENT', 'ELECTRICAL', 'INFRASTRUCTURE', 'SAFETY'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border border-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700'
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
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map(report => (
                  <Link
                    key={report.id}
                    to={`/reports/${report.id}`}
                    className="block p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CategoryBadge category={report.category} size="sm" />
                          <PriorityBadge priority={report.priority} size="sm" />
                          <StatusBadge status={report.status} size="sm" />
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors truncate">
                          {report.title}
                        </h4>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {report.location}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0">
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
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:translate-x-0.5 transition-transform">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                Report Status Distribution
              </h3>
              <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Draft',
                  count: stats?.drafts ?? 0,
                  color: 'bg-slate-300 dark:bg-slate-700',
                },
                {
                  label: 'Submitted',
                  count: stats?.submitted ?? 0,
                  color: 'bg-slate-500 dark:bg-slate-500',
                },
                {
                  label: 'In Progress',
                  count: stats?.inProgress ?? 0,
                  color: 'bg-slate-700 dark:bg-slate-400',
                },
                {
                  label: 'Resolved',
                  count: stats?.resolved ?? 0,
                  color: 'bg-slate-900 dark:bg-white',
                },
              ].map(item => {
                const total = stats?.totalReports || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.count}{' '}
                        <span className="text-slate-400 dark:text-slate-500 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
