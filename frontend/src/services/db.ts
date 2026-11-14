import Dexie, { type Table } from 'dexie';
import { LocalReportDraft } from '../types';

export class FieldTrackDatabase extends Dexie {
  reports!: Table<LocalReportDraft, number>;

  constructor() {
    super('FieldTrackDatabase');
    this.version(1).stores({
      reports:
        '++localId, clientReportId, serverId, syncStatus, workflowStatus, category, priority, clientCreatedAt',
    });
  }
}

export const db = new FieldTrackDatabase();
export const FieldSyncDatabase = FieldTrackDatabase;
