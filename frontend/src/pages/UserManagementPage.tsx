import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { RefreshCw, Mail, ShieldCheck, ShieldAlert, HardHat, Search, Users, UserCog } from 'lucide-react';
import { Role, User } from '../types/auth';
import { userApi } from '../services/userApi';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<Role>('FIELD_WORKER');
  const [targetIsActive, setTargetIsActive] = useState<boolean>(true);

  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const { t } = useLanguage();

  const { data: usersRes, isLoading, refetch } = useQuery({
    queryKey: ['usersDirectory'],
    queryFn: () => userApi.getUsers(),
  });

  const users = usersRes?.data || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, role, isActive }: { id: string; role: Role; isActive: boolean }) =>
      userApi.updateUser(id, { role, isActive }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['usersDirectory'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      success('User Updated', `Account role changed to ${vars.role} (${vars.isActive ? 'Active' : 'Inactive'}).`);
      setEditingUser(null);
    },
    onError: err => {
      toastError('Update Failed', err instanceof Error ? err.message : 'Could not update user');
    },
  });

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setTargetRole(user.role);
    setTargetIsActive(user.isActive);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateMutation.mutate({
      id: editingUser.id,
      role: targetRole,
      isActive: targetIsActive,
    });
  };

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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 border border-transparent dark:border-slate-700">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            {t('roleAdmin')}
          </span>
        );
      case 'COORDINATOR':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 dark:bg-blue-950 text-slate-200 dark:text-blue-300 border border-slate-700 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            {t('roleCoordinator')}
          </span>
        );
      case 'FIELD_WORKER':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <HardHat className="w-3.5 h-3.5 text-slate-500" />
            {t('roleFieldWorker')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('navTeam')} & Access Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Directory of personnel ({users.length} registered accounts in PostgreSQL).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {t('refresh')}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <CardContent className="p-3.5 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-2xs"
              />
            </div>

            <div>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="FIELD_WORKER">{t('roleFieldWorker')}</option>
                <option value="COORDINATOR">{t('roleCoordinator')}</option>
                <option value="ADMIN">{t('roleAdmin')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Directory */}
      <Card className="border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 shadow-2xs overflow-hidden">
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
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <tr>
                  <th className="px-5 py-3.5">Member Name & Identity</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Joined Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMembers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getRoleBadge(u.role)}</td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Active'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          u.isActive
                            ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                            : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-slate-900 dark:bg-white' : 'bg-slate-400'
                          }`}
                        />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(u)}
                        className="font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        leftIcon={<UserCog className="w-3.5 h-3.5 text-slate-400" />}
                      >
                        Manage Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Admin Role Management Modal */}
      {editingUser && (
        <Modal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          title={`Manage Account — ${editingUser.fullName}`}
          description="Update platform authorization role and account activity status."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(null)}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                {t('cancel')}
              </Button>
              <Button
                variant="forest"
                size="sm"
                onClick={handleSaveUser}
                isLoading={updateMutation.isPending}
                className="font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
              >
                {t('saveChanges')}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Account Email
              </label>
              <input
                type="text"
                disabled
                value={editingUser.email}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Assign System Role *
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value as Role)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
              >
                <option value="FIELD_WORKER">Field Technician (Submit reports, GPS capture, offline sync)</option>
                <option value="COORDINATOR">Coordinator (Triage queue, review, assign technicians, monitor workflow)</option>
                <option value="ADMIN">Administrator (Full authority, manage users & roles, oversee platform)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Account Active Status</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Deactivated accounts cannot authenticate or access endpoints.
                </p>
              </div>
              <input
                type="checkbox"
                checked={targetIsActive}
                onChange={e => setTargetIsActive(e.target.checked)}
                className="w-4 h-4 accent-slate-900 cursor-pointer"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
