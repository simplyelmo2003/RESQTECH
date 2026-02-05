import { Coords } from './common';
export type { Coords, PaginatedResponse } from './common';

export const AlertSource = {
  PAGASA: 'PAGASA',
  PHIVOLCS: 'PHIVOLCS',
  NDRRMC: 'NDRRMC',
  Admin: 'Admin',
} as const;
export type AlertSource = typeof AlertSource[keyof typeof AlertSource];

export const AlertLevel = {
  Low: 'Low',
  Moderate: 'Moderate',
  High: 'High',
  Severe: 'Severe',
} as const;
export type AlertLevel = typeof AlertLevel[keyof typeof AlertLevel];

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  source: AlertSource;
  level: AlertLevel;
  issuedAt: string; // ISO date string
  expiresAt?: string; // ISO date string
  areaAffected: string;
  link?: string;
  status: 'active' | 'archived';
}

export const EvacCenterStatus = {
  Open: 'Open',
  Full: 'Full',
  Closed: 'Closed',
} as const;
export type EvacCenterStatus = typeof EvacCenterStatus[keyof typeof EvacCenterStatus];

export const EvacCenterService = {
  Water: 'Water',
  Medical: 'Medical',
  Food: 'Food',
  Power: 'Power',
} as const;
export type EvacCenterService = typeof EvacCenterService[keyof typeof EvacCenterService];

export interface EvacuationCenter {
  id: string;
  name: string;
  address: string;
  location: Coords; // lat, lng
  capacity: number;
  currentOccupancy: number; // For admin/barangay view, guest sees available slots
  contact: string;
  status: EvacCenterStatus;
  barangayId: string; // Link to which barangay it belongs
  services: EvacCenterService[];
  imageUrl?: string;
  lastUpdated: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  phoneNumber: string;
  type: 'Fire' | 'Police' | 'Medical' | 'Red Cross' | 'NDRRMC' | 'Others';
  description?: string;
}

export const IncidentType = {
  Flood: 'Flood',
  Fire: 'Fire',
  Earthquake: 'Earthquake',
  Landslide: 'Landslide',
  Typhoon: 'Typhoon',
  Other: 'Other',
} as const;
export type IncidentType = typeof IncidentType[keyof typeof IncidentType];

export const IncidentStatus = {
  Pending: 'Pending',
  Verified: 'Verified',
  Published: 'Published',
  Rejected: 'Rejected',
} as const;
export type IncidentStatus = typeof IncidentStatus[keyof typeof IncidentStatus];

export interface IncidentReport {
  id: string;
  reporterName: string;
  reporterContact?: string; // Optional for guest reports
  location: Coords;
  locationDescription?: string; // Manual text description of location
  type: IncidentType;
  description: string;
  imageUrls?: string[]; // URLs of uploaded images
  reportedAt: string; // ISO date string
  status: IncidentStatus;
  adminNotes?: string; // Notes from admin after verification
  barangayId?: string; // If reported by barangay official
  households?: Array<{
    id: string;
    headName?: string;
    purok?: string;
    householdsCount?: number;
    affected?: boolean;
    evacuated?: boolean;
    members?: Array<{ id: string; name?: string; sex?: 'Male'|'Female'|'Other'; age?: number }>;
  }>;
}

export const NewsCategory = {
  Advisory: 'Advisory',
  SafetyTips: 'Safety Tips',
  Preparedness: 'Preparedness',
  Updates: 'Updates',
  Event: 'Event',
} as const;
export type NewsCategory = typeof NewsCategory[keyof typeof NewsCategory];

export const MediaType = {
  Article: 'Article',
  YouTube: 'YouTube',
  FacebookLive: 'Facebook Live',
  UploadedVideo: 'Uploaded Video',
} as const;
export type MediaType = typeof MediaType[keyof typeof MediaType];

export interface NewsAndVideo {
  id: string;
  title: string;
  content: string; // HTML content for articles, description for videos
  category: NewsCategory[];
  mediaType: MediaType;
  mediaUrl: string; // URL for YouTube/Facebook/Uploaded Video, or main image for article
  thumbnailUrl?: string; // For videos or articles
  publishedAt: string; // ISO date string
  author: string;
  source: string; // e.g., "PAGASA", "Local News", "Admin"
}