import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  AlertTriangle,
  UserCheck,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  GitPullRequest,
  RefreshCw,
  Search,
  MapPin,
  Users,
} from 'lucide-react';
import { reportApi } from '../../services/reportApi';
import { userApi } from '../../services/userApi';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Button } from '../common/Button';
import { CardSkeleton } from '../common/Skeleton';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { ReportDTO } from '../../types/report';

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportForAssign, setSelectedReportForAssign] = useState<ReportDTO | null>(null);
  const [assigneeId, setAssigneeId] = useState('');

  // 1. Fetch live report statistics from backend
  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['reportStatistics'],
    queryFn: () => reportApi.getReportStatistics(),
  });

  // 2. Fetch incoming reports
  const {
    data: reportsRes,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['coordinatorReports', searchQuery],
    queryFn: () =>
      reportApi.getReports({
        limit: 10,
        search: searchQuery.trim() || undefined,
      }),
  });

  // 3. Fetch users for assignment modal
  const { data: usersRes } = useQuery({
    queryKey: ['usersList'],
    queryFn: () => userApi.getUsers(),
  });

  // Assignment Mutation
  const assignMutation = useMutation({
    mutationFn: ({ reportId, assignedToId }: { reportId: string; assignedToId: string }) =>
      reportApi.updateReport(reportId, {
        assignedToId,
        status: 'ASSIGNED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinatorReports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStatistics'] });
      setSelectedReportForAssign(null);
      setAssigneeId('');
    },
  });

  const stats = statsRes?.data;
  const reports = reportsRes?.data || [];
  const users = usersRes?.data || [];

  // Filter reports awaiting attention: unassigned or critical priority
  const attentionReports = reports.filter(
    r => (r.status === 'SUBMITTED' && !r.assignedToId) || r.priority === 'CRITICAL'
  );

  const handleRefresh = () => {
    refetchStats();
    refetchReports();
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForAssign || !assigneeId) return;
    assignMutation.mutate({
      reportId: selectedReportForAssign.id,
      assignedToId: assigneeId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Regional Dispatch & Triage Command
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Field Operations Triage — {user?.fullName || 'Coordinator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Oversee incoming incident reports across municipal water points and electrical distribution.
              Assign pending faults to field technicians and monitor workflow resolution milestones.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Link to="/workflow">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<GitPullRequest className="w-4 h-4" />}
                className="shadow-sm font-semibold"
              >
                Coordinator Board
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 KPI Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : statsError ? (
        <ErrorState
          title="Could not load coordinator statistics"
          message="Server statistics telemetry could not be retrieved."
          onRetry={refetchStats}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <StatCard
            title="Total Reports"
            value={stats?.totalReports ?? 0}
            icon={ClipboardList}
            color="blue"
            subtitle="All Municipal Reports"
          />
          <StatCard
            title="Awaiting Triage"
            value={stats?.awaitingAssignment ?? 0}
            icon={AlertTriangle}
            color="amber"
            badge={stats?.awaitingAssignment ? 'Action Needed' : undefined}
            subtitle="Unassigned Reports"
          />
          <StatCard
            title="Assigned"
            value={stats?.assigned ?? 0}
            icon={UserCheck}
            color="teal"
            subtitle="Dispatched to Technicians"
          />
          <StatCard
            title="In Progress"
            value={stats?.inProgress ?? 0}
            icon={Clock}
            color="blue"
            subtitle="Under Active Repair"
          />
          <StatCard
            title="Resolved"
            value={stats?.resolved ?? 0}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Completed & Verified"
          />
          <StatCard
            title="High / Critical"
            value={stats?.highPriority ?? 0}
            icon={Flame}
            color="rose"
            subtitle="Severe Safety & Outage"
          />
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Queue & Recent Incoming (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reports Requiring Attention (Priority Queue) */}
          {attentionReports.length > 0 && (
            <div className="bg-amber-50/40 rounded-2xl border border-amber-200/80 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Requires Immediate Attention ({attentionReports.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unassigned submissions or critical infrastructure incidents
                    </p>
                  </div>
                </div>

                <Link to="/workflow">
                  <Button variant="outline" size="xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Board
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attentionReports.slice(0, 4).map(report => (
                  <div
                    key={report.id}
                    className="bg-white rounded-xl p-3.5 border border-amber-200/60 shadow-xs space-y-2 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <PriorityBadge priority={report.priority} size="sm" />
                      <StatusBadge status={report.status} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {report.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {report.location}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 truncate">
                        By {report.createdBy?.fullName || 'Technician'}
                      </span>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setSelectedReportForAssign(report)}
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Incoming Reports Stream */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  Recent Incoming Reports Stream
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive live feed of incident reports from all field technicians
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, landmark..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
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
                  description="No reports match your search query."
                  actionLabel="Clear Search"
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
                        className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors block truncate"
                      >
                        {report.title}
                      </Link>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {report.location}
                        </span>
                        <span>
                          Filer: <strong className="text-slate-700">{report.createdBy?.fullName}</strong>
                        </span>
                        {report.assignedTo ? (
                          <span className="text-teal-700 font-medium">
                            Assigned: {report.assignedTo.fullName}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold">Unassigned</span>
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
                      {!report.assignedToId && (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => setSelectedReportForAssign(report)}
                        >
                          Assign
                        </Button>
                      )}
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="outline" size="xs">
                          Inspect
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown & Quick Actions (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Priority Distribution Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Incident Severity Matrix
              </h3>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Critical Priority',
                  count: stats?.priorityBreakdown?.CRITICAL ?? 0,
                  color: 'bg-rose-500',
                  badge: 'text-rose-700 bg-rose-50',
                },
                {
                  label: 'High Priority',
                  count: stats?.priorityBreakdown?.HIGH ?? 0,
                  color: 'bg-orange-500',
                  badge: 'text-orange-700 bg-orange-50',
                },
                {
                  label: 'Medium Priority',
                  count: stats?.priorityBreakdown?.MEDIUM ?? 0,
                  color: 'bg-blue-500',
                  badge: 'text-blue-700 bg-blue-50',
                },
                {
                  label: 'Low Priority',
                  count: stats?.priorityBreakdown?.LOW ?? 0,
                  color: 'bg-slate-400',
                  badge: 'text-slate-700 bg-slate-100',
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

          {/* Quick Access to Management Modules */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Management Modules
            </h3>
            <div className="space-y-2">
              <Link
                to="/workflow"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <GitPullRequest className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                      Coordinator Kanban Board
                    </p>
                    <p className="text-[11px] text-slate-400">Drag & triage reports by status</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/users"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Team & Field Workers
                    </p>
                    <p className="text-[11px] text-slate-400">View roster & availability</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal Dialog */}
      {selectedReportForAssign && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReportForAssign(null)}
          title="Assign Incident Report"
          description={`Select a field technician or coordinator for: "${selectedReportForAssign.title}"`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReportForAssign(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAssignSubmit}
                isLoading={assignMutation.isPending}
                disabled={!assigneeId}
              >
                Confirm Assignment
              </Button>
            </>
          }
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Category:</span>
                <CategoryBadge category={selectedReportForAssign.category} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Priority:</span>
                <PriorityBadge priority={selectedReportForAssign.priority} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Location:</span>
                <span className="text-slate-600">{selectedReportForAssign.location}</span>
              </div>
            </div>

            <Select
              label="Select Assignee"
              required
              placeholder="Choose a technician or coordinator..."
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              options={users.map(u => ({
                label: `${u.fullName} (${u.role})`,
                value: u.id,
              }))}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
