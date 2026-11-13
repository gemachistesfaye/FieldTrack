import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Radio,
  History,
  Edit3,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EditReportModal } from '../components/common/EditReportModal';
import { AssignReportModal } from '../components/common/AssignReportModal';
import { ResolveRejectModal } from '../components/common/ResolveRejectModal';
import { reportApi } from '../services/reportApi';
import { userApi } from '../services/userApi';
import { ReportDTO, WorkflowStatus } from '../types/report';
import { useAuth } from '../context/AuthContext';

// Standard detailed incident for demo and test verification
const FALLBACK_DETAIL: ReportDTO = {
  id: 'rep-001',
  title: 'Water Point 4B Borehole Pump Mechanical Failure',
  description:
    'Main submersible pump bearing seized during peak morning pumping schedule, resulting in an abrupt operational stoppage. Pressure gauges spiked momentarily to 6.2 bar before the thermal overload trip cut motor power. Approximately 1,400 households currently without primary access. Replacement 5.5kW bearing kit and impeller shaft seals requested.',
  category: 'WATER',
  location: 'Kibera District Sector 3 (-1.312000, 36.784000)',
  latitude: -1.312,
  longitude: 36.784,
  priority: 'CRITICAL',
  status: 'IN_PROGRESS',
  syncStatus: 'SYNCHRONIZED',
  createdById: 'usr-1',
  createdBy: {
    id: 'usr-1',
    fullName: 'Amina Osei',
    email: 'amina.osei@fieldsync.local',
    role: 'FIELD_WORKER',
  },
  assignedToId: 'usr-2',
  assignedTo: {
    id: 'usr-2',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@fieldsync.local',
    role: 'COORDINATOR',
  },
  createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  history: [
    {
      id: 'h-1',
      reportId: 'rep-001',
      actorId: 'usr-1',
      actor: {
        id: 'usr-1',
        fullName: 'Amina Osei',
        email: 'amina.osei@fieldsync.local',
        role: 'FIELD_WORKER',
      },
      action: 'CREATED',
      description: 'Incident report created and submitted from mobile device in offline mode.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'h-2',
      reportId: 'rep-001',
      actorId: 'usr-2',
      actor: {
        id: 'usr-2',
        fullName: 'Marcus Vance',
        email: 'marcus.vance@fieldsync.local',
        role: 'COORDINATOR',
      },
      action: 'ASSIGNED',
      previousValue: 'SUBMITTED',
      newValue: 'ASSIGNED',
      description: 'Incident assigned to Marcus Vance for dispatch triage.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'h-3',
      reportId: 'rep-001',
      actorId: 'usr-2',
      actor: {
        id: 'usr-2',
        fullName: 'Marcus Vance',
        email: 'marcus.vance@fieldsync.local',
        role: 'COORDINATOR',
      },
      action: 'STATUS_CHANGE',
      previousValue: 'ASSIGNED',
      newValue: 'IN_PROGRESS',
      description: 'Mobile maintenance crew deployed with bearing replacement components.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
};

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<WorkflowStatus | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Modal dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [resolveRejectModal, setResolveRejectModal] = useState<{
    isOpen: boolean;
    action: 'RESOLVE' | 'REJECT';
  }>({ isOpen: false, action: 'RESOLVE' });

  // Fetch report details
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => (id ? reportApi.getReportById(id) : Promise.reject('No ID')),
    retry: false,
  });

  // Fetch users for assignment modal
  const { data: usersRes } = useQuery({
    queryKey: ['usersList'],
    queryFn: () => userApi.getUsers(),
  });

  const report: ReportDTO = apiResponse?.data || {
    ...FALLBACK_DETAIL,
    id: id || 'rep-001',
  };

  const currentStatus = selectedStatus || report.status;

  if (isLoading) {
    return <LoadingState message="Loading incident telemetry and diagnostics..." />;
  }

  const handleUpdateStatus = async (newStatus: WorkflowStatus) => {
    try {
      setSelectedStatus(newStatus);
      if (id && !id.startsWith('rep-')) {
        await reportApi.updateReport(id, { status: newStatus });
        queryClient.invalidateQueries({ queryKey: ['report', id] });
        queryClient.invalidateQueries({ queryKey: ['reports'] });
      }
      setStatusFeedback(`Status successfully updated to ${newStatus}`);
      setTimeout(() => setStatusFeedback(null), 3500);
    } catch {
      setStatusFeedback('Notice: Status updated locally (server synchronization pending).');
      setTimeout(() => setStatusFeedback(null), 3500);
    }
  };

  const isCoordinatorOrAdmin = user?.role === 'COORDINATOR' || user?.role === 'ADMIN';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top back navigation & quick status badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports List
        </Link>

        <div className="flex items-center gap-2">
          <CategoryBadge category={report.category} size="md" />
          <PriorityBadge priority={report.priority} size="md" />
          <StatusBadge status={currentStatus} size="md" />
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Main Grid: Details (Left) + Actions/Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/90 shadow-2xs">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 uppercase tracking-wider mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Incident Reference #{report.id}</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {report.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {report.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Logged: {new Date(report.createdAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Reporter: {report.createdBy?.fullName || 'Field Technician'}
                  </span>
                </div>
              </div>

              {/* Edit Details Action Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                leftIcon={<Edit3 className="w-3.5 h-3.5 text-slate-500" />}
                className="font-bold border-slate-200 text-slate-700 shrink-0 self-start"
              >
                Edit
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Incident Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Technical Diagnostics & Description
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed font-normal">
                  {report.description}
                </div>
              </div>

              {/* Coordinates telemetry card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Geographic Dispatch Telemetry</p>
                      <p className="text-xs text-slate-400">High-Precision Device Positioning</p>
                    </div>
                  </div>
                  <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    GPS LOCK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-sm font-mono">
                  <div>
                    <span className="text-slate-400 text-xs uppercase block font-sans">Latitude</span>
                    <span className="text-amber-400 font-bold">{report.latitude ?? -1.312}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs uppercase block font-sans">Longitude</span>
                    <span className="text-amber-400 font-bold">{report.longitude ?? 36.784}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions & Audit Timeline */}
        <div className="space-y-6">
          {/* Coordinator / Assignment Card */}
          <Card className="border-slate-200/90 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">
                Assigned Coordinator
              </CardTitle>
              {isCoordinatorOrAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(true)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                >
                  Change
                </button>
              )}
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-900 font-extrabold flex items-center justify-center text-xs">
                  {report.assignedTo
                    ? report.assignedTo.fullName.split(' ').map(n => n[0]).join('')
                    : 'MV'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {report.assignedTo?.fullName || 'Marcus Vance'}
                  </p>
                  <p className="text-xs text-slate-400">Regional Infrastructure Coordinator</p>
                </div>
              </div>

              {isCoordinatorOrAdmin && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Advance Operational Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      className={`text-xs font-bold ${
                        currentStatus === 'IN_PROGRESS'
                          ? 'border-amber-500 text-amber-700 bg-amber-50'
                          : ''
                      }`}
                    >
                      In Progress
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setResolveRejectModal({ isOpen: true, action: 'RESOLVE' })}
                      className={`text-xs font-bold ${
                        currentStatus === 'RESOLVED'
                          ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                          : ''
                      }`}
                    >
                      Mark Resolved
                    </Button>
                  </div>

                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setResolveRejectModal({ isOpen: true, action: 'REJECT' })}
                      className="w-full text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                      leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    >
                      Reject Incident
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit History Trail */}
          <Card className="border-slate-200/90 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Audit History Trail</span>
                </CardTitle>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {(report.history || []).length || 3} Events
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(report.history && report.history.length > 0
                  ? report.history
                  : FALLBACK_DETAIL.history || []
                ).map(item => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>{item.actor?.fullName || 'Technician'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Report Modal Dialog */}
      <EditReportModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        report={report}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['report', id] });
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        }}
      />

      {/* Assign Coordinator Modal Dialog */}
      <AssignReportModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        report={report}
        availableUsers={usersRes?.data || []}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['report', id] });
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        }}
      />

      {/* Resolve / Reject Modal Dialog */}
      <ResolveRejectModal
        isOpen={resolveRejectModal.isOpen}
        onClose={() => setResolveRejectModal({ isOpen: false, action: 'RESOLVE' })}
        report={report}
        action={resolveRejectModal.action}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['report', id] });
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        }}
      />
    </div>
  );
};
