import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { UserPlus, Mail } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const users = [
    {
      id: 'usr-1',
      name: 'Amina Osei',
      email: 'amina.osei@fieldsync.local',
      role: 'FIELD_WORKER',
      department: 'Nairobi Water Operations',
      status: 'Active',
      phone: '+254 712 345 678',
    },
    {
      id: 'usr-2',
      name: 'Marcus Vance',
      email: 'marcus.vance@fieldsync.local',
      role: 'COORDINATOR',
      department: 'Infrastructure Triage Division',
      status: 'Active',
      phone: '+254 722 987 654',
    },
    {
      id: 'usr-3',
      name: 'Elena Rostova',
      email: 'elena.rostova@fieldsync.local',
      role: 'ADMIN',
      department: 'System Architecture & Operations',
      status: 'Active',
      phone: '+254 733 112 233',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Team & Role Access</h2>
          <p className="text-xs text-slate-500 mt-1">
            Directory of field technicians, coordinators, and administrators with role assignments.
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
          Invite Member
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3">Member Name / Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.role === 'ADMIN' && <Badge variant="purple">Admin</Badge>}
                    {u.role === 'COORDINATOR' && <Badge variant="teal">Coordinator</Badge>}
                    {u.role === 'FIELD_WORKER' && <Badge variant="blue">Field Worker</Badge>}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{u.department}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{u.phone}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
