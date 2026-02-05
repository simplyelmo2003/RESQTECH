import { AdminEvacuationCenter } from '@/types/admin';
import { formatISO } from 'date-fns';
import { safeFetch, checkBackend, apiPost, apiPut, apiDelete } from './backend';

// Shared evacuation centers storage (backend-authoritative)
let SHARED_EVAC_CENTERS: AdminEvacuationCenter[] = [];

// Load from backend only
export const loadSharedEvacCenters = async () => {
  try {
    const ok = await checkBackend();
    if (!ok) {
      console.warn('⚠️ Backend unavailable; evac centers will be empty');
      SHARED_EVAC_CENTERS = [];
      return SHARED_EVAC_CENTERS;
    }
    const centers = await safeFetch('/api/evac-centers');
    if (Array.isArray(centers)) {
      // Map backend shape to AdminEvacuationCenter
      SHARED_EVAC_CENTERS = centers.map((c: any) => {
        // Parse services if it's a JSON string from backend
        let servicesArray: string[] = [];
        if (c.services) {
          if (typeof c.services === 'string') {
            try {
              servicesArray = JSON.parse(c.services);
            } catch (e) {
              servicesArray = [];
            }
          } else if (Array.isArray(c.services)) {
            servicesArray = c.services;
          }
        }
        
        return {
          id: c.id,
          name: c.name,
          address: c.address || '',
          location: { lat: c.lat ?? c.location?.lat ?? 0, lng: c.lng ?? c.location?.lng ?? 0 },
          capacity: c.capacity ?? 0,
          currentOccupancy: c.currentOccupancy ?? 0,
          contact: c.contact ?? '',
          status: c.status ?? 'Open',
          barangayId: c.barangayId ?? '',
          services: servicesArray as any,
          imageUrl: c.imageUrl ?? '',
          lastUpdated: c.lastUpdated ?? formatISO(new Date()),
        };
      });
      console.log('📦 Loaded evacuation centers from backend:', SHARED_EVAC_CENTERS.length);
      // Debug: show raw backend objects for inspection (services shape)
      try {
        console.debug('📦 Raw backend evac-centers payload (sample 5):', centers.slice(0, 5));
      } catch (e) { /* ignore logging errors */ }
    }
  } catch (e) {
    console.error('Failed to load evacuation centers from backend:', e);
    SHARED_EVAC_CENTERS = [];
  }
  return SHARED_EVAC_CENTERS;
};


// Initialize on module load
(async () => {
  await loadSharedEvacCenters();
})();

// No longer listening for localStorage storage events

export const getSharedEvacCenters = (): AdminEvacuationCenter[] => {
  console.log('📦 getSharedEvacCenters called - returning', SHARED_EVAC_CENTERS.length, 'centers:', SHARED_EVAC_CENTERS.map(c => ({ id: c.id, name: c.name, status: c.status, lat: c.location.lat, lng: c.location.lng })));
  return SHARED_EVAC_CENTERS;
};

export const addEvacuationCenter = async (center: Omit<AdminEvacuationCenter, 'id' | 'lastUpdated'>): Promise<AdminEvacuationCenter> => {
  const payload = {
    name: center.name,
    address: center.address,
    lat: center.location.lat,
    lng: center.location.lng,
    capacity: center.capacity,
    currentOccupancy: center.currentOccupancy,
    contact: center.contact,
    status: center.status,
    barangayId: center.barangayId,
    services: center.services,
    imageUrl: center.imageUrl,
  };
  try {
    console.debug('📨 [addEvacuationCenter] Sending payload to backend:', payload);
    const created = await apiPost('/api/evac-centers', payload);
    console.debug('🟢 [addEvacuationCenter] Backend response (created):', created);
    
    // Parse services if it's a JSON string from backend
    let servicesArray: string[] = [];
    if (created.services) {
      if (typeof created.services === 'string') {
        try {
          servicesArray = JSON.parse(created.services);
        } catch (e) {
          servicesArray = [];
        }
      } else if (Array.isArray(created.services)) {
        servicesArray = created.services;
      }
    }
    
    const mapped: AdminEvacuationCenter = {
      id: created.id,
      name: created.name,
      address: created.address ?? '',
      location: { lat: created.lat ?? 0, lng: created.lng ?? 0 },
      capacity: created.capacity ?? 0,
      currentOccupancy: created.currentOccupancy ?? 0,
      contact: created.contact ?? '',
      status: created.status ?? 'Open',
      barangayId: created.barangayId ?? '',
      services: servicesArray as any,
      imageUrl: created.imageUrl ?? '',
      lastUpdated: created.lastUpdated ?? formatISO(new Date()),
    };
    SHARED_EVAC_CENTERS.unshift(mapped);
    console.log('✅ Added evacuation center (synced with backend):', mapped.id);
    return mapped;
  } catch (e) {
    console.error('Failed to add evacuation center to backend:', e);
    throw e;
  }
};

export const updateEvacCenterInShared = async (id: string, updates: Partial<AdminEvacuationCenter>): Promise<AdminEvacuationCenter | null> => {
  const index = SHARED_EVAC_CENTERS.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  const payload = {
    name: updates.name ?? SHARED_EVAC_CENTERS[index].name,
    address: updates.address ?? SHARED_EVAC_CENTERS[index].address,
    lat: updates.location?.lat ?? SHARED_EVAC_CENTERS[index].location.lat,
    lng: updates.location?.lng ?? SHARED_EVAC_CENTERS[index].location.lng,
    capacity: updates.capacity ?? SHARED_EVAC_CENTERS[index].capacity,
    currentOccupancy: updates.currentOccupancy ?? SHARED_EVAC_CENTERS[index].currentOccupancy,
    contact: updates.contact ?? SHARED_EVAC_CENTERS[index].contact,
    status: updates.status ?? SHARED_EVAC_CENTERS[index].status,
    barangayId: updates.barangayId ?? SHARED_EVAC_CENTERS[index].barangayId,
    services: updates.services ?? SHARED_EVAC_CENTERS[index].services,
    imageUrl: updates.imageUrl ?? SHARED_EVAC_CENTERS[index].imageUrl,
  };
  
  try {
    console.debug('📨 [updateEvacCenterInShared] Sending payload to backend for id', id, payload);
    const updated = await apiPut(`/api/evac-centers/${id}`, payload);
    console.debug('🟡 [updateEvacCenterInShared] Backend response (updated):', updated);
    
    // Parse services if it's a JSON string from backend
    let servicesArray: string[] = [];
    if (updated.services) {
      if (typeof updated.services === 'string') {
        try {
          servicesArray = JSON.parse(updated.services);
        } catch (e) {
          servicesArray = [];
        }
      } else if (Array.isArray(updated.services)) {
        servicesArray = updated.services;
      }
    }
    
    const mapped: AdminEvacuationCenter = {
      id: updated.id,
      name: updated.name,
      address: updated.address ?? '',
      location: { lat: updated.lat ?? 0, lng: updated.lng ?? 0 },
      capacity: updated.capacity ?? 0,
      currentOccupancy: updated.currentOccupancy ?? 0,
      contact: updated.contact ?? '',
      status: updated.status ?? 'Open',
      barangayId: updated.barangayId ?? '',
      services: servicesArray as any,
      imageUrl: updated.imageUrl ?? '',
      lastUpdated: updated.lastUpdated ?? formatISO(new Date()),
    };
    SHARED_EVAC_CENTERS[index] = mapped;
    console.log('✏️ Updated evacuation center (synced with backend):', id);
    return mapped;
  } catch (e) {
    console.error('Failed to update evacuation center on backend:', e);
    throw e;
  }
};

export const deleteEvacCenterFromShared = async (id: string): Promise<boolean> => {
  const index = SHARED_EVAC_CENTERS.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  try {
    await apiDelete(`/api/evac-centers/${id}`);
    SHARED_EVAC_CENTERS.splice(index, 1);
    console.log('🗑️ Deleted evacuation center (synced with backend):', id);
    return true;
  } catch (e) {
    console.error('Failed to delete evacuation center from backend:', e);
    throw e;
  }
};
