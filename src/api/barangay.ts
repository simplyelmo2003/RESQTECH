import type {
  BarangayEvacuationCenter,
  OfficialIncidentReport,
  BarangayDashboardData,
  EvacCenterSummary,
} from '@/types/barangay';
import { formatISO } from 'date-fns';
import { getSharedEvacCenters, updateEvacCenterInShared, addEvacuationCenter, loadSharedEvacCenters } from './shared-evac-centers';
import { getIncidentReports, addIncidentReport, refreshSharedReports } from './shared-data';
import { getSharedLogs, addLogToShared } from './shared-logs';
import { apiGet, apiPost, apiPut, apiDelete } from './backend';

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- BARANGAY API: Wired to shared stores and admin data ---

export const getBarangayEvacuationCenters = async (barangayId: string): Promise<BarangayEvacuationCenter[]> => {
  await simulateDelay(200);
  // Always reload from backend first
  try {
    await loadSharedEvacCenters();
  } catch (e) {
    console.error('Error loading evac centers from backend:', e);
  }
  const allCenters = getSharedEvacCenters();
  return allCenters.filter((c: any) => c.barangayId === barangayId) as BarangayEvacuationCenter[];
};

export const updateBarangayEvacuationCenter = async (
  id: string,
  _barangayId: string,
  payload: Partial<BarangayEvacuationCenter>,
  officialId: string,
  officialName: string
): Promise<BarangayEvacuationCenter | null> => {
  await simulateDelay(400);
  const updated = await updateEvacCenterInShared(id, payload);

  if (updated) {
    addLogToShared({
      userId: officialId,
      username: officialName,
      action: 'Update',
      entityType: 'EvacuationCenter',
      entityId: id,
      details: { field: Object.keys(payload).join(', '), ...payload },
      purpose: `Update Evacuation Center: ${Object.keys(payload).join(', ')}`,
    });
  }

  return updated as BarangayEvacuationCenter | null;
};

export const createEvacuationCenterForBarangay = async (_brgyId: string, data: Omit<BarangayEvacuationCenter, 'id' | 'status' | 'lastUpdated'>): Promise<BarangayEvacuationCenter> => {
  const created = await addEvacuationCenter(data as any);
  addLogToShared({ userId: 'barangay-456', username: 'Barangay Official', action: 'Create', entityType: 'EvacuationCenter', entityId: created.id, purpose: 'Create Evac Center', details: { name: created.name } });
  return created as BarangayEvacuationCenter;
};


export const getBarangayOfficialIncidentReports = async (barangayId: string): Promise<OfficialIncidentReport[]> => {
  try {
    console.log('🔄 Fetching incident reports for barangay:', barangayId, 'from backend');
    const reports = await apiGet(`/api/barangay/incident-reports?barangayId=${encodeURIComponent(barangayId)}`);
    console.log('📋 Reports fetched from backend:', reports.length, 'reports for barangay:', barangayId);
    return reports;
  } catch (e) {
    console.warn('⚠️ Failed to get incident reports from backend, falling back to shared store', e);
    // Fallback to shared store
    try {
      await refreshSharedReports();
    } catch (fallbackError) {
      console.error('Error loading incident reports from backend:', fallbackError);
    }
    const allReports = getIncidentReports();
    console.log('🔍 [getBarangayOfficialIncidentReports] Filtering reports - barangayId:', barangayId, 'Total reports:', allReports.length);
    const filtered = allReports.filter((r: any) => {
      const match = r.barangayId === barangayId;
      console.log(`   Report ${r.id}: barangayId="${r.barangayId}" === "${barangayId}" ? ${match}`);
      return match;
    }) as OfficialIncidentReport[];
    console.log('✅ Filtered to', filtered.length, 'reports for barangay:', barangayId);
    return filtered;
  }
};

export const submitOfficialIncidentReport = async (
  report: Partial<OfficialIncidentReport>,
  officialId: string,
  officialName: string
): Promise<OfficialIncidentReport | null> => {
  await simulateDelay(500);
  const fullReport = {
    ...report,
    id: `oir-${Date.now()}`,
    reportedAt: formatISO(new Date()),
    isOfficialReport: true,
    status: report.status || 'Pending',
    imageUrls: report.imageUrls || undefined,
  } as OfficialIncidentReport;

  console.log('📤 [submitOfficialIncidentReport] Creating report with imageUrls:', fullReport.imageUrls ? `${fullReport.imageUrls.length} images` : 'none');
  
  await addIncidentReport(fullReport as any);

  if (fullReport) {
    addLogToShared({
      userId: officialId,
      username: officialName,
      action: 'Create',
      entityType: 'IncidentReport',
      entityId: fullReport.id,
      details: { type: report.type, urgency: (report as any).urgency, barangayId: report.barangayId, images: fullReport.imageUrls?.length || 0 },
      purpose: `Create Official Incident Report: ${report.type}`,
    });
  }

  return fullReport as OfficialIncidentReport | null;
};

export const getBarangayLogs = async (barangayId: string): Promise<any[]> => {
  await simulateDelay(200);
  const allLogs = getSharedLogs();
  return allLogs.filter(log => {
    const logAny = log as any;
    return logAny.userId?.startsWith('barangay-') || logAny.details?.barangayId === barangayId;
  });
};

export const getBarangayDashboardData = async (barangayId: string): Promise<BarangayDashboardData> => {
  await simulateDelay(400);

  const allCenters = await getBarangayEvacuationCenters(barangayId);
  const incidentReports = await getBarangayOfficialIncidentReports(barangayId);
  await getBarangayLogs(barangayId);

  const totalCapacity = allCenters.reduce((sum, c) => sum + c.capacity, 0);
  const totalEvacuees = allCenters.reduce((sum, c) => sum + c.currentOccupancy, 0);
  const openCenters = allCenters.filter((c: any) => c.status === 'Open').length;
  const fullCenters = allCenters.filter((c: any) => c.currentOccupancy >= c.capacity).length;
  const closedCenters = allCenters.filter((c: any) => c.status === 'Closed').length;

  const evacCenterSummaries: EvacCenterSummary[] = allCenters.map((c: any) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    maxCapacity: c.capacity,
    currentEvacuees: c.currentOccupancy,
    status: c.status,
  }));

  const activeIncidents = incidentReports.filter(r => ['Pending', 'Verified'].includes(r.status));

  // Generate evacuee trend data for the last 7 days
  const evacueeTrend = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = formatISO(date);
    
    // Simulate trend data: base of 50 evacuees with daily variations
    const baseArrivals = Math.floor(Math.random() * 20) + 5;
    const baseDepartures = Math.floor(Math.random() * 15) + 2;
    const total = Math.max(50 + (baseArrivals - baseDepartures) * (i + 1), 0);
    
    return {
      date: dateStr,
      arrivals: baseArrivals,
      departures: baseDepartures,
      total: total,
    };
  });

  return {
    barangayName: barangayId.replace('brgy-', '').replace(/-/g, ' ').toUpperCase(),
    totalEvacuationCenters: allCenters.length,
    openCenters,
    fullCenters,
    closedCenters,
    totalEvacuees,
    totalCapacity,
    evacCenterSummaries,
    activeIncidents,
    evacueeTrend,
  };
};

export const getBarangayDashboardOverview = async (barangayId: string): Promise<BarangayDashboardData> => {
  return getBarangayDashboardData(barangayId);
};

// Affected People Management
export const getBarangayAffectedPeople = async (barangayId: string) => {
  return apiGet(`/api/barangay/affected-people?barangayId=${encodeURIComponent(barangayId)}`);
};

export const createAffectedPerson = async (data: {
  name: string;
  sex: string;
  age: string | number;
  purok: string;
  birthday?: string;
  affected: boolean;
  evacuated: boolean;
  barangayId: string;
}) => {
  return apiPost('/api/barangay/affected-people', data);
};

export const updateAffectedPerson = async (id: string, data: {
  name?: string;
  sex?: string;
  age?: string | number;
  purok?: string;
  birthday?: string;
  affected?: boolean;
  evacuated?: boolean;
}) => {
  return apiPut(`/api/barangay/affected-people/${id}`, data);
};

export const deleteAffectedPerson = async (id: string) => {
  return apiDelete(`/api/barangay/affected-people/${id}`);
};
