import { EvacuationCenter, IncidentReport } from './guest';
import { EvacCenterService, EvacCenterStatus } from './guest';


export interface BarangayEvacuationCenter extends EvacuationCenter {
  // Barangay officials can update these fields directly
  currentOccupancy: number; // Explicitly available
  status: EvacCenterStatus;
  services: EvacCenterService[];
  contactPersons: { name: string; phone: string; role: string }[];
  lastUpdatedBy: string; // User ID of the barangay official who last updated
}

export const OfficialIncidentUrgency = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const;
export type OfficialIncidentUrgency = typeof OfficialIncidentUrgency[keyof typeof OfficialIncidentUrgency];

export interface OfficialIncidentReport extends IncidentReport {
  barangayId: string; // Mandatory for official reports
  reportedByOfficialId: string; // User ID of the official
  affectedHouseholds: number;
  households?: Array<{
    id: string;
    name: string;
    sex: 'Male' | 'Female' | '';
    age: number | '';
    purok: string;
    birthday: string;
    affected: boolean;
    evacuated: boolean;
    barangayId?: string;
    barangay?: {
      id: string;
      displayName: string;
      address?: string;
    };
  }>;
  urgency: OfficialIncidentUrgency;
  isOfficialReport: true; // Distinguish from guest reports
}

export interface EvacCenterSummary {
  id: string;
  name: string;
  address: string;
  maxCapacity: number;
  currentEvacuees: number;
  status: EvacCenterStatus;
}

export interface BarangayDashboardData {
  barangayName: string;
  totalEvacuationCenters: number;
  openCenters: number;
  fullCenters: number;
  closedCenters: number;
  totalEvacuees: number;
  totalCapacity: number;
  evacCenterSummaries: EvacCenterSummary[];
  activeIncidents: OfficialIncidentReport[]; // Incidents specific to this barangay
  evacueeTrend: { date: string; arrivals: number; departures: number; total: number }[]; // For charts
}