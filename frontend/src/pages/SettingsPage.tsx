import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { HardDrive } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust offline synchronization behavior, local cache sizes, and API endpoint bindings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offline Synchronization Policy</CardTitle>
          <CardDescription>Configure frequency and retry thresholds for Dexie.js</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Background Auto-Reconciliation</p>
              <p className="text-xs text-slate-500">
                Automatically sync pending local drafts when internet reconnects
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded" />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Maximum Sync Retry Attempts</p>
              <p className="text-xs text-slate-500">
                Retry count before flagging report as sync failed
              </p>
            </div>
            <input
              type="number"
              defaultValue={5}
              className="w-20 px-3 py-1.5 text-xs rounded border border-slate-300"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Purge Synchronized Local Cache</p>
              <p className="text-xs text-slate-500">
                Keep Dexie database slim by archiving records older than 30 days
              </p>
            </div>
            <Button variant="outline" size="sm" leftIcon={<HardDrive className="w-3.5 h-3.5" />}>
              Purge Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
