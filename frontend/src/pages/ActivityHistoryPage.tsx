import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { History, User } from 'lucide-react';

export const ActivityHistoryPage: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      action: 'Status updated from ASSIGNED to IN_PROGRESS',
      reportTitle: 'Water Point 4B Borehole Pump Mechanical Failure',
      user: 'Marcus Vance',
      role: 'COORDINATOR',
      time: '12 minutes ago',
      notes: 'Dispatched emergency mobile maintenance unit with 5.5kW bearing kit.',
    },
    {
      id: 'act-2',
      action: 'Coordinator assigned to report',
      reportTitle: 'Substation Feeder Cable Insulation Deterioration',
      user: 'Marcus Vance',
      role: 'COORDINATOR',
      time: '2 hours ago',
      notes: 'Assigned for electrical substation field survey.',
    },
    {
      id: 'act-3',
      action: 'Incident created from offline queue',
      reportTitle: 'Local Valve Leakage at Distribution Junction 7',
      user: 'Amina Osei',
      role: 'FIELD_WORKER',
      time: '3 hours ago',
      notes: 'Captured offline via Dexie.js IndexedDB storage.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Audit & Activity Trail
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Immutable audit log tracking all status changes, assignments, and synchronization
          operations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Transactions</CardTitle>
          <CardDescription>Full chronologic sequence of operational events</CardDescription>
        </CardHeader>

        <div className="p-6 divide-y divide-slate-100">
          {activities.map(act => (
            <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                <History className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-slate-900">{act.action}</p>
                  <span className="text-xs text-slate-400">{act.time}</span>
                </div>
                <p className="text-xs font-medium text-teal-700 mt-0.5">{act.reportTitle}</p>
                <p className="text-xs text-slate-600 mt-1">{act.notes}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>
                    {act.user} ({act.role})
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
