import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '../components/common/Card';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { Button } from '../components/common/Button';
import { MapPin, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkflowStatus, ReportDTO } from '../types/report';
import { reportApi } from '../services/reportApi';
import { CardSkeleton } from '../components/common/Skeleton';

export const WorkflowManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const { data: reportsRes, isLoading, refetch } = useQuery({
    queryKey: ['workflowReports'],
    queryFn: () => reportApi.getReports({ limit: 100 }),
  });

  const reports: ReportDTO[] = reportsRes?.data || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: WorkflowStatus }) =>
      reportApi.updateReport(id, { status: nextStatus }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['workflowReports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStatistics'] });
      setStatusNotice(`Report advanced to ${vars.nextStatus.replace('_', ' ')}`);
      setTimeout(() => setStatusNotice(null), 3000);
    },
  });

  const columns: { id: WorkflowStatus; title: string; count: number }[] = [
    {
      id: 'SUBMITTED',
      title: 'Triage / Queue',
      count: reports.filter(c => c.status === 'SUBMITTED').length,
    },
    {
      id: 'ASSIGNED',
      title: 'Assigned',
      count: reports.filter(c => c.status === 'ASSIGNED').length,
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      count: reports.filter(c => c.status === 'IN_PROGRESS').length,
    },
    {
      id: 'RESOLVED',
      title: 'Resolved',
      count: reports.filter(c => c.status === 'RESOLVED').length,
    },
  ];

  const handleAdvanceStatus = (id: string, currentStatus: WorkflowStatus) => {
    let nextStatus: WorkflowStatus = 'SUBMITTED';
    if (currentStatus === 'SUBMITTED') nextStatus = 'ASSIGNED';
    else if (currentStatus === 'ASSIGNED') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else return;

    updateMutation.mutate({ id, nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Coordinator Workflow Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live Kanban board tracking incident reports across operational stages ({reports.length} total reports).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shrink-0 self-start sm:self-auto"
        >
          Refresh Board
        </Button>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        /* Workflow Kanban Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map(col => {
            const colCards = reports.filter(c => c.status === col.id);

            return (
              <div
                key={col.id}
                className="space-y-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 min-h-[400px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    {col.count}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5">
                  {colCards.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-white/50">
                      <p className="text-xs text-slate-400 font-medium">No incidents in this stage</p>
                    </div>
                  ) : (
                    colCards.map(item => (
                      <Card
                        key={item.id}
                        className="border-slate-200/90 shadow-2xs hover:shadow-xs transition-all bg-white"
                      >
                        <CardContent className="p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <CategoryBadge category={item.category} size="sm" />
                            <PriorityBadge priority={item.priority} size="sm" />
                          </div>

                          <Link
                            to={`/reports/${item.id}`}
                            className="block text-sm font-bold text-slate-900 hover:text-slate-700 leading-snug line-clamp-2"
                          >
                            {item.title}
                          </Link>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-600 truncate">
                              {item.assignedTo?.fullName || 'Unassigned'}
                            </span>

                            {col.id !== 'RESOLVED' && (
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => handleAdvanceStatus(item.id, item.status)}
                                rightIcon={<ArrowRight className="w-3 h-3" />}
                                className="text-[11px] font-bold px-2 py-1"
                              >
                                Advance
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
