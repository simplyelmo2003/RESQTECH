import { AuditLog } from '@/types/admin';
import { formatISO } from 'date-fns';
import { apiPost, apiGet } from './backend';

let SHARED_LOGS: AuditLog[] = [];

const sanitizeDetails = (d: any) => {
  try {
    if (d === undefined || d === null) return {};
    if (typeof d === 'string') {
      const trimmed = d.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          return JSON.parse(trimmed);
        } catch (e) {
          // Fall through
        }
      }
      return { message: d };
    }
    return JSON.parse(JSON.stringify(d));
  } catch (err) {
    try {
      return { _raw: String(d) };
    } catch (e) {
      return { _raw: 'unserializable' };
    }
  }
};

export const loadSharedLogs = async (): Promise<AuditLog[]> => {
  try {
    const logs = await apiGet('/api/logs');
    if (Array.isArray(logs)) {
      SHARED_LOGS = logs.map((l: any) => {
        const details = sanitizeDetails(l.details);
        const purpose = l.purpose || details.message || details.title || `${l.action} ${l.entityType}`;
        return {
          id: l.id,
          timestamp: l.createdAt || l.timestamp || formatISO(new Date()),
          userId: l.userId || 'system',
          username: l.username || 'System',
          action: l.action || 'Update',
          entityType: l.entityType || 'Unknown',
          entityId: l.entityId || '',
          details,
          purpose,
        };
      });
      console.log('🧾 Loaded shared logs from backend:', SHARED_LOGS.length);
    }
  } catch (err) {
    console.error('Error loading shared logs from backend:', err);
    SHARED_LOGS = [];
    throw err;
  }
  return SHARED_LOGS;
};

export const getSharedLogs = (): AuditLog[] => SHARED_LOGS;

export const addLogToShared = async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
  const details = sanitizeDetails((log as any).details);
  const purpose = (log as any).purpose ?? (details && (details.message || details.title || details.username || details._raw)) ?? `${log.action} ${log.entityType}`;
  
  const created = await apiPost('/api/logs', { ...log, details, purpose });
  
  const newLog: AuditLog = {
    ...log,
    id: created.id,
    timestamp: created.createdAt || created.timestamp || formatISO(new Date()),
    details,
    purpose,
  };
  SHARED_LOGS.push(newLog);
  console.log('✅ Added log to shared store:', newLog.id);
  return newLog;
};
