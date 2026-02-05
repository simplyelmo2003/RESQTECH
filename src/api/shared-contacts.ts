import { AdminEmergencyContact } from '@/types/admin';
import { apiPost, apiGet, apiPut, apiDelete } from './backend';

let SHARED_CONTACTS: AdminEmergencyContact[] = [];

export const loadSharedContacts = async (): Promise<AdminEmergencyContact[]> => {
  try {
    const contacts = await apiGet('/api/contacts');
    if (Array.isArray(contacts)) {
      SHARED_CONTACTS = contacts.map((c: any) => ({
        id: c.id,
        name: c.name,
        organization: c.organization || '',
        phoneNumber: c.phoneNumber || '',
        type: c.type || 'Others',
        description: c.description,
      }));
      console.log('📇 Loaded shared contacts from backend:', SHARED_CONTACTS.length);
    }
  } catch (err) {
    console.error('Error loading shared contacts from backend:', err);
    SHARED_CONTACTS = [];
    // Don't re-throw; gracefully degrade to empty list
  }
  return SHARED_CONTACTS;
};

export const getSharedContacts = (): AdminEmergencyContact[] => {
  return SHARED_CONTACTS;
};

export const addSharedContact = async (contact: Omit<AdminEmergencyContact, 'id'>): Promise<AdminEmergencyContact> => {
  const created = await apiPost('/api/contacts', contact);
  const newContact: AdminEmergencyContact = {
    id: created.id,
    ...contact,
  };
  SHARED_CONTACTS.push(newContact);
  console.log('✅ Added contact to shared store:', newContact.id);
  return newContact;
};

export const updateContactInShared = async (id: string, updates: Partial<AdminEmergencyContact>): Promise<AdminEmergencyContact | null> => {
  const updated = await apiPut(`/api/contacts/${id}`, updates);
  if (!updated) return null;
  
  const index = SHARED_CONTACTS.findIndex(c => c.id === id);
  const mappedUpdate: AdminEmergencyContact = {
    id: updated.id,
    ...updated,
  };
  if (index !== -1) {
    SHARED_CONTACTS[index] = mappedUpdate;
  }
  console.log('✏️ Updated contact in shared store:', id);
  return mappedUpdate;
};

export const deleteContactFromShared = async (id: string): Promise<boolean> => {
  await apiDelete(`/api/contacts/${id}`);
  const index = SHARED_CONTACTS.findIndex(c => c.id === id);
  if (index !== -1) {
    SHARED_CONTACTS.splice(index, 1);
  }
  console.log('🗑️ Deleted contact from shared store:', id);
  return true;
};
