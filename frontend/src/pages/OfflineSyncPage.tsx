import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { db } from '../services/db';
import { reportApi } from '../services/reportApi';

export const OfflineSyncPage: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Live Dexie query for pending reports in IndexedDB
  const cachedReports = useLiveQuery(() => db.reports.toArray(), []) || [];
  const pendingReports = cachedReports.filter(r => r.syncStatus === 'PENDING');

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncMessage('Device is currently offline. Connect to Wi-Fi or cellular data to reconcile.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    let syncedCount = 0;
    try {
      for (const item of pendingReports) {
        try {
          await reportApi.createReport({
            title: item.title,
            description: item.description,
            category: item.category as any,
            priority: item.priority as any,
            location: item.location.name,
            latitude: item.location.latitude ?? undefined,
            longitude: item.location.longitude ?? undefined,
            status: item.workflowStatus,
          });

          if (item.localId) {
            await db.reports.update(item.localId, {
              syncStatus: 'SYNCHRONIZED',
            });
          }
          syncedCount++;
        } catch (err) {
          if (item.localId) {
            await db.reports.update(item.localId, {
              syncAttempts: (item.syncAttempts || 0) + 1,
              syncError: err instanceof Error ? err.message : 'Synchronization error',
            });
          }
        }
      }

      setSyncMessage(
        syncedCount > 0
          ? `Successfully synchronized ${syncedCount} offline ${syncedCount === 1 ? 'record' : 'records'} with the cloud backend.`
          : 'All pending offline records are already up to date.'
      );
    } catch (err) {
      setSyncMessage('Error during reconciliation: Please check server connectivity.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to purge synchronized records from local storage?')) {
      const synced = cachedReports.filter(r => r.syncStatus === 'SYNCHRONIZED');
      for (const item of synced) {
        if (item.localId) {
          await db.reports.delete(item.localId);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Offline & Synchronization Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspect Dexie.js IndexedDB queues, review cached drafts, and trigger bidirectional cloud reconciliation.
          </p>
        </div>

        <Button
          variant="industrial"
          size="md"
          onClick={handleManualSync}
          isLoading={isSyncing}
          leftIcon={<RefreshCw className="w-4 h-4 text-slate-950" />}
          className="font-bold shadow-xs text-slate-950"
        >
          Synchronize Now
        </Button>
      </div>

      {syncMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs ${
            syncMessage.includes('Successfully')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-300'
          }`}
        >
          {syncMessage.includes('Successfully') ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Sync Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Network Connection"
          value={isOnline ? 'Online' : 'Offline'}
          subtitle={isOnline ? 'Background polling active' : 'Offline local cache active'}
          icon={isOnline ? Wifi : WifiOff}
          color={isOnline ? 'amber' : 'slate'}
        />

        <StatCard
          title="Pending Local Queue"
          value={pendingReports.length.toString()}
          subtitle="Reports queued for sync"
          icon={UploadCloud}
          color={pendingReports.length > 0 ? 'amber' : 'slate'}
        />

        <StatCard
          title="IndexedDB Records"
          value={cachedReports.length.toString()}
          subtitle="Total cached in Dexie"
          icon={Database}
          color="slate"
        />
      </div>

      {/* Queue Details Card */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Offline Mutation Buffer (IndexedDB)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Local records stored in browser IndexedDB waiting for reconciliation
            </CardDescription>
          </div>

          {cachedReports.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
              className="font-bold border-slate-200 text-slate-600 hover:text-rose-600"
            >
              Purge Synced Cache
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-5">
          {cachedReports.length === 0 ? (
            <EmptyState
              title="Local Queue is Clean"
              description="All reports have been synchronized with the remote cloud database. No local mutations pending."
              actionLabel="Create Incident Report"
              onAction={() => window.location.assign('/reports/new')}
            />
          ) : (
            <div className="space-y-3">
              {cachedReports.map(item => (
                <div
                  key={item.clientReportId}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {item.clientReportId.substring(0, 14)}...
                      </span>
                      <span
                        className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full ${
                          item.syncStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {item.syncStatus}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">
                      {item.location.name} • Created {new Date(item.clientCreatedAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs text-slate-400">
                      Retries: {item.syncAttempts || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
