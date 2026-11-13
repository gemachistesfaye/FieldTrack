import React, { useState } from 'react';
import { Card, CardContent } from '../components/common/Card';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { Button } from '../components/common/Button';
import { Filter, Users, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkflowStatus, Priority, ReportCategory } from '../types/report';

interface KanbanCardItem {
  id: string;
  title: string;
  category: ReportCategory;
  priority: Priority;
  location: string;
  coordinator: string;
  status: WorkflowStatus;
}

const INITIAL_KANBAN_DATA: KanbanCardItem[] = [
  {
    id: 'rep-003',
    title: 'Distribution Valve Flange Leakage at Junction 7',
    category: 'INFRASTRUCTURE',
    priority: 'MEDIUM',
    location: 'East Ridge Junction 7',
    coordinator: 'Unassigned',
    status: 'SUBMITTED',
  },
  {
    id: 'rep-005',
    title: 'Corroded Trench Shoring Safety Hazard',
    category: 'SAFETY',
    priority: 'CRITICAL',
    location: 'Sector 4 Drainage Corridor',
    coordinator: 'Unassigned',
    status: 'SUBMITTED',
  },
  {
    id: 'rep-002',
    title: 'Substation Feeder Cable Insulation Deterioration',
    category: 'ELECTRICAL',
    priority: 'HIGH',
    location: 'North Substation Pumping Station',
    coordinator: 'Marcus Vance',
    status: 'ASSIGNED',
  },
  {
    id: 'rep-001',
    title: 'Water Point 4B Borehole Pump Mechanical Failure',
    category: 'WATER',
    priority: 'CRITICAL',
    location: 'Kibera District Sector 3',
    coordinator: 'Marcus Vance',
    status: 'IN_PROGRESS',
  },
  {
    id: 'rep-004',
    title: 'Excavator Hydraulic Ram Fluid Leakage & Pressure Loss',
    category: 'EQUIPMENT',
    priority: 'HIGH',
    location: 'West Bypass Trenching Zone',
    coordinator: 'Marcus Vance',
    status: 'IN_PROGRESS',
  },
  {
    id: 'rep-006',
    title: 'Transformer Oil Level Sensor Calibration Failure',
    category: 'ELECTRICAL',
    priority: 'LOW',
    location: 'Main Depot Yard',
    coordinator: 'Marcus Vance',
    status: 'RESOLVED',
  },
];

export const WorkflowManagementPage: React.FC = () => {
  const [cards, setCards] = useState<KanbanCardItem[]>(INITIAL_KANBAN_DATA);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const columns: { id: WorkflowStatus; title: string; count: number }[] = [
    {
      id: 'SUBMITTED',
      title: 'Triage / Queue',
      count: cards.filter(c => c.status === 'SUBMITTED').length,
    },
    {
      id: 'ASSIGNED',
      title: 'Assigned',
      count: cards.filter(c => c.status === 'ASSIGNED').length,
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      count: cards.filter(c => c.status === 'IN_PROGRESS').length,
    },
    {
      id: 'RESOLVED',
      title: 'Resolved',
      count: cards.filter(c => c.status === 'RESOLVED').length,
    },
  ];

  const handleAdvanceStatus = (id: string, currentStatus: WorkflowStatus) => {
    let nextStatus: WorkflowStatus = 'SUBMITTED';
    if (currentStatus === 'SUBMITTED') nextStatus = 'ASSIGNED';
    else if (currentStatus === 'ASSIGNED') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else return;

    setCards(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              coordinator:
                item.coordinator === 'Unassigned' ? 'Marcus Vance' : item.coordinator,
            }
          : item
      )
    );

    setStatusNotice(`Incident ${id.toUpperCase()} advanced to ${nextStatus.replace('_', ' ')}`);
    setTimeout(() => setStatusNotice(null), 3000);
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
            Review reported incidents, assign technicians, and advance operational resolution milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-slate-200 text-slate-700"
            leftIcon={<Filter className="w-3.5 h-3.5 text-slate-400" />}
          >
            Filter Sector
          </Button>
          <Button
            variant="industrial"
            size="sm"
            className="font-bold shadow-xs text-slate-950"
            leftIcon={<Users className="w-3.5 h-3.5 text-slate-950" />}
          >
            Assignee Matrix
          </Button>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Workflow Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colCards = cards.filter(c => c.status === col.id);

          return (
            <div
              key={col.id}
              className="space-y-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {col.count}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-2.5">
                {colCards.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 font-medium">
                    No incidents
                  </div>
                ) : (
                  colCards.map(item => (
                    <Card
                      key={item.id}
                      hoverable
                      className="border-slate-200/90 shadow-2xs bg-white"
                    >
                      <CardContent className="p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <CategoryBadge category={item.category} size="sm" />
                          <PriorityBadge priority={item.priority} size="sm" />
                        </div>

                        <Link
                          to={`/reports/${item.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-2 leading-snug block"
                        >
                          {item.title}
                        </Link>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">
                            {item.coordinator}
                          </span>

                          {col.id !== 'RESOLVED' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(item.id, item.status)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                              title="Advance to next workflow stage"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
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
    </div>
  );
};
