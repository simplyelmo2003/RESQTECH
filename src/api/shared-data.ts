import type { AdminIncidentReport } from '@/types/admin';
import { formatISO } from 'date-fns';
import { safeFetch, checkBackend, apiPost } from './backend';

const loadSharedReports = async (): Promise<AdminIncidentReport[]> => {
  try {
    const ok = await checkBackend();
    if (!ok) {
      console.warn('⚠️ Backend unavailable; incident reports will be empty');
      return [];
    }
    const reports = await safeFetch('/api/incident-reports');
    console.log('📥 loadSharedReports got:', reports);
    if (!reports) {
      console.warn('⚠️ No reports returned from backend');
      return [];
    }
    if (!Array.isArray(reports)) {
      console.error('❌ Backend returned non-array:', typeof reports, reports);
      return [];
    }
    if (reports.length === 0) {
      console.log('✅ Backend returned empty array (no reports)');
      return [];
    }
    
    console.log('✅ Processing', reports.length, 'reports from backend');
    return reports.map((r: any, idx: number) => {
      console.log(`   [${idx}] Processing report:`, { id: r.id, reporterName: r.reporterName, type: r.type, status: r.status });
      
      // Parse imageUrls if it's a JSON string
      let imageUrls = r.imageUrls || [];
      if (typeof imageUrls === 'string') {
        try {
          imageUrls = JSON.parse(imageUrls);
        } catch (e) {
          console.warn(`   [${idx}] Failed to parse imageUrls:`, e);
          imageUrls = [];
        }
      }
      
      const mapped = {
        id: r.id,
        reporterName: r.reporterName || 'Unknown',
        reporterContact: r.reporterContact || '',
        location: {
          lat: r.latitude || 0,
          lng: r.longitude || 0
        },
        locationDescription: r.locationDescription || '',
        type: r.type || 'Other',
        description: r.description || '',
        imageUrls: imageUrls,
        reportedAt: r.createdAt || formatISO(new Date()),
        status: (r.status === 'pending' ? 'Pending' : r.status) || 'Pending',
        adminNotes: r.adminNotes || '',
        barangayId: r.barangayId || undefined,
      };
      console.log(`   [${idx}] Mapped to:`, { id: mapped.id, reporterName: mapped.reporterName, type: mapped.type, status: mapped.status });
      return mapped;
    });
  } catch (e) {
    console.error('Failed to load incident reports from backend:', e);

  }
  return [];
};

export let SHARED_INCIDENT_REPORTS: AdminIncidentReport[] = [];

// Initialize on module load
(async () => {
  SHARED_INCIDENT_REPORTS = await loadSharedReports();
})();

// Force-refresh shared reports from backend
export const refreshSharedReports = async (): Promise<AdminIncidentReport[]> => {
  try {
    const fresh = await loadSharedReports();
    SHARED_INCIDENT_REPORTS = fresh;
    console.log('🔄 Shared reports refreshed from backend:', SHARED_INCIDENT_REPORTS.length);
    return SHARED_INCIDENT_REPORTS;
  } catch (e) {
    console.error('Failed to refresh shared reports:', e);
    return SHARED_INCIDENT_REPORTS;
  }
};
export const addIncidentReport = async (report: AdminIncidentReport): Promise<void> => {
  console.log('🔁 [addIncidentReport] START - report:', report);
  
  // Build payload from report object
  const payload = {
    reporterName: report.reporterName || 'Anonymous',
    reporterContact: report.reporterContact || null,
    type: report.type || 'Other',
    description: report.description || '',
    locationDescription: report.locationDescription || null,
    latitude: report.location?.lat ?? null,
    longitude: report.location?.lng ?? null,
    imageUrls: report.imageUrls && report.imageUrls.length > 0 ? report.imageUrls : [],
    barangayId: report.barangayId || null
  };
  
  console.log('🔁 [addIncidentReport] Payload to send:', payload);
  console.log('🔁 [addIncidentReport] Input report.barangayId:', report.barangayId, 'Payload.barangayId:', payload.barangayId);
  
  try {
    console.log('🔁 [addIncidentReport] Calling apiPost...');
    const created = await apiPost('/api/incident-reports', payload);
    console.log('🔁 [addIncidentReport] ✅ SUCCESS - Backend returned:', created);
    
    // Add to shared store
    SHARED_INCIDENT_REPORTS.push(report);
    console.log('🔁 [addIncidentReport] Added to SHARED_INCIDENT_REPORTS, total now:', SHARED_INCIDENT_REPORTS.length);
    
  } catch (e: any) {
    console.error('🔁 [addIncidentReport] ❌ FAILED:', e?.message || e);
    // Still add locally even if backend fails
    SHARED_INCIDENT_REPORTS.push(report);
    throw e; // Re-throw so caller knows it failed
  }
};

export const getIncidentReports = (): AdminIncidentReport[] => {
  return SHARED_INCIDENT_REPORTS;
};

export const updateIncidentReport = (id: string, updates: Partial<AdminIncidentReport>): AdminIncidentReport | null => {
  const index = SHARED_INCIDENT_REPORTS.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  const oldReport = SHARED_INCIDENT_REPORTS[index];
  const updatedReport = { ...oldReport, ...updates };
  SHARED_INCIDENT_REPORTS[index] = updatedReport;
  return updatedReport;
};

export const deleteIncidentReport = (id: string): boolean => {
  const index = SHARED_INCIDENT_REPORTS.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  SHARED_INCIDENT_REPORTS.splice(index, 1);
  return true;
};
