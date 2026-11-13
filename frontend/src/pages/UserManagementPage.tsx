import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UserPlus, Mail, ShieldCheck, ShieldAlert, HardHat, Search, Users } from 'lucide-react';
import { Role } from '../types/auth';
import { userApi } from '../services/userApi';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';

export const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['usersDirectory'],
    queryFn: () => userApi.getUsers(),
  });

  const users = usersRes?.data || [];

  const filteredMembers = users.filter(m => {
    const matchesSearch =
      !searchTerm ||
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
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
            Live directory of authenticated accounts ({users.length} active members in database).
          </p>
        </div>

        <Button
          variant="forest"
          size="md"
          className="font-bold shadow-xs bg-slate-900 text-white hover:bg-slate-800"
          leftIcon={<UserPlus className="w-4 h-4 text-white" />}
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
                placeholder="Search member by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <div>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              >
                <option value="ALL">All Roles ({users.length})</option>
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
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={4} columns={5} />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No Users Found"
              description="No members match your search filter."
              actionLabel="Clear Filter"
              onAction={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-5 py-3.5">Member Name & Identity</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Joined Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getRoleBadge(u.role)}</td>
                    <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Active'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {u.isActive ? 'Active' : 'Inactive'}
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
        )}
      </Card>
    </div>
  );
};
