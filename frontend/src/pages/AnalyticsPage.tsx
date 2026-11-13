import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Clock, CheckCircle2, AlertOctagon, BarChart3, RefreshCw, Flame } from 'lucide-react';
import { reportApi } from '../services/reportApi';
import { Button } from '../components/common/Button';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const AnalyticsPage: React.FC = () => {
  const { data: statsRes, isLoading, refetch } = useQuery({
    queryKey: ['analyticsReportStats'],
    queryFn: () => reportApi.getReportStatistics(),
  });

  const stats = statsRes?.data;
  const total = stats?.totalReports || 0;
  const resolved = stats?.resolved || 0;
  const inProgress = stats?.inProgress || 0;
  const submitted = stats?.submitted || 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const priorities = [
    { label: 'Critical Severity', count: stats?.priorityBreakdown?.CRITICAL || 0, color: 'bg-slate-900' },
    { label: 'High Priority', count: stats?.priorityBreakdown?.HIGH || 0, color: 'bg-slate-700' },
    { label: 'Medium Priority', count: stats?.priorityBreakdown?.MEDIUM || 0, color: 'bg-slate-500' },
    { label: 'Low Severity', count: stats?.priorityBreakdown?.LOW || 0, color: 'bg-slate-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Operations & Service Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time incident telemetry, severity distributions, and SLA metrics from live database.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shrink-0 self-start sm:self-auto"
        >
          Refresh Data
        </Button>
      </div>

      {/* Top Telemetry KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Submitted Reports"
            value={total}
            subtitle={total === 0 ? 'No reports in system yet' : 'Lifetime registered submissions'}
            icon={BarChart3}
            color="slate"
          />

          <StatCard
            title="Resolution Rate (SLA)"
            value={`${resolutionRate}%`}
            subtitle={total === 0 ? 'Awaiting initial submissions' : `${resolved} of ${total} resolved`}
            icon={CheckCircle2}
            color="slate"
          />

          <StatCard
            title="Active In-Flight Issues"
            value={inProgress + submitted}
            subtitle={`${submitted} submitted, ${inProgress} in progress`}
            icon={Clock}
            color="slate"
          />
        </div>
      )}

      {/* Category Breakdown & Operations Cards */}
      {total === 0 ? (
        <Card className="border-slate-200/90 shadow-2xs p-12">
          <EmptyState
            icon={AlertOctagon}
            title="No Incident Data Yet"
            description="The database is clean with no reports submitted. When field technicians submit incident reports, priority severity distributions, response velocities, and resolution telemetry will automatically calculate here in real time."
            actionLabel="Submit First Incident"
            onAction={() => {
              window.location.href = '/reports/new';
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200/90 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Incident Severity Distribution
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Live distribution across priority thresholds
                </CardDescription>
              </div>
              <Flame className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {priorities.map(p => {
                const percentage = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={p.label}>
                    <div className="flex justify-between text-sm font-bold mb-1.5">
                      <span className="text-slate-800">{p.label}</span>
                      <span className="text-slate-500 font-mono text-xs">
                        {p.count} reports ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${p.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Workflow Distribution Matrix
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Resolution progress and technician dispatch status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {[
                { label: 'Submitted (Awaiting Review)', count: submitted },
                { label: 'Dispatched & In Progress', count: inProgress },
                { label: 'Resolved & Verified', count: resolved },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-sm"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Live database counter</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-base text-slate-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
