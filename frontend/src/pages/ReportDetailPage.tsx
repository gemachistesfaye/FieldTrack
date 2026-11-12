import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WorkflowPill, SyncPill, PriorityPill } from '../components/common/StatusPill';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation & quick status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports List
        </Link>

        <div className="flex items-center gap-2">
          <SyncPill status="SYNCHRONIZED" />
          <WorkflowPill status="IN_PROGRESS" />
          <PriorityPill priority="CRITICAL" />
        </div>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">
            Report Reference #{id || 'rep-001'}
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Water Point 4B Borehole Pump Mechanical Failure
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Kibera District Sector 3 (-1.312000, 36.784000)
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Created: Nov 12, 2026, 14:30 UTC
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Reported by: Amina Osei
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Incident Description
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
              Main submersible pump bearing seized during peak morning pumping schedule, resulting
              in an abrupt operational stoppage. Pressure gauges spiked momentarily to 6.2 bar
              before the thermal overload trip cut motor power. Approximately 1,400 households
              currently without primary access. Replacement 5.5kW bearing kit and impeller shaft
              seals requested.
            </div>
          </div>

          {/* Workflow & Assignment Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assigned Coordinator
              </h5>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-xs">
                  MV
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Marcus Vance</p>
                  <p className="text-xs text-slate-500">Regional Infrastructure Coordinator</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Workflow Actions
              </h5>
              <div className="flex items-center gap-2 pt-1">
                <select className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700">
                  <option value="IN_PROGRESS">Status: In Progress</option>
                  <option value="ASSIGNED">Status: Assigned</option>
                  <option value="RESOLVED">Status: Resolved</option>
                  <option value="REJECTED">Status: Rejected</option>
                </select>
                <Button variant="primary" size="sm" leftIcon={<Send className="w-3 h-3" />}>
                  Update
                </Button>
              </div>
            </div>
          </div>

          {/* Activity History Timeline */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Activity History & Audit Trail
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">
                    Status changed to In Progress
                  </span>
                  <span className="text-slate-400"> • Nov 12, 16:15</span>
                  <p className="text-slate-500">
                    Technician dispatched with spare bearing assembly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Assigned to Marcus Vance</span>
                  <span className="text-slate-400"> • Nov 12, 15:00</span>
                  <p className="text-slate-500">Assigned for emergency coordinator dispatch.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Incident Reported</span>
                  <span className="text-slate-400"> • Nov 12, 14:30</span>
                  <p className="text-slate-500">
                    Captured offline and synchronized to central database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
