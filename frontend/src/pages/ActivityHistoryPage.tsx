import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/common/Card';
import { History, User, Clock, FileText, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { reportApi } from '../services/reportApi';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';

export const ActivityHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: reportsRes, isLoading, refetch } = useQuery({
    queryKey: ['activityReports'],
    queryFn: () => reportApi.getReports({ limit: 50 }),
  });

  const reports = reportsRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            System Audit & Activity Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit ledger tracking all incident creations, status updates, and field technician dispatches.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shrink-0 self-start sm:self-auto"
        >
          Refresh Audit Log
        </Button>
      </div>

      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <span>Operational Transactions</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Chronological log of live field events
            </CardDescription>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {reports.length} Recorded Events
          </span>
        </CardHeader>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={History}
              title="No Activity Events Recorded"
              description="The database has been cleaned and has zero activity logs. As field technicians create reports and coordinators update statuses, an immutable audit trail will record each event here automatically."
              actionLabel="Submit Incident Report"
              onAction={() => navigate('/reports/new')}
            />
          </div>
        ) : (
          <div className="p-5 divide-y divide-slate-100">
            {reports.map(rep => (
              <div key={rep.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Report registered: <span className="font-semibold">{rep.title}</span>
                    </p>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(rep.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 my-1.5 flex-wrap">
                    <CategoryBadge category={rep.category} size="sm" />
                    <StatusBadge status={rep.status} size="sm" />
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {rep.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 font-semibold">
                        {rep.createdBy?.fullName || 'Field Technician'}
                      </span>
                    </div>
                    <span>•</span>
                    <Link
                      to={`/reports/${rep.id}`}
                      className="text-slate-800 font-bold hover:underline"
                    >
                      View Report Audit →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
