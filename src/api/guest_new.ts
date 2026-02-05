import type {
  EmergencyAlert,
  EvacuationCenter,
  EmergencyContact,
  IncidentReport,
  NewsAndVideo,
  IncidentType,
  NewsCategory,
  Coords,
  PaginatedResponse,
} from '@/types/guest';
import type { AdminIncidentReport } from '@/types/admin';
import { formatISO } from 'date-fns';
import { addIncidentReport as addSharedIncidentReport, getIncidentReports as getSharedIncidentReports } from './shared-data';
import { getSharedEvacCenters } from './shared-evac-centers';
import { getSharedNewsVideos } from './shared-news-videos';
import { getSharedAlerts } from './shared-alerts';
import { getSharedContacts } from './shared-contacts';

// Simulate a delay for API calls
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- DUMMY DATA ---
// Note: Evacuation centers now use shared store from shared-evac-centers.ts

const DUMMY_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-001',
    title: 'Typhoon "Agaton" Advisory',
    description: 'Typhoon Agaton (Megi) made landfall over Eastern Visayas. Expect heavy rains and strong winds.',
    source: 'PAGASA',
    level: 'High',
    issuedAt: formatISO(new Date(Date.now() - 2 * 3600 * 1000)),
    expiresAt: formatISO(new Date(Date.now() + 24 * 3600 * 1000)),
    areaAffected: 'Eastern Visayas, Bicol Region, MIMAROPA',
    link: 'https://www.pagasa.dost.gov.ph',
    status: 'active',
  },
  {
    id: 'alert-002',
    title: 'Seismic Activity Advisory',
    description: 'Minor seismic activity detected in Mindanao region. Continue monitoring updates from official sources. Entry into Taal Volcano Island must be strictly prohibited.',
    source: 'PHIVOLCS',
    level: 'Moderate',
    issuedAt: formatISO(new Date(Date.now() - 24 * 3600 * 1000)),
    expiresAt: formatISO(new Date(Date.now() + 7 * 24 * 3600 * 1000)),
    areaAffected: 'Mindanao Region',
    link: 'https://www.phivolcs.dost.gov.ph',
    status: 'active',
  },
  {
    id: 'alert-003',
    title: 'Flood Warning for Surigao City',
    description: 'Moderate to heavy rainfall expected over Surigao City. Monitor flood levels in low-lying areas.',
    source: 'NDRRMC',
    level: 'Low',
    issuedAt: formatISO(new Date(Date.now() - 30 * 60 * 1000)),
    areaAffected: 'Surigao City, Caraga Region',
    link: 'https://www.ndrrmc.gov.ph',
    status: 'active',
  }
];

const DUMMY_CONTACTS: EmergencyContact[] = [
  { id: 'ecnt-001', name: 'National Emergency Hotline', organization: '911', phoneNumber: '911', type: 'Police' },
  { id: 'ecnt-002', name: 'PNP Hotline', organization: 'Philippine National Police', phoneNumber: '117', type: 'Police' },
  { id: 'ecnt-003', name: 'Bureau of Fire Protection', organization: 'BFP', phoneNumber: '(02) 8426-0219', type: 'Fire' },
  { id: 'ecnt-004', name: 'Philippine Red Cross', organization: 'PRC', phoneNumber:'143', type: 'Red Cross' },
  { id: 'ecnt-005', name: 'NDRRMC Operations Center', organization: 'NDRRMC', phoneNumber: '(02) 8911-5061', type: 'NDRRMC' },
  { id: 'ecnt-006', name: 'Ambulance Services', organization: 'Various Hospitals', phoneNumber: '(02) 8XXX-XXXX', type: 'Medical' },
];

// News & Videos now use shared store - see shared-news-videos.ts

let DUMMY_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'ir-001',
    reporterName: 'John Doe',
    location: { lat: 9.7850, lng: 125.5020 },
    locationDescription: 'Maharlika St, Brgy. Rosario, Surigao City',
    type: 'Flood',
    description: 'Heavy flooding, water reaching knee-level, 3 houses affected.',
    imageUrls: ['https://via.placeholder.com/150?text=Flood+1'],
    reportedAt: formatISO(new Date(Date.now() - 1 * 3600 * 1000)),
    status: 'Pending',
  },
  {
    id: 'ir-002',
    reporterName: 'Jane Smith',
    location: { lat: 9.7720, lng: 125.4880 },
    locationDescription: 'Borromeo St Market, Brgy. San Roque, Surigao City',
    type: 'Fire',
    description: 'Small fire detected in informal settlement area. Needs immediate response.',
    imageUrls: ['https://via.placeholder.com/150?text=Fire+1'],
    reportedAt: formatISO(new Date(Date.now() - 5 * 3600 * 1000)),
    status: 'Verified',
  },
  {
    id: 'ir-003',
    reporterName: 'Anonymous',
    location: { lat: 9.7800, lng: 125.4950 },
    locationDescription: 'Domingo St, Brgy. San Jose, Surigao City',
    type: 'Other',
    description: 'Fallen tree blocking the road.',
    imageUrls: [],
    reportedAt: formatISO(new Date(Date.now() - 2 * 24 * 3600 * 1000)),
    status: 'Published',
  }
];

// --- API FUNCTIONS ---

// Emergency Alerts
export const getEmergencyAlerts = async (): Promise<EmergencyAlert[]> => {
  await simulateDelay(500);
  // In a real app, you might fetch from a combined endpoint or external APIs
  // return (await api.get<EmergencyAlert[]>(API_ENDPOINTS.EMERGENCY_ALERTS)).data;
  // Read from shared alerts so guests receive admin-created alerts
  try {
    const shared = getSharedAlerts();
    return shared.filter(alert => alert.status === 'active');
  } catch (err) {
    // Fallback to bundled dummy alerts if something goes wrong
    // eslint-disable-next-line no-console
    console.warn('Failed to read shared alerts, using fallback DUMMY_ALERTS', err);
    return DUMMY_ALERTS.filter(alert => alert.status === 'active');
  }
};

// Evacuation Centers
// Evacuation Centers (using shared store)
export const getEvacuationCenters = async (): Promise<EvacuationCenter[]> => {
  await simulateDelay(700);
  const centers = getSharedEvacCenters();
  console.log('🏢 Guest API: All centers from shared store:', centers.length, centers.map(c => ({ id: c.id, name: c.name, status: c.status })));
  // Guest only sees Open and Full centers, not Closed
  const filteredCenters = centers.filter(center => center.status !== 'Closed');
  console.log('🏢 Guest API: Filtered (non-closed) centers:', filteredCenters.length, filteredCenters.map(c => ({ id: c.id, name: c.name, status: c.status })));
  return filteredCenters;
};

export const getEvacuationCenterDetails = async (id: string): Promise<EvacuationCenter | undefined> => {
  await simulateDelay(500);
  const centers = getSharedEvacCenters();
  return centers.find(center => center.id === id && center.status !== 'Closed');
};

// Emergency Contacts
export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  await simulateDelay(400);
  // return (await api.get<EmergencyContact[]>(API_ENDPOINTS.EMERGENCY_CONTACTS)).data;
  try {
    const shared = getSharedContacts();
    console.log('📇 Guest fetching emergency contacts from shared store:', shared.length);
    return shared;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read shared contacts, falling back to DUMMY_CONTACTS', err);
    return DUMMY_CONTACTS;
  }
};

// Incident Reporting
interface SubmitIncidentReportPayload {
  reporterName: string;
  reporterContact?: string;
  location: Coords;
  locationDescription?: string;
  type: IncidentType;
  description: string;
  imageFiles?: File[]; // For uploaded files, handled differently in real API
}

export const submitIncidentReport = async (payload: SubmitIncidentReportPayload): Promise<IncidentReport> => {
  await simulateDelay(1500);

  // eslint-disable-next-line no-console
  console.log('📤 submitIncidentReport RAW payload received:', payload);

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const imageUrls = payload.imageFiles && payload.imageFiles.length > 0
    ? await Promise.all(Array.from(payload.imageFiles).map((f) => readFileAsDataUrl(f)))
    : [];

  // Handle name and contact - preserve user input even if empty
  let reporterName = payload.reporterName || '';
  let reporterContact: string | undefined = payload.reporterContact || '';
  
  // Only use Anonymous if truly no name provided
  if (!reporterName || reporterName.trim() === '') {
    reporterName = 'Anonymous';
  } else {
    reporterName = reporterName.trim();
  }
  
  // Keep contact as undefined if empty, otherwise use the value
  if (!reporterContact || reporterContact.trim() === '') {
    reporterContact = undefined;
  } else {
    reporterContact = reporterContact.trim();
  }

  // eslint-disable-next-line no-console
  console.log('✅ Processing: reporterName=', reporterName, '| reporterContact=', reporterContact);

  const newReport: AdminIncidentReport = {
    id: `ir-${Date.now()}`,
    reporterName,
    reporterContact,
    location: payload.location,
    locationDescription: payload.locationDescription,
    type: payload.type,
    description: payload.description,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    reportedAt: formatISO(new Date()),
    status: 'Pending',
  };
  
  // eslint-disable-next-line no-console
  console.log('✅ Guest incident report created:', newReport.id);
  // eslint-disable-next-line no-console
  console.log('   Reporter:', newReport.reporterName, '| Contact:', newReport.reporterContact);
  // eslint-disable-next-line no-console
  console.log('   Type:', newReport.type, '| Description:', newReport.description.substring(0, 50) + '...');
  // eslint-disable-next-line no-console
  console.log('   Images:', newReport.imageUrls ? newReport.imageUrls.length : 0, '| Location:', newReport.location?.lat, ',', newReport.location?.lng);
  
  // Add to guest local reports
  DUMMY_INCIDENT_REPORTS.push(newReport);
  // eslint-disable-next-line no-console
  console.log('   ✓ Added to guest local storage');
  
  // Add to shared data so admin can see it and await so errors surface
  try {
    // eslint-disable-next-line no-console
    console.log('   → Attempting to sync to shared-data...');
    await addSharedIncidentReport(newReport);
    // eslint-disable-next-line no-console
    console.log('   ✓ Added to shared-data (awaited)');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed syncing report to shared-data:', e);
  }
  
  return newReport;
};

// Verified Incident Reports (for guest viewing)
export const getVerifiedIncidentReports = async (): Promise<IncidentReport[]> => {
  await simulateDelay(600);
  try {
    const shared = getSharedIncidentReports();
    // Filter to show only verified and published reports
    const verified = shared.filter(r => r.status === 'Verified' || r.status === 'Published');
    console.log('📋 Guest fetching verified incident reports:', verified.length);
    return verified;
  } catch (e) {
    console.warn('Failed to fetch verified reports from shared store:', e);
    return [];
  }
};

// News & Videos
export const getNewsAndVideos = async (
  page: number = 1,
  limit: number = 10,
  category?: NewsCategory,
  latest?: boolean
): Promise<PaginatedResponse<NewsAndVideo>> => {
  await simulateDelay(800);
  
  let filtered = getSharedNewsVideos();
  console.log('📰 Guest fetching news and videos from shared store:', filtered.length);

  if (category) {
    filtered = filtered.filter(item => item.category.includes(category));
  }
  if (latest) {
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    limit,
  };
};

export const getNewsAndVideoDetails = async (id: string): Promise<NewsAndVideo | undefined> => {
  await simulateDelay(500);
  return getSharedNewsVideos().find(item => item.id === id);
};
