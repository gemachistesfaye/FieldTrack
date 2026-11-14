import React from 'react';
import { Badge } from './Badge';
import { WorkflowStatus, SyncStatus, PriorityLevel } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ArrowUpCircle } from 'lucide-react';

export interface WorkflowPillProps {
  status: WorkflowStatus;
}

export const WorkflowPill: React.FC<WorkflowPillProps> = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <Badge variant="slate" dot>
          Draft
        </Badge>
      );
    case 'SUBMITTED':
      return (
        <Badge variant="blue" dot>
          Submitted
        </Badge>
      );
    case 'ASSIGNED':
      return (
        <Badge variant="purple" dot>
          Assigned
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="slate" dot>
          In Progress
        </Badge>
      );
    case 'RESOLVED':
      return (
        <Badge variant="slate" dot>
          Resolved
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="rose" dot>
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="slate">{status}</Badge>;
  }
};

export interface SyncPillProps {
  status: SyncStatus;
}

export const SyncPill: React.FC<SyncPillProps> = ({ status }) => {
  switch (status) {
    case 'SYNCHRONIZED':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          <CheckCircle2 className="w-3 h-3 text-slate-700 dark:text-slate-300" />
          Synchronized
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          Pending Sync
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Sync Failed
        </span>
      );
    default:
      return <Badge variant="slate">{status}</Badge>;
  }
};

export interface PriorityPillProps {
  priority: PriorityLevel;
}

export const PriorityPill: React.FC<PriorityPillProps> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800">
          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Critical
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
          <ArrowUpCircle className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Low
        </span>
      );
  }
};
