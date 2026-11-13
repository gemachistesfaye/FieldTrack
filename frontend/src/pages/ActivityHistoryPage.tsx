import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/common/Card';
import { History, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivityHistoryPage: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      reportId: 'rep-001',
      action: 'Status updated from ASSIGNED to IN_PROGRESS',
      reportTitle: 'Water Point 4B Borehole Pump Mechanical Failure',
      user: 'Marcus Vance',
      role: 'COORDINATOR',
      time: '12 minutes ago',
      notes: 'Dispatched emergency mobile maintenance unit with 5.5kW bearing kit.',
    },
    {
      id: 'act-2',
      reportId: 'rep-002',
      action: 'Coordinator assigned to report',
      reportTitle: 'Substation Feeder Cable Insulation Deterioration',
      user: 'Marcus Vance',
      role: 'COORDINATOR',
      time: '2 hours ago',
      notes: 'Assigned for electrical substation field survey.',
    },
    {
      id: 'act-3',
      reportId: 'rep-003',
      action: 'Incident created from offline queue',
      reportTitle: 'Local Valve Leakage at Distribution Junction 7',
      user: 'Amina Osei',
      role: 'FIELD_WORKER',
      time: '3 hours ago',
      notes: 'Captured offline via Dexie.js IndexedDB storage.',
    },
    {
      id: 'act-4',
      reportId: 'rep-004',
      action: 'Status updated to RESOLVED',
      reportTitle: 'Secondary Transformer High-Temperature Alarm',
      user: 'Elena Rostova',
      role: 'ADMIN',
      time: '6 hours ago',
      notes: 'Cooling manifold cleared and telemetry sensor calibrated.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System Audit & Activity Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Immutable audit log tracking all status changes, assignments, and offline synchronization operations.
        </p>
      </div>

      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              <span>Operational Transactions</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Chronological ledger of operational events
            </CardDescription>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {activities.length} Recorded
          </span>
        </CardHeader>

        <div className="p-5 divide-y divide-slate-100">
          {activities.map(act => (
            <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-900 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <History className="w-4 h-4 text-amber-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{act.action}</p>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {act.time}
                  </span>
                </div>

                <Link
                  to={`/reports/${act.reportId}`}
                  className="text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors mt-0.5 block"
                >
                  {act.reportTitle}
                </Link>

                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{act.notes}</p>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-700 font-semibold">{act.user}</span>
                  </div>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                    {act.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
