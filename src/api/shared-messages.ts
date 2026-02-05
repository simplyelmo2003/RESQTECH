import { formatISO } from 'date-fns';
import { safeFetch, checkBackend, apiPost } from './backend';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'barangay'; // admin or barangay official
  senderBarangayId?: string; // if barangay official, which barangay
  recipientRole: 'admin' | 'barangay' | 'all'; // who receives this
  recipientBarangayId?: string; // if sending to specific barangay
  subject: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string;
  type: 'alert' | 'coordination' | 'report' | 'general'; // message type
}

let SHARED_MESSAGES: Message[] = [];

// Load from backend only (backend-authoritative)
export const loadSharedMessages = async () => {
  try {
    const ok = await checkBackend();
    if (!ok) {
      console.warn('⚠️ Backend unavailable; messages will be empty');
      SHARED_MESSAGES = [];
      return SHARED_MESSAGES;
    }
    const msgs = await safeFetch('/api/messages');
    if (Array.isArray(msgs)) {
      SHARED_MESSAGES = msgs.map((m: any) => {
        // Extract barangayId from conversationId if present (e.g., "conv-brgy-mat-i" → "mat-i")
        let inferredBarangayId: string | undefined = undefined;
        if (m.conversationId && m.conversationId.startsWith('conv-brgy-')) {
          inferredBarangayId = m.conversationId.replace('conv-brgy-', '');
        }
        
        return {
          id: m.id,
          senderId: m.sender || m.senderId || 'system',
          senderName: m.sender || m.senderName || 'System',
          senderRole: m.senderRole || 'admin',
          senderBarangayId: m.senderBarangayId || inferredBarangayId,
          recipientRole: m.recipientRole || 'all',
          recipientBarangayId: m.recipientBarangayId || inferredBarangayId,
          subject: m.subject || '',
          content: m.body ?? m.content ?? '',
          sentAt: m.createdAt ?? formatISO(new Date()),
          isRead: m.isRead ?? false,
          type: m.type || 'general',
        };
      });
      console.log('📨 Loaded messages from backend:', SHARED_MESSAGES.length);
    }
  } catch (e) {
    console.error('Failed to load messages from backend:', e);
    SHARED_MESSAGES = [];
  }
  return SHARED_MESSAGES;
};


// Initialize on module load
(async () => {
  await loadSharedMessages();
})();

export const getSharedMessages = (): Message[] => {
  return SHARED_MESSAGES;
};

export const sendMessage = async (message: Omit<Message, 'id' | 'sentAt' | 'readAt'>): Promise<Message> => {
  const payload = { conversationId: 'global', sender: message.senderName, body: message.content };
  try {
    const created = await apiPost('/api/messages', payload);
    const mapped: Message = {
      id: created.id,
      senderId: created.senderId ?? message.senderId,
      senderName: created.senderName ?? message.senderName,
      senderRole: created.senderRole ?? message.senderRole,
      senderBarangayId: created.senderBarangayId ?? message.senderBarangayId,
      recipientRole: created.recipientRole ?? message.recipientRole,
      recipientBarangayId: created.recipientBarangayId ?? message.recipientBarangayId,
      subject: created.subject ?? message.subject,
      content: created.body ?? created.content ?? message.content,
      sentAt: created.createdAt ?? formatISO(new Date()),
      isRead: created.isRead ?? false,
      type: created.type ?? message.type,
    };
    SHARED_MESSAGES.push(mapped);
    console.log('📨 Message sent (synced with backend):', mapped.id);
    return mapped;
  } catch (e) {
    console.error('Failed to send message to backend:', e);
    throw e;
  }
};

export const markMessageAsRead = (messageId: string): boolean => {
  const message = SHARED_MESSAGES.find(m => m.id === messageId);
  if (!message) return false;
  message.isRead = true;
  message.readAt = formatISO(new Date());
  console.log('✅ Message marked as read:', messageId);
  return true;
};

export const deleteMessage = (messageId: string): boolean => {
  const index = SHARED_MESSAGES.findIndex(m => m.id === messageId);
  if (index === -1) return false;
  SHARED_MESSAGES.splice(index, 1);
  console.log('🗑️ Message deleted:', messageId);
  return true;
};

export const getMessagesForAdmin = (barangayId?: string): Message[] => {
  // If admin is assigned to a specific barangay, they ONLY see messages for that barangay
  if (barangayId) {
    const filtered = SHARED_MESSAGES.filter(m => {
      // Messages sent TO this barangay's admin
      if (m.recipientRole === 'admin' && (!m.recipientBarangayId || m.recipientBarangayId === barangayId)) {
        console.log(`✅ Admin(${barangayId}): Message TO admin for this barangay`);
        return true;
      }
      // Messages sent by barangays to this admin
      if (m.recipientRole === 'barangay' && m.recipientBarangayId === barangayId) {
        console.log(`✅ Admin(${barangayId}): Message FROM barangay ${barangayId}`);
        return true;
      }
      // Messages from this barangay to admin
      if (m.senderRole === 'barangay' && m.senderBarangayId === barangayId) {
        console.log(`✅ Admin(${barangayId}): Outgoing from ${barangayId}`);
        return true;
      }
      
      // REJECT messages from other barangays
      if (m.senderRole === 'barangay' && m.senderBarangayId && m.senderBarangayId !== barangayId) {
        console.log(`❌ Admin(${barangayId}) REJECTED: Message from different barangay: ${m.senderBarangayId}`);
        return false;
      }
      if (m.recipientRole === 'barangay' && m.recipientBarangayId && m.recipientBarangayId !== barangayId) {
        console.log(`❌ Admin(${barangayId}) REJECTED: Message to different barangay: ${m.recipientBarangayId}`);
        return false;
      }
      
      console.log(`❌ Admin(${barangayId}) REJECTED: Other message type`);
      return false;
    });
    
    console.log(`📋 Admin(${barangayId}): Filtering ${SHARED_MESSAGES.length} total → ${filtered.length} visible`);
    return filtered;
  }
  
  // Super-admin (no barangayId) sees all admin and broadcast messages
  console.log(`📋 Super-Admin: All admin and broadcast messages`);
  return SHARED_MESSAGES.filter(m => m.recipientRole === 'admin' || m.recipientRole === 'all');
};

export const getMessagesForBarangay = (barangayId: string): Message[] => {
  const filtered = SHARED_MESSAGES.filter(m => {
    // RULE 1: Only show messages SENT TO this specific barangay
    if (m.recipientRole === 'barangay' && m.recipientBarangayId === barangayId) {
      console.log(`✅ ${barangayId}: Message TO this barangay from admin`);
      return true;
    }
    
    // RULE 2: Only show messages SENT BY this barangay to admin
    if (m.senderRole === 'barangay' && m.senderBarangayId === barangayId && m.recipientRole === 'admin') {
      console.log(`✅ ${barangayId}: Message FROM this barangay to admin`);
      return true;
    }
    
    // REJECT EVERYTHING ELSE - ensure NO cross-barangay leakage
    if (m.senderRole === 'barangay' && m.senderBarangayId && m.senderBarangayId !== barangayId) {
      console.log(`❌ ${barangayId} REJECTED: Message from different barangay: ${m.senderBarangayId}`);
      return false;
    }
    if (m.recipientRole === 'barangay' && m.recipientBarangayId && m.recipientBarangayId !== barangayId) {
      console.log(`❌ ${barangayId} REJECTED: Message to different barangay: ${m.recipientBarangayId}`);
      return false;
    }
    if (m.recipientRole === 'all' && (m.senderBarangayId || m.recipientBarangayId)) {
      console.log(`❌ ${barangayId} REJECTED: Broadcast with barangay context`);
      return false;
    }
    
    console.log(`❌ ${barangayId} REJECTED: Unknown message type`);
    return false;
  });
  
  console.log(`📋 ${barangayId}: Filtering ${SHARED_MESSAGES.length} total → ${filtered.length} visible messages`);
  return filtered;
};

export const getUnreadCount = (messages: Message[]): number => {
  return messages.filter(m => !m.isRead).length;
};
