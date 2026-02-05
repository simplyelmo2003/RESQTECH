import { EvacuationCenter, EmergencyAlert, EmergencyContact, NewsAndVideo, IncidentReport } from './guest';
import { User } from './auth';

export const LogAction = {
  Login: 'Login',
  Logout: 'Logout',
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete',
  Verify: 'Verify',
  Broadcast: 'Broadcast',
} as const;
export type LogAction = typeof LogAction[keyof typeof LogAction];

export const LogEntityType = {
  User: 'User',
  EvacuationCenter: 'EvacuationCenter',
  EmergencyContact: 'EmergencyContact',
  EmergencyAlert: 'EmergencyAlert',
  NewsAndVideo: 'NewsAndVideo',
  IncidentReport: 'IncidentReport',
} as const;
export type LogEntityType = typeof LogEntityType[keyof typeof LogEntityType];

export interface AuditLog {
  id: string;
  timestamp: string; // ISO date string
  userId: string;
  username: string;
  action: LogAction;
  entityType: LogEntityType;
  entityId: string;
  details: Record<string, any>; // JSON object of changes or relevant info
  purpose?: string; // Short human-friendly purpose/summary for the log entry
}

// Admin-specific types for managing these entities
export interface AdminEvacuationCenter extends EvacuationCenter {
  // Can include additional fields only visible to admin
  // e.g., internal notes, audit history
}

export interface AdminEmergencyAlert extends EmergencyAlert {
  //
}

export interface AdminEmergencyContact extends EmergencyContact {
  //
}

export interface AdminNewsVideo extends NewsAndVideo {
  //
}

export interface AdminIncidentReport extends IncidentReport {
  reportedByUserId?: string; // if user is logged in
}

export interface SystemUser extends User {
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}