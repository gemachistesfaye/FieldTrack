import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  RefreshCw,
  ArrowRight,
  Database,
  Shield,
  Layers,
  MapPin,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WorkflowPill, SyncPill, PriorityPill } from '../components/common/StatusPill';
import { Report } from '../types';

// Mock representative report records to demonstrate the SaaS design system
const sampleReports: Report[] = [
  {
    id: 'rep-001',
    title: 'Water Point 4B Borehole Pump Mechanical Failure',
    description: 'Main pump bearing seized, resulting in complete service stoppage for Sector 3.',
    category: 'WATER_POINT',
    priority: 'CRITICAL',
    workflowStatus: 'IN_PROGRESS',
    syncStatus: 'SYNCHRONIZED',
    location: { name: 'Kibera District Sector 3', latitude: -1.312, longitude: 36.784 },
    createdById: 'usr-1',
    createdByName: 'Amina Osei',
    assignedToId: 'usr-2',
    assignedToName: 'Marcus Vance',
    createdAt: '2026-11-12T14:30:00Z',
    updatedAt: '2026-11-12T16:15:00Z',
  },
  {
    id: 'rep-002',
    title: 'Substation Feeder Cable Insulation Deterioration',
    description: 'High heat damage observed on terminal blocks during weekly inspection.',
    category: 'EQUIPMENT',
    priority: 'HIGH',
    workflowStatus: 'ASSIGNED',
    syncStatus: 'SYNCHRONIZED',
    location: { name: 'North Pumping Station', latitude: -1.285, longitude: 36.821 },
    createdById: 'usr-3',
    createdByName: 'John Doe',
    assignedToId: 'usr-2',
    assignedToName: 'Marcus Vance',
    createdAt: '2026-11-12T11:20:00Z',
    updatedAt: '2026-11-12T13:00:00Z',
  },
  {
    id: 'rep-003',
    title: 'Local Valve Leakage at Distribution Junction 7',
    description: 'Secondary line showing persistent low-pressure seep, needs replacement gasket.',
    category: 'MAINTENANCE_REQUEST',
    priority: 'MEDIUM',
    workflowStatus: 'SUBMITTED',
    syncStatus: 'PENDING',
    location: { name: 'East Ridge Junction 7' },
    createdById: 'usr-1',
    createdByName: 'Amina Osei',
    createdAt: '2026-11-12T17:45:00Z',
    updatedAt: '2026-11-12T17:45:00Z',
  },
  {
    id: 'rep-004',
    title: 'Pressure Sensor Recalibration Required',
    description: 'Transducer telemetry deviates by +18% from physical mechanical gauge.',
    category: 'SERVICE_INTERRUPTION',
    priority: 'LOW',
    workflowStatus: 'RESOLVED',
    syncStatus: 'SYNCHRONIZED',
    location: { name: 'Treatment Facility Tank A' },
    createdById: 'usr-4',
    createdByName: 'Sarah Jenkins',
    assignedToId: 'usr-2',
    assignedToName: 'Marcus Vance',
    createdAt: '2026-11-11T09:00:00Z',
    updatedAt: '2026-11-12T10:00:00Z',
  },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner: Welcome & Quick Action */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Offline-First Ready Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              FieldSync Management Command
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering field technicians to capture critical infrastructure incidents anytime,
              even without connectivity. Data persists locally in IndexedDB and reconciles
              seamlessly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/reports/new">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-md"
              >
                Create Incident Report
              </Button>
            </Link>
            <Link to="/sync">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<RefreshCw className="w-4 h-4 text-slate-300" />}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Sync Status
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Incident Reports
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">128</h3>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <span>+12 today</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pending Local Sync
              </p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">1</h3>
              <p className="text-xs text-slate-500 mt-1">Dexie.js offline queue</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Active Investigations
              </p>
              <h3 className="text-2xl font-bold text-teal-700 mt-1">14</h3>
              <p className="text-xs text-slate-500 mt-1">Assigned to coordinators</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Critical Priority
              </p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">3</h3>
              <p className="text-xs text-rose-600 mt-1 font-medium">Requires immediate action</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Recent Reports & Architecture Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle>Recent Field Incidents</CardTitle>
                <CardDescription>
                  Live incoming stream from field technicians and local queue
                </CardDescription>
              </div>
              <Link to="/reports">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View All
                </Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Incident / Location</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sync</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {sampleReports.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {report.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{report.location.name}</span>
                          <span className="text-slate-300">•</span>
                          <span>{report.createdByName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <PriorityPill priority={report.priority} />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <WorkflowPill status={report.workflowStatus} />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <SyncPill status={report.syncStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Link to={`/reports/${report.id}`}>
                          <Button variant="outline" size="sm">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Architecture & Foundation Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Architecture Blueprint</CardTitle>
              <CardDescription>Prepared module contracts and infrastructure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-md bg-teal-50 text-teal-600 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-semibold text-slate-900">Offline-First Engine</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Dexie.js IndexedDB client storage with idempotency UUIDs and auto-retry sync
                    logic.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-md bg-blue-50 text-blue-600 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-semibold text-slate-900">Role-Based Access Control</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Granular permission boundaries for Field Workers, Coordinators, and
                    Administrators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-semibold text-slate-900">PostgreSQL & Prisma Core</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Type-safe database layer with audit trails, activity logging, and versioning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Support / Field Guide */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-5 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Offline Capability
              </div>
              <h4 className="font-semibold text-sm">Working without cellular signal?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can create reports, record GPS markers, and attach notes. All updates are
                buffered locally and push automatically when connectivity is restored.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
