import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { HardDrive, CheckCircle2, Shield, Cloud } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(5);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePurgeCache = () => {
    if (window.confirm('Purge non-essential offline telemetry cache?')) {
      setFeedback('Offline cache purged. Only pending reports retained.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSave = () => {
    setFeedback('System configuration saved successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            System Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Adjust offline synchronization policies, local database quotas, and telemetry thresholds.
          </p>
        </div>

        <Button
          variant="industrial"
          size="md"
          onClick={handleSave}
          className="font-bold shadow-xs text-slate-950"
        >
          Save Changes
        </Button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sync Policy Card */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="p-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Cloud className="w-5 h-5 text-amber-500" />
            <CardTitle>Offline Synchronization Policy</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Configure automated reconciliation thresholds for Dexie.js IndexedDB
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-bold text-slate-900">Background Auto-Reconciliation</p>
              <p className="text-xs text-slate-500">
                Automatically push queued local drafts when device reconnects to network
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={e => setAutoSync(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Maximum Sync Retry Threshold</p>
              <p className="text-xs text-slate-500">
                Number of retry cycles before marking a report as synchronization failed
              </p>
            </div>
            <input
              type="number"
              min={1}
              max={10}
              value={retryAttempts}
              onChange={e => setRetryAttempts(parseInt(e.target.value) || 3)}
              className="w-20 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Purge Synchronized Local Cache</p>
              <p className="text-xs text-slate-500">
                Keep browser IndexedDB storage light by archiving synchronized records older than 30 days
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePurgeCache}
              leftIcon={<HardDrive className="w-3.5 h-3.5 text-slate-400" />}
              className="font-bold border-slate-200 text-slate-700"
            >
              Purge Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Access Policy Card */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="p-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Shield className="w-5 h-5 text-amber-500" />
            <CardTitle>Security & Role-Based Access Controls</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Audit logging enforcement and session rotation policy
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Strict Token Rotation (RTR)</p>
              <p className="text-xs text-slate-500">
                Single-use refresh token verification with automated reuse detection
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-900">Immutable Audit Trail</p>
              <p className="text-xs text-slate-500">
                All report status changes and coordinator assignments cryptographically logged
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Enforced
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
