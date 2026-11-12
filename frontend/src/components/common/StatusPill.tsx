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
        <Badge variant="amber" dot>
          In Progress
        </Badge>
      );
    case 'RESOLVED':
      return (
        <Badge variant="emerald" dot>
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
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Synchronized
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          Pending Sync
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
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
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Critical
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
          <ArrowUpCircle className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          Low
        </span>
      );
  }
};
