import React from 'react';
import { cn } from '../../utils/cn';
import { WorkflowStatus } from '../../types/report';
import { CheckCircle2, Clock, AlertCircle, FileText, UserCheck, XCircle } from 'lucide-react';

export interface StatusBadgeProps {
  status: WorkflowStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  WorkflowStatus,
  { label: string; bg: string; text: string; border: string; dot: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    icon: FileText,
  },
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
    icon: AlertCircle,
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
    icon: UserCheck,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    dot: 'bg-slate-600',
    icon: Clock,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    dot: 'bg-slate-600',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50/70',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const config = statusConfig[status] || statusConfig.SUBMITTED;
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-2xs whitespace-nowrap',
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
    >
      {showIcon ? (
        <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0')} />
      ) : (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
