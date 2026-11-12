import React from 'react';
import { Card, CardContent } from '../components/common/Card';
import { PriorityPill } from '../components/common/StatusPill';
import { Button } from '../components/common/Button';
import { Filter, Users } from 'lucide-react';

export const WorkflowManagementPage: React.FC = () => {
  const columns = [
    { id: 'SUBMITTED', title: 'Submitted (Triage)', count: 3 },
    { id: 'ASSIGNED', title: 'Assigned', count: 4 },
    { id: 'IN_PROGRESS', title: 'In Progress', count: 6 },
    { id: 'RESOLVED', title: 'Resolved', count: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Coordinator Workflow Command
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review reported incidents, assign technicians, and advance resolution milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            Filter Sector
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
            Assignee Matrix
          </Button>
        </div>
      </div>

      {/* Workflow Kanban Columns Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {col.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-700 shadow-subtle">
                {col.count}
              </span>
            </div>

            <div className="space-y-2">
              <Card hoverable className="cursor-pointer">
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">REP-001</span>
                    <PriorityPill priority="CRITICAL" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                    Water Point 4B Borehole Pump Mechanical Failure
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Kibera Sector 3</span>
                    <span className="text-teal-600 font-medium">Marcus V.</span>
                  </div>
                </CardContent>
              </Card>

              <Card hoverable className="cursor-pointer">
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">REP-002</span>
                    <PriorityPill priority="HIGH" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                    Substation Feeder Cable Insulation Deterioration
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>North Station</span>
                    <span className="text-teal-600 font-medium">Marcus V.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
