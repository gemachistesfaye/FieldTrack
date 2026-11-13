export type Role = 'FIELD_WORKER' | 'COORDINATOR' | 'ADMIN';

export type ReportCategory =
  | 'WATER'
  | 'EQUIPMENT'
  | 'ELECTRICAL'
  | 'INFRASTRUCTURE'
  | 'SAFETY'
  | 'SERVICE_INTERRUPTION'
  | 'OTHER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkflowStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type SyncStatus = 'PENDING' | 'SYNCHRONIZED' | 'FAILED';

export interface ReportUserSummary {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface ReportHistoryItemDTO {
  id: string;
  reportId: string;
  actorId?: string | null;
  actor?: ReportUserSummary | null;
  action: string;
  previousValue?: string | null;
  newValue?: string | null;
  description: string;
  createdAt: string;
}

export interface ReportDTO {
  id: string;
  clientId?: string | null;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  priority: Priority;
  status: WorkflowStatus;
  syncStatus: SyncStatus;
  createdById: string;
  createdBy?: ReportUserSummary;
  assignedToId?: string | null;
  assignedTo?: ReportUserSummary | null;
  submittedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  history?: ReportHistoryItemDTO[];
}

export interface ReportStatisticsDTO {
  totalReports: number;
  drafts: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  highPriority: number;
  awaitingAssignment: number;
  statusBreakdown: Record<WorkflowStatus, number>;
  priorityBreakdown: Record<Priority, number>;
  // Admin-specific extensions:
  totalUsers?: number;
  activeFieldWorkers?: number;
  totalCoordinators?: number;
  totalAdmins?: number;
}

export interface ReportFilterParams {
  page?: number;
  limit?: number;
  status?: WorkflowStatus;
  priority?: Priority;
  category?: ReportCategory;
  assignedToId?: string;
  createdById?: string;
  search?: string;
}
