// FieldSync Domain & Application Types

export type UserRole = 'FIELD_WORKER' | 'COORDINATOR' | 'ADMIN';

export type ReportCategory =
  | 'WATER'
  | 'EQUIPMENT'
  | 'ELECTRICAL'
  | 'INFRASTRUCTURE'
  | 'SAFETY'
  | 'SERVICE_INTERRUPTION'
  | 'OTHER'
  | 'WATER_POINT'
  | 'SAFETY_CONCERN'
  | 'MAINTENANCE_REQUEST';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkflowStatus =
  'DRAFT' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type SyncStatus = 'PENDING' | 'SYNCHRONIZED' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
  avatarUrl?: string;
}

export interface ReportLocation {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
}

export interface Report {
  id: string;
  clientReportId?: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: PriorityLevel;
  workflowStatus: WorkflowStatus;
  syncStatus: SyncStatus;
  location: ReportLocation;
  createdById: string;
  createdByName?: string;
  assignedToId?: string | null;
  assignedToName?: string | null;
  clientCreatedAt?: string;
  createdAt: string;
  updatedAt: string;
  syncAttempts?: number;
  syncError?: string | null;
}

// Local IndexedDB representation for offline storage
export interface LocalReportDraft {
  localId?: number; // Dexie auto-increment primary key
  clientReportId: string; // Unique UUID generated on creation
  serverId?: string | null; // Set once synced with backend
  title: string;
  description: string;
  category: ReportCategory;
  priority: PriorityLevel;
  workflowStatus: WorkflowStatus;
  syncStatus: SyncStatus;
  location: ReportLocation;
  clientCreatedAt: string;
  lastModifiedAt: string;
  syncAttempts: number;
  syncError?: string | null;
  isDraft: boolean;
}

export interface ActivityHistoryItem {
  id: string;
  reportId: string;
  reportTitle?: string;
  action: string;
  fromStatus?: WorkflowStatus | null;
  toStatus?: WorkflowStatus | null;
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  notes?: string;
}

export interface DashboardMetrics {
  totalReports: number;
  pendingSync: number;
  inProgress: number;
  resolved: number;
  criticalIssues: number;
}
