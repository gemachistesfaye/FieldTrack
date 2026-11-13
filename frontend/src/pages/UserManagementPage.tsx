import React, { useState } from 'react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UserPlus, Mail, ShieldCheck, ShieldAlert, HardHat, Search } from 'lucide-react';
import { Role } from '../types/auth';

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'Active' | 'Inactive';
  phone: string;
}

const INITIAL_MEMBERS: MemberItem[] = [
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
  {
    id: 'usr-4',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@fieldsync.local',
    role: 'FIELD_WORKER',
    department: 'Sector 3 Power & Grid Ops',
    status: 'Active',
    phone: '+254 744 556 677',
  },
];

export const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredMembers = INITIAL_MEMBERS.filter(m => {
    const matchesSearch =
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            System Admin
          </span>
        );
      case 'COORDINATOR':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Coordinator
          </span>
        );
      case 'FIELD_WORKER':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <HardHat className="w-3.5 h-3.5 text-slate-500" />
            Field Worker
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Team & Role Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of field technicians, dispatch coordinators, and system administrators.
          </p>
        </div>

        <Button
          variant="industrial"
          size="md"
          className="font-bold shadow-xs text-slate-950"
          leftIcon={<UserPlus className="w-4 h-4 text-slate-950" />}
        >
          Invite Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardContent className="p-3.5 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search member by name, email, or department..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <div>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="FIELD_WORKER">Field Worker</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">System Admin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Directory */}
      <Card className="border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Member Name & Identity</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Contact Phone</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{getRoleBadge(u.role)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 font-medium">{u.department}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 font-mono">{u.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold border-slate-200 text-slate-700"
                    >
                      Manage
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
