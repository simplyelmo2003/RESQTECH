import { AdminEmergencyAlert } from '@/types/admin';
import { formatISO } from 'date-fns';
import { safeFetch, checkBackend, apiPost, apiDelete } from './backend';

let SHARED_ALERTS: AdminEmergencyAlert[] = [];

export const loadSharedAlerts = async () => {
  try {
    const ok = await checkBackend();
    if (!ok) {
      console.warn('⚠️ Backend unavailable; alerts will be empty');
      SHARED_ALERTS = [];
      return SHARED_ALERTS;
    }
    const alerts = await safeFetch('/api/alerts');
    if (Array.isArray(alerts) && alerts.length) {
      SHARED_ALERTS = alerts.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        source: a.source || 'Admin',
        level: a.level || 'Low',
        issuedAt: a.createdAt || formatISO(new Date()),
        expiresAt: a.expiresAt,
        areaAffected: a.areaAffected || '',
        link: a.link,
        status: a.status || 'active',
      }));
      console.log('🚨 Loaded alerts from backend:', SHARED_ALERTS.length);
    }
  } catch (e) {
    console.error('Failed to load alerts from backend:', e);
    SHARED_ALERTS = [];
  }
  return SHARED_ALERTS;
};

// Initialize on module load
(async () => {
  await loadSharedAlerts();
})();

export const getSharedAlerts = (): AdminEmergencyAlert[] => {
  return SHARED_ALERTS;
};

export const addAlert = async (alert: Omit<AdminEmergencyAlert, 'id' | 'issuedAt'>): Promise<AdminEmergencyAlert> => {
  const payload = { title: alert.title, description: alert.description, source: alert.source, level: alert.level, areaAffected: alert.areaAffected };
  try {
    const created = await apiPost('/api/alerts', payload);
    const mapped: AdminEmergencyAlert = { ...alert, id: created.id, issuedAt: created.createdAt ?? formatISO(new Date()) };
    SHARED_ALERTS.push(mapped);
    console.log('✅ Added alert (synced with backend):', mapped.id);
    return mapped;
  } catch (e) {
    console.error('Failed to add alert to backend:', e);
    throw e;
  }
};

export const updateAlertInShared = (id: string, updates: Partial<AdminEmergencyAlert>): AdminEmergencyAlert | null => {
  const index = SHARED_ALERTS.findIndex(a => a.id === id);
  if (index === -1) return null;
  const updated = { ...SHARED_ALERTS[index], ...updates };
  SHARED_ALERTS[index] = updated;
  console.log('✏️ Updated alert in shared store:', id);
  return updated;
};

export const deleteAlertFromShared = async (id: string): Promise<boolean> => {
  try {
    await apiDelete(`/api/alerts/${id}`);
    const index = SHARED_ALERTS.findIndex(a => a.id === id);
    if (index === -1) return false;
    SHARED_ALERTS.splice(index, 1);
    console.log('🗑️ Deleted alert from shared store:', id);
    return true;
  } catch (e) {
    console.error('Failed to delete alert from backend:', e);
    throw e;
  }
};

// No longer listening for localStorage events

// Initialize on module load
loadSharedAlerts();
