import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  MapPin,
  Eye,
  Calendar,
} from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { reportApi } from '../services/reportApi';
import { ReportDTO, ReportCategory, WorkflowStatus } from '../types/report';
import { CATEGORY_DEFINITIONS } from '../components/common/CategoryGrid';
import { CreateReportModal } from '../components/common/CreateReportModal';

// High-fidelity fallback reports in case backend is offline or empty
const FALLBACK_REPORTS: ReportDTO[] = [
  {
    id: 'rep-001',
    title: 'Water Point 4B Borehole Pump Mechanical Failure',
    description:
      'Main submersible pump bearing seized during peak morning pumping schedule, resulting in an abrupt operational stoppage. Pressure gauges spiked momentarily to 6.2 bar before thermal overload trip cut motor power.',
    category: 'WATER',
    location: 'Kibera District Sector 3',
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
  },
  {
    id: 'rep-002',
    title: 'Substation Feeder Cable Insulation Deterioration',
    description:
      'High-voltage distribution feeder cable showing severe outer jacket degradation and insulation breakdown near switchgear busbar 2. Urgent thermal scan recommended.',
    category: 'ELECTRICAL',
    location: 'North Substation Pumping Station',
    latitude: -1.285,
    longitude: 36.812,
    priority: 'HIGH',
    status: 'ASSIGNED',
    syncStatus: 'SYNCHRONIZED',
    createdById: 'usr-3',
    createdBy: {
      id: 'usr-3',
      fullName: 'John Doe',
      email: 'john.doe@fieldsync.local',
      role: 'FIELD_WORKER',
    },
    assignedToId: 'usr-2',
    assignedTo: {
      id: 'usr-2',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@fieldsync.local',
      role: 'COORDINATOR',
    },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'rep-003',
    title: 'Distribution Valve Flange Leakage at Junction 7',
    description:
      'Gasket degradation resulting in continuous non-revenue water loss at approximately 45 liters per minute across eastern distribution artery.',
    category: 'INFRASTRUCTURE',
    location: 'East Ridge Distribution Junction 7',
    latitude: -1.298,
    longitude: 36.834,
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    syncStatus: 'PENDING',
    createdById: 'usr-1',
    createdBy: {
      id: 'usr-1',
      fullName: 'Amina Osei',
      email: 'amina.osei@fieldsync.local',
      role: 'FIELD_WORKER',
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'rep-004',
    title: 'Excavator Hydraulic Ram Fluid Leakage & Pressure Loss',
    description:
      'Cylinder seal failure on primary boom hydraulic ram causing pressure loss and inability to maintain trench shoring operations.',
    category: 'EQUIPMENT',
    location: 'West Bypass Trenching Zone',
    latitude: -1.305,
    longitude: 36.791,
    priority: 'HIGH',
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
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'rep-005',
    title: 'Corroded Trench Shoring Safety Hazard',
    description:
      'Support plates along Sector 4 drainage corridor exhibit structural oxidation posing collapse risk to maintenance crews.',
    category: 'SAFETY',
    location: 'Sector 4 Storm Drainage Corridor',
    latitude: -1.319,
    longitude: 36.802,
    priority: 'CRITICAL',
    status: 'SUBMITTED',
    syncStatus: 'SYNCHRONIZED',
    createdById: 'usr-3',
    createdBy: {
      id: 'usr-3',
      fullName: 'John Doe',
      email: 'john.doe@fieldsync.local',
      role: 'FIELD_WORKER',
    },
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export const ReportsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Query live reports with search & filter params
  const { data: reportsResponse, isLoading } = useQuery({
    queryKey: ['reports', selectedCategory, selectedStatus, searchTerm],
    queryFn: () =>
      reportApi.getReports({
        category: selectedCategory !== 'ALL' ? (selectedCategory as ReportCategory) : undefined,
        status: selectedStatus !== 'ALL' ? (selectedStatus as WorkflowStatus) : undefined,
        search: searchTerm.trim() || undefined,
      }),
  });

  // Blend API reports with fallback mock data if API is offline or returns empty
  const serverReports = reportsResponse?.data;
  const reports: ReportDTO[] =
    serverReports && serverReports.length > 0
      ? serverReports
      : FALLBACK_REPORTS.filter(item => {
          const matchesCategory =
            selectedCategory === 'ALL' || item.category === selectedCategory;
          const matchesStatus =
            selectedStatus === 'ALL' || item.status === selectedStatus;
          const matchesSearch =
            !searchTerm.trim() ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.createdBy?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesStatus && matchesSearch;
        });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Field Incident Reports
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {reports.length} {reports.length === 1 ? 'incident' : 'incidents'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, and monitor infrastructure issues reported across all sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="industrial"
            size="md"
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto font-bold shadow-xs text-slate-950"
            leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
          >
            New Incident Report
          </Button>
        </div>
      </div>

      {/* Domain Category Filter Pills (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {CATEGORY_DEFINITIONS.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.category;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCategory(cat.category)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardContent className="p-3.5 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, location, or reporter..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-2xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Content Stream */}
      {isLoading ? (
        <LoadingState message="Querying field incident telemetry..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No incident reports found"
          description="Try broadening your search term or category filters, or log a new municipal incident."
          actionLabel="Log New Incident"
          onAction={() => window.location.assign('/reports/new')}
        />
      ) : (
        <>
          {/* Mobile Card View (Strictly following Screen 2 & Screen 4 of UX reference 6030449798499995434_121.jpg) */}
          <div className="space-y-3 sm:hidden">
            {reports.map(report => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="block group"
              >
                <Card hoverable className="border-slate-200/90 shadow-2xs active:scale-[0.99] transition-transform">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={report.category} size="sm" />
                        <PriorityBadge priority={report.priority} size="sm" />
                      </div>
                      <StatusBadge status={report.status} size="sm" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                        <span>Details</span>
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden sm:block border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Report Title / Sector</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Priority</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Reporter</th>
                    <th className="px-4 py-3.5">Logged Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map(report => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="px-5 py-4 max-w-xs md:max-w-md">
                        <Link
                          to={`/reports/${report.id}`}
                          className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors block line-clamp-1"
                        >
                          {report.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{report.location}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <CategoryBadge category={report.category} size="sm" />
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <PriorityBadge priority={report.priority} size="sm" />
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={report.status} size="sm" />
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                        {report.createdBy?.fullName || 'Field Technician'}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link to={`/reports/${report.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-bold text-slate-700 hover:text-slate-900 border-slate-200"
                            leftIcon={<Eye className="w-3.5 h-3.5 text-slate-400" />}
                          >
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Quick Create Report Modal */}
      <CreateReportModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        }}
      />
    </div>
  );
};
