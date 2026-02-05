import type {
  AdminEvacuationCenter,
  AdminEmergencyAlert,
  AdminEmergencyContact,
  AdminNewsVideo,
  AdminIncidentReport,
  AuditLog,
  SystemUser,
} from '@/types/admin';
import type { IncidentStatus } from '@/types/guest';
// Evacuation centers
import {
  addEvacuationCenter,
  updateEvacCenterInShared,
  deleteEvacCenterFromShared,
  loadSharedEvacCenters,
} from './shared-evac-centers';
// News and videos
import {
  addNewsVideo as addSharedNewsVideo,
  updateNewsVideoInShared,
  deleteNewsVideoFromShared,
} from './shared-news-videos';
import {
  getSharedAlerts,
  loadSharedAlerts,
  addAlert,
  updateAlertInShared,
  deleteAlertFromShared,
} from './shared-alerts';
import {
  getSharedContacts,
  addSharedContact,
  updateContactInShared,
  deleteContactFromShared,
  loadSharedContacts,
} from './shared-contacts';
// Incident reports
import { getIncidentReports as getSharedIncidentReports, updateIncidentReport as updateSharedIncidentReport, deleteIncidentReport as deleteSharedIncidentReport } from './shared-data';
// Users
import { getSharedUsers, updateUserInShared, deleteUserFromShared, loadSharedUsers } from './shared-users';
import { getSharedLogs, addLogToShared } from './shared-logs';
import { apiGet, apiPost, apiPut, apiDelete, invalidateBackendCache } from './backend';

// Simulate a delay for API calls
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- DUMMY DATA FOR ADMIN ---
// Make sure to match with types defined in src/types/admin.ts
// Note: Alerts and Contacts now use shared stores

// Users and Logs are persisted in shared stores (`shared-users.ts`, `shared-logs.ts`).
// See those modules for initialization and persistence.


// --- API FUNCTIONS FOR ADMIN ---

// Evacuation Centers (using shared store)
export const getAdminEvacuationCenters = async (): Promise<AdminEvacuationCenter[]> => {
  // Use shared store loader which maps backend shape to AdminEvacuationCenter
  try {
    const centers = await loadSharedEvacCenters();
    console.log('📋 Admin fetching evacuation centers via shared store:', centers.length);
    return centers;
  } catch (e) {
    console.warn('⚠️ Failed to load evacuation centers via shared store, falling back to direct API GET', e);
    const centers = await apiGet('/api/evac-centers');
    return centers;
  }
};

export const createEvacuationCenter = async (data: Omit<AdminEvacuationCenter, 'id' | 'lastUpdated'>) => {
  const newCenter = await addEvacuationCenter(data);
  console.log('✅ Evacuation center created:', newCenter.id, newCenter.name);
  addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Create', entityType: 'EvacuationCenter', entityId: newCenter.id, purpose: 'Create Evacuation Center', details: { name: newCenter.name } }).catch(e => console.error('Failed to log create:', e));
  return newCenter;
};


export const updateEvacuationCenter = async (id: string, center: Partial<AdminEvacuationCenter>): Promise<AdminEvacuationCenter> => {
  await simulateDelay(700);
  const updatedCenter = await updateEvacCenterInShared(id, center);
  if (!updatedCenter) throw new Error('Evacuation center not found');
  console.log('✏️ Evacuation center updated:', id);
  // Add log (fire-and-forget)
  addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'EvacuationCenter', entityId: updatedCenter.id, purpose: 'Update Evacuation Center', details: { changes: Object.keys(center) } }).catch(e => console.error('Failed to log update:', e));
  return updatedCenter;
};

export const deleteEvacuationCenter = async (id: string): Promise<void> => {
  await simulateDelay(500);
  const deleted = await deleteEvacCenterFromShared(id);
  if (!deleted) throw new Error('Evacuation center not found');
  console.log('🗑️ Evacuation center deleted:', id);
  // Add log (fire-and-forget)
  addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'EvacuationCenter', entityId: id, purpose: 'Delete Evacuation Center', details: {} }).catch(e => console.error('Failed to log delete:', e));
};

// Emergency Alerts (using shared store)
export const getAdminEmergencyAlerts = async (): Promise<AdminEmergencyAlert[]> => {
  try {
    const alerts: any[] = await apiGet('/api/alerts');
    console.log('🚨 Admin fetching alerts from backend:', alerts.length);
    // Normalize backend shape to AdminEmergencyAlert
    const mapped = alerts.map(a => ({
      id: a.id,
      title: a.title || a.name || 'Untitled Alert',
      description: a.description || a.body || '',
      source: a.source || 'Admin',
      level: a.level || 'Low',
      issuedAt: a.issuedAt || a.createdAt || new Date().toISOString(),
      expiresAt: a.expiresAt || null,
      areaAffected: a.areaAffected || a.areaAffected || a.area || '',
      link: a.link || null,
      status: a.status || 'active',
    } as AdminEmergencyAlert));
    return mapped;
  } catch (e) {
    console.warn('⚠️ Admin failed to fetch alerts from backend, falling back to shared store:', e);
    try {
      await loadSharedAlerts();
    } catch (inner) {
      console.warn('⚠️ Failed to load shared alerts from backend during fallback:', inner);
    }
    const shared = getSharedAlerts();
    console.log('🚨 Admin using shared alerts fallback:', shared.length);
    return shared;
  }
};

export const createAlert = async (data: Omit<AdminEmergencyAlert, 'id' | 'issuedAt'>) => {
  try {
    const newAlert = await addAlert(data);
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Create', entityType: 'EmergencyAlert', entityId: newAlert.id, purpose: 'Create Emergency Alert', details: { title: newAlert.title } });
    return newAlert;
  } catch (err) {
    console.error('Error creating alert:', err);
    throw err;
  }
};


export const updateEmergencyAlert = async (id: string, alert: Partial<AdminEmergencyAlert>): Promise<AdminEmergencyAlert> => {
    await simulateDelay(700);
    const updated = updateAlertInShared(id, alert);
    if (!updated) throw new Error('Emergency alert not found');
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'EmergencyAlert', entityId: updated.id, purpose: 'Update Emergency Alert', details: { changes: Object.keys(alert) } });
    return updated;
};

export const deleteEmergencyAlert = async (id: string): Promise<void> => {
    await simulateDelay(500);
    const deleted = await deleteAlertFromShared(id);
    if (!deleted) throw new Error('Emergency alert not found');
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'EmergencyAlert', entityId: id, purpose: 'Delete Emergency Alert', details: {} });
};

export const broadcastAlert = async (id: string): Promise<void> => {
  await simulateDelay(1000);
  const alert = getSharedAlerts().find(a => a.id === id);
  if (!alert) throw new Error('Alert not found');
  console.log(`Broadcasting alert: ${alert.title}`);
  // In a real app, this would trigger push notifications, etc.
  addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Broadcast', entityType: 'EmergencyAlert', entityId: id, purpose: 'Broadcast Emergency Alert', details: { title: alert.title } });
};


// Emergency Contacts
export const getAdminEmergencyContacts = async (): Promise<AdminEmergencyContact[]> => {
  await simulateDelay(500);
  // Always reload from backend first
  try {
    await loadSharedContacts();
  } catch (e) {
    console.error('Error loading contacts from backend:', e);
  }
  const shared = getSharedContacts();
  console.log('📇 Admin fetching emergency contacts from shared store:', shared.length);
  return shared;
};

export const createEmergencyContact = async (contact: Omit<AdminEmergencyContact, 'id'>): Promise<AdminEmergencyContact> => {
    await simulateDelay(700);
    const newContact = await addSharedContact(contact);
    await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Create', entityType: 'EmergencyContact', entityId: newContact.id, purpose: 'Create Emergency Contact', details: { name: newContact.name } }).catch(e => console.error('Failed to log create:', e));
    return newContact;
};

export const updateEmergencyContact = async (id: string, contact: Partial<AdminEmergencyContact>): Promise<AdminEmergencyContact> => {
    await simulateDelay(700);
    const updated = await updateContactInShared(id, contact);
    if (!updated) throw new Error('Emergency contact not found');
    // Add log (fire-and-forget)
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'EmergencyContact', entityId: updated.id, purpose: 'Update Emergency Contact', details: { changes: Object.keys(contact) } }).catch(e => console.error('Failed to log update:', e));
    return updated;
};

export const deleteEmergencyContact = async (id: string): Promise<void> => {
    await simulateDelay(500);
    const deleted = await deleteContactFromShared(id);
    if (!deleted) throw new Error('Emergency contact not found');
    // Add log (fire-and-forget)
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'EmergencyContact', entityId: id, purpose: 'Delete Emergency Contact', details: {} }).catch(e => console.error('Failed to log delete:', e));
};


// Incident Reports
export const getAdminIncidentReports = async (): Promise<AdminIncidentReport[]> => {
  try {
    // Prefer the shared store which normalizes fields (imageUrls, reportedAt, location)
    const reports = getSharedIncidentReports();
    console.log('📋 Admin fetching incident reports from shared store:', reports.length);
    return reports;
  } catch (e) {
    console.warn('⚠️ Failed to get incident reports from shared store, falling back to backend GET', e);
    const reports = await apiGet('/api/incident-reports');
    return reports;
  }
};

export const updateIncidentReportStatus = async (id: string, status: IncidentStatus, adminNotes?: string): Promise<AdminIncidentReport> => {
    await simulateDelay(300);

    // Prepare payload for backend
    const payload: any = { status };
    if (adminNotes !== undefined) payload.adminNotes = adminNotes;

    try {
      // Try to persist status change to backend
      try { invalidateBackendCache(); } catch (e) { /* ignore */ }
      const backendResponse = await apiPut(`/api/incident-reports/${id}`, payload);
      console.log('🔁 [updateIncidentReportStatus] ✅ Backend returned:', backendResponse);
      // Refresh shared reports so local store matches backend
    } catch (e: any) {
      console.error('🔁 [updateIncidentReportStatus] ⚠️ Backend update failed:', e?.message);
      // fall back to local update
    }

    const report = updateSharedIncidentReport(id, { status, adminNotes });
    if (!report) throw new Error('Incident report not found');
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'IncidentReport', entityId: id, purpose: 'Update Incident Status', details: { status: report.status } });
    return report;
};

export const updateFullIncidentReport = async (id: string, updates: Partial<AdminIncidentReport>): Promise<AdminIncidentReport> => {
    await simulateDelay(400);
    
    // Build payload for backend
    const payload: any = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.adminNotes = updates.adminNotes;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.locationDescription !== undefined) payload.locationDescription = updates.locationDescription;

    console.log('🔁 [updateFullIncidentReport] Calling backend with payload:', payload);
    
    try {
      // Invalidate cached backend availability and attempt to persist the update
      try { invalidateBackendCache(); } catch (e) { /* ignore */ }

      const backendResponse = await apiPut(`/api/incident-reports/${id}`, payload);
      console.log('🔁 [updateFullIncidentReport] ✅ Backend returned:', backendResponse);

      // Refresh shared reports from backend so local store matches persisted state
    } catch (e: any) {
      console.error('🔁 [updateFullIncidentReport] ⚠️ Backend update failed:', e?.message);
      // Continue with local update even if backend fails
    }

    // Update shared store locally as well
    const report = updateSharedIncidentReport(id, updates);
    if (!report) throw new Error('Incident report not found');
    console.log('✏️ Incident report updated:', id, updates);
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'IncidentReport', entityId: id, purpose: 'Update Incident Report', details: updates });
    return report;
};

export const deleteIncidentReport = async (id: string): Promise<void> => {
    await simulateDelay(300);
    try {
      try { invalidateBackendCache(); } catch (e) { /* ignore */ }
      const resp = await apiDelete(`/api/incident-reports/${id}`);
      console.log('🔁 [deleteIncidentReport] Backend deleted report:', resp);
      // Refresh shared store after backend deletion
    } catch (e: any) {
      console.error('🔁 [deleteIncidentReport] Backend delete failed:', e?.message);
      // fallback to local delete
      deleteSharedIncidentReport(id);
    }
    addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'IncidentReport', entityId: id, purpose: 'Delete Incident Report', details: {} });
};

// News & Videos (using shared store)
export const getAdminNewsAndVideos = async (): Promise<AdminNewsVideo[]> => {
  const items = await apiGet('/api/news');
  const parsedItems = items.map((i: any) => {
    let categoryArray = [];
    try {
      if (i.category) {
        categoryArray = typeof i.category === 'string' ? JSON.parse(i.category) : (Array.isArray(i.category) ? i.category : []);
      }
    } catch (e) {
      console.warn('Failed to parse category for news item', i.id, ':', e);
      categoryArray = [];
    }
    return {
      id: i.id,
      title: i.title,
      content: i.content || '',
      category: categoryArray,
      mediaType: i.mediaType || 'Article',
      mediaUrl: i.mediaUrl || '',
      thumbnailUrl: i.thumbnailUrl || '',
      publishedAt: i.publishedAt || new Date().toISOString(),
      author: i.author || 'Admin',
      source: i.source || '',
    };
  });
  console.log('📰 Admin fetching news and videos from backend:', parsedItems.length);
  return parsedItems;
};

export const createNewsAndVideo = async (item: Omit<AdminNewsVideo, 'id' | 'publishedAt'>): Promise<AdminNewsVideo> => {
    await simulateDelay(700);
    const newItem = await addSharedNewsVideo(item);
    await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Create', entityType: 'NewsAndVideo', entityId: newItem.id, purpose: 'Create News/Video', details: { title: newItem.title } });
    return newItem;
};

export const updateNewsAndVideo = async (id: string, item: Partial<AdminNewsVideo>): Promise<AdminNewsVideo> => {
    await simulateDelay(700);
    const updated = await updateNewsVideoInShared(id, item);
    if (!updated) throw new Error('News/Video item not found');
    await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'NewsAndVideo', entityId: updated.id, purpose: 'Update News/Video', details: { changes: Object.keys(item) } });
    return updated;
};

export const deleteNewsAndVideo = async (id: string): Promise<void> => {
    await simulateDelay(500);
    const deleted = await deleteNewsVideoFromShared(id);
    if (!deleted) throw new Error('News/Video item not found');
    await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'NewsAndVideo', entityId: id, purpose: 'Delete News/Video', details: {} });
};

// Users Management
export const getSystemUsers = async (): Promise<SystemUser[]> => {
  await simulateDelay(300);
  try {
    // Fetch users from backend using apiGet (ensures backend probe and proper base URL)
    const users = await apiGet('/api/users');
    console.log('👥 Admin fetching users from backend:', users.length, 'users');
    return users.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email || '',
      role: u.role,
      barangayId: u.barangayId || undefined,
      isActive: u.isActive !== false,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      token: u.token || '',
    }));
  } catch (e) {
    console.error('Failed to fetch users from backend:', e);
    // Attempt to load shared users (best-effort)
    try {
      await loadSharedUsers();
    } catch (loadErr) {
      console.warn('Failed to load shared users from backend during fallback:', loadErr);
    }
    const users = getSharedUsers();
    console.log('👥 Falling back to shared store:', users.length);
    return users;
  }
};

export const createUser = async (user: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt' | 'token'> & { password: string }): Promise<SystemUser> => {
    await simulateDelay(500);
    try {
      // Create user on backend using apiPost for consistency
      console.log('📝 Creating user with payload:', { username: user.username, email: user.email, password: user.password, role: user.role, barangayId: user.barangayId });
      const response = await apiPost('/api/users', {
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        barangayId: user.barangayId || null,
      });
      
      console.log('✅ User created on backend:', response.username, 'email:', response.email, 'role:', response.role, 'barangayId:', response.barangayId);
      
      const newUser: SystemUser = {
        id: response.id,
        username: response.username,
        email: response.email || user.email || '',
        role: response.role,
        barangayId: response.barangayId,
        isActive: true,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        token: '',
      };
      
      await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Create', entityType: 'User', entityId: newUser.id, purpose: 'Create User', details: { username: newUser.username, role: newUser.role, barangayId: newUser.barangayId } });
      return newUser;
    } catch (e) {
      console.error('❌ Failed to create user on backend:', e);
      throw e; // Re-throw so UI gets the error
    }
};

export const updateUser = async (id: string, user: Partial<Omit<SystemUser, 'token'>>): Promise<SystemUser> => {
    await simulateDelay(500);
    try {
      // Update user on backend using apiPut wrapper
      const response = await apiPut(`/api/users/${id}`, user);
      console.log('✅ User updated on backend:', response.username);
      const updatedUser: SystemUser = {
        id: response.id,
        username: response.username,
        email: response.email || '',
        role: response.role,
        barangayId: response.barangayId,
        isActive: response.isActive !== false,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        token: '',
      };
      await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'User', entityId: updatedUser.id, purpose: 'Update User', details: { changes: Object.keys(user) } });
      return updatedUser;
    } catch (e) {
      console.error('Failed to update user on backend:', e);
      // Fallback to shared store
      const updatedUser = await updateUserInShared(id, user as Partial<SystemUser>);
      if (!updatedUser) throw new Error('User not found');
      await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Update', entityType: 'User', entityId: updatedUser.id, purpose: 'Update User', details: { changes: Object.keys(user) } });
      return updatedUser;
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    await simulateDelay(500);
    try {
      // Delete user on backend
      await apiDelete(`/api/users/${id}`);
      console.log('✅ User deleted on backend:', id);
      await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'User', entityId: id, purpose: 'Delete User', details: {} });
    } catch (e) {
      console.error('Failed to delete user on backend:', e);
      // Fallback to shared store
      const deleted = await deleteUserFromShared(id);
      if (!deleted) throw new Error('User not found');
      await addLogToShared({ userId: 'admin-123', username: 'Admin User', action: 'Delete', entityType: 'User', entityId: id, purpose: 'Delete User', details: {} });
    }
};

// Logs
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  await simulateDelay(500);
  const logs = getSharedLogs();
  return logs.slice().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
