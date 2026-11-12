import React, { useState } from 'react';
import { RefreshCw, Clock, Wifi, WifiOff, Database, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { SyncPill } from '../components/common/StatusPill';

export const OfflineSyncPage: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Local storage queue synchronized with backend successfully.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Offline & Sync Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage local IndexedDB storage, inspect synchronization queues, and trigger
            reconciliations.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleManualSync}
          isLoading={isSyncing}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Synchronize Now
        </Button>
      </div>

      {/* Sync Engine Health Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Connection Status
              </p>
              <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                {isOnline ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Offline (Isolated)
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isOnline ? 'Automatic background polling active' : 'All mutations stored in Dexie'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Local IndexedDB Records
              </p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">4 cached reports</h3>
              <p className="text-xs text-slate-500 mt-1">IndexedDB: FieldSyncDatabase</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Database className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Outbox Queue
              </p>
              <h3 className="text-lg font-bold text-amber-600 mt-1">1 report queued</h3>
              <p className="text-xs text-slate-500 mt-1">Awaiting reconnection or retry</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Queue Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle>Local Outbox & Pending Queue</CardTitle>
            <CardDescription>
              Offline entries waiting to be transmitted to the central PostgreSQL database
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
          >
            Clear Completed
          </Button>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3">Client ID / Title</th>
                <th className="px-4 py-3">Sync Status</th>
                <th className="px-4 py-3">Attempts</th>
                <th className="px-4 py-3">Local Timestamp</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-900">
                    Local Valve Leakage at Distribution Junction 7
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    uuid: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <SyncPill status="PENDING" />
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600">1 attempt</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">Nov 12, 17:45:00</td>
                <td className="px-5 py-3.5 text-right">
                  <Button variant="outline" size="sm" onClick={handleManualSync}>
                    Force Push
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
