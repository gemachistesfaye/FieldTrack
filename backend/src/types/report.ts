export type Role = 'FIELD_WORKER' | 'COORDINATOR' | 'ADMIN';

export type ReportCategory =
  | 'WATER_POINT'
  | 'EQUIPMENT'
  | 'SERVICE_INTERRUPTION'
  | 'SAFETY_CONCERN'
  | 'MAINTENANCE_REQUEST'
  | 'OTHER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkflowStatus =
  'DRAFT' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type SyncStatus = 'PENDING' | 'SYNCHRONIZED' | 'FAILED';

export interface LocationData {
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
}

export interface ReportDTO {
  id: string;
  clientReportId?: string | null;
  title: string;
  description: string;
  category: ReportCategory;
  priority: Priority;
  workflowStatus: WorkflowStatus;
  syncStatus: SyncStatus;
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  createdById: string;
  assignedToId?: string | null;
  clientCreatedAt?: Date | null;
  clientUpdatedAt?: Date | null;
  lastSyncedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
