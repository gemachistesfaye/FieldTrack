import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WorkflowPill, SyncPill, PriorityPill } from '../components/common/StatusPill';

export const ReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Field Incident Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, and monitor infrastructure issues reported across all sectors.
          </p>
        </div>
        <Link to="/reports/new">
          <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />}>
            New Incident Report
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by title, location, or reporter..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white placeholder-slate-400"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="WATER_POINT">Water Point</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="SERVICE_INTERRUPTION">Service Interruption</option>
                <option value="SAFETY_CONCERN">Safety Concern</option>
                <option value="MAINTENANCE_REQUEST">Maintenance Request</option>
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
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
          </div>
        </CardContent>
      </Card>

      {/* Reports Directory Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3">Report ID / Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sync</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">
                    Water Point 4B Borehole Pump Mechanical Failure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Kibera District Sector 3</span>
                    <span className="text-slate-300">•</span>
                    <span>Reported by Amina Osei</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">Water Point</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PriorityPill priority="CRITICAL" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <WorkflowPill status="IN_PROGRESS" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <SyncPill status="SYNCHRONIZED" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">Nov 12, 2026</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <Link to="/reports/rep-001">
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">
                    Substation Feeder Cable Insulation Deterioration
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>North Pumping Station</span>
                    <span className="text-slate-300">•</span>
                    <span>Reported by John Doe</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">Equipment</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PriorityPill priority="HIGH" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <WorkflowPill status="ASSIGNED" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <SyncPill status="SYNCHRONIZED" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">Nov 12, 2026</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <Link to="/reports/rep-002">
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">
                    Local Valve Leakage at Distribution Junction 7
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>East Ridge Junction 7</span>
                    <span className="text-slate-300">•</span>
                    <span>Reported by Amina Osei</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">Maintenance</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PriorityPill priority="MEDIUM" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <WorkflowPill status="SUBMITTED" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <SyncPill status="PENDING" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">Nov 12, 2026</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <Link to="/reports/rep-003">
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
