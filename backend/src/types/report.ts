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
  'DRAFT' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type SyncStatus = 'PENDING' | 'SYNCHRONIZED' | 'FAILED';

export interface CreateReportInput {
  clientId?: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  priority?: Priority;
  status?: WorkflowStatus;
  createdById?: string;
  assignedToId?: string | null;
  clientCreatedAt?: string | Date | null;
}

export interface ReportFilterOptions {
  page?: number;
  limit?: number;
  status?: WorkflowStatus;
  priority?: Priority;
  category?: ReportCategory;
  createdById?: string;
  assignedToId?: string;
  search?: string;
}

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
  createdAt: Date;
}

export interface ReportAttachmentDTO {
  id: string;
  reportId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  createdAt: Date;
}

export interface ReportResponseDTO {
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
  clientCreatedAt?: Date | null;
  clientUpdatedAt?: Date | null;
  lastSyncedAt?: Date | null;
  syncAttempts: number;
  syncError?: string | null;
  createdById: string;
  createdBy?: ReportUserSummary;
  assignedToId?: string | null;
  assignedTo?: ReportUserSummary | null;
  submittedAt?: Date | null;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  history?: ReportHistoryItemDTO[];
  attachments?: ReportAttachmentDTO[];
}
