import { SystemUser } from '@/types/admin';
import { formatISO } from 'date-fns';
import { apiPost, apiGet, apiPut, apiDelete } from './backend';

let SHARED_USERS: SystemUser[] = [];

export const loadSharedUsers = async (): Promise<SystemUser[]> => {
  try {
    const users = await apiGet('/api/users');
    if (Array.isArray(users)) {
      SHARED_USERS = users.map((u: any) => ({
        id: u.id,
        username: u.username || u.name || u.email,
        email: u.email || '',
        role: u.role || 'admin',
        barangayId: u.barangayId,
        token: u.token || '',
        createdAt: u.createdAt || formatISO(new Date()),
        updatedAt: u.updatedAt || formatISO(new Date()),
        isActive: u.isActive ?? true,
      }));
      console.log('👥 Loaded shared users from backend:', SHARED_USERS.length);
    }
  } catch (err) {
    console.error('Error loading shared users from backend:', err);
    SHARED_USERS = [];
    throw err;
  }
  return SHARED_USERS;
};

export const getSharedUsers = (): SystemUser[] => SHARED_USERS;

export const addSharedUser = async (user: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt' | 'token'> & { password?: string }): Promise<SystemUser> => {
  const created = await apiPost('/api/users', user);
  const newUser: SystemUser = {
    ...user,
    id: created.id,
    createdAt: created.createdAt || formatISO(new Date()),
    updatedAt: created.updatedAt || formatISO(new Date()),
    token: created.token || '',
    isActive: true,
  } as SystemUser;
  SHARED_USERS.push(newUser);
  console.log('✅ Added user to shared store:', newUser.id);
  return newUser;
};

export const updateUserInShared = async (id: string, updates: Partial<SystemUser>): Promise<SystemUser | null> => {
  const updated = await apiPut(`/api/users/${id}`, updates);
  if (!updated) return null;
  
  const idx = SHARED_USERS.findIndex(u => u.id === id);
  const mappedUpdate: SystemUser = {
    ...updated,
    id: updated.id,
    updatedAt: formatISO(new Date()),
  } as SystemUser;
  if (idx !== -1) {
    SHARED_USERS[idx] = mappedUpdate;
  }
  console.log('✏️ Updated user in shared store:', id);
  return mappedUpdate;
};

export const deleteUserFromShared = async (id: string): Promise<boolean> => {
  await apiDelete(`/api/users/${id}`);
  const idx = SHARED_USERS.findIndex(u => u.id === id);
  if (idx !== -1) {
    SHARED_USERS.splice(idx, 1);
  }
  console.log('🗑️ Deleted user from shared store:', id);
  return true;
};
