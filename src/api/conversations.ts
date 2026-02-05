import { formatISO } from 'date-fns';
import { safeFetch, checkBackend, apiPost } from './backend';

export interface Conversation {
  id: string;
  adminBarangayId?: string; // for admin conversations
  participantBarangayId: string; // the other party
  participantName: string; // display name
  lastMessageAt: string;
  unreadCount: number;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'barangay';
  senderBarangayId?: string;
  content: string;
  subject?: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string;
  type: 'message' | 'alert' | 'report';
}

let CONVERSATIONS: Conversation[] = [];
let CONVERSATION_MESSAGES: ConversationMessage[] = [];

// Load conversations from backend
export const loadConversations = async () => {
  try {
    const ok = await checkBackend();
    if (!ok) {
      console.warn('⚠️ Backend unavailable');
      CONVERSATIONS = [];
      CONVERSATION_MESSAGES = [];
      return;
    }
    
    const msgs = await safeFetch('/api/messages');
    if (Array.isArray(msgs)) {
      // Clear existing data and rebuild from database
      CONVERSATIONS = [];
      CONVERSATION_MESSAGES = [];
      
      // Map messages to conversations
      const conversationMap = new Map<string, Conversation>();
      
      msgs.forEach((m: any) => {
        const mapped: ConversationMessage = {
          id: m.id,
          conversationId: m.conversationId || `conv-${m.senderId}-${m.recipientRole}`,
          senderId: m.senderId || 'system',
          senderName: m.sender === 'Administrator' || m.sender === 'System' ? 'Administrator' : m.sender,
          senderRole: m.senderRole || (m.sender === 'Administrator' || m.sender === 'System' ? 'admin' : 'barangay'),
          senderBarangayId: m.barangayId || ((m.sender !== 'Administrator' && m.sender !== 'System') ? m.conversationId?.split('-')[2] : undefined),
          content: m.body ?? m.content ?? '',
          subject: m.subject,
          sentAt: m.createdAt ?? formatISO(new Date()),
          isRead: m.isRead ?? false,
          readAt: m.readAt,
          type: m.type || 'message',
        };
        
        CONVERSATION_MESSAGES.push(mapped);
        
        // Build conversation entry
        const convId = mapped.conversationId;
        if (!conversationMap.has(convId)) {
          let barangayId: string | undefined;
          let secondBarangayId: string | undefined;
          
          if (convId.includes('--')) {
            // Barangay-to-barangay conversation: conv-{timestamp}-{barangay1}--{barangay2}
            const parts = convId.split('--');
            if (parts.length >= 2) {
              const firstPart = parts[0]; // conv-{timestamp}-{barangay1}
              const secondPart = parts[1]; // {barangay2}
              
              const firstPartParts = firstPart.split('-');
              if (firstPartParts.length >= 3) {
                barangayId = firstPartParts.slice(2).join('-'); // {barangay1}
                secondBarangayId = secondPart; // {barangay2}
              }
            }
          } else {
            // Admin-barangay or legacy conversation
            const convIdParts = convId?.split('-') || [];
            if (convIdParts.length >= 3 && /^\d+$/.test(convIdParts[1])) {
              // Has timestamp: conv-{timestamp}-{barangay}
              barangayId = convIdParts.slice(2).join('-');
            } else if (convIdParts.length >= 2) {
              // Legacy format: conv-barangay
              barangayId = convIdParts.slice(1).join('-');
            }
          }
          
          // Determine conversation type
          const isBarangayToBarangay = !!secondBarangayId;
          
          let participantBarangayId: string;
          let adminBarangayId: string | undefined;
          
          if (isBarangayToBarangay) {
            // Barangay-to-barangay conversation
            [adminBarangayId, participantBarangayId] = [barangayId!, secondBarangayId!].sort();
          } else {
            // Admin-barangay conversation
            participantBarangayId = barangayId || 'unknown';
            adminBarangayId = undefined;
          }
          
          const participantName = isBarangayToBarangay
            ? `${participantBarangayId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')} Barangay Official`
            : mapped.senderRole === 'admin' 
              ? 'ADMINISTRATOR' 
              : barangayId 
                ? `${barangayId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')} Barangay Official`
                : 'Unknown Sender';
              
          conversationMap.set(convId, {
            id: convId,
            adminBarangayId,
            participantBarangayId,
            participantName,
            lastMessageAt: mapped.sentAt,
            unreadCount: mapped.isRead ? 0 : 1,
          });
        } else {
          const conv = conversationMap.get(convId)!;
          conv.lastMessageAt = mapped.sentAt;
          if (!mapped.isRead) conv.unreadCount++;
        }
      });
      
      CONVERSATIONS = Array.from(conversationMap.values());
      console.log('📬 Loaded conversations:', CONVERSATIONS.length);
    }
  } catch (e) {
    console.error('Failed to load conversations:', e);
  }
};

// Initialize on module load
(async () => {
  await loadConversations();
})();

// Get conversations for admin (filtered by selected barangay if provided)
export const getAdminConversations = (selectedBarangayId?: string): Conversation[] => {
  if (!selectedBarangayId) {
    // Show all conversations if no barangay selected
    return CONVERSATIONS;
  }
  
  // Filter to only the selected barangay
  return CONVERSATIONS.filter(c => c.participantBarangayId === selectedBarangayId);
};

// Get conversation for barangay (with admin or another barangay)
export const getBarangayConversation = (barangayId: string, recipientId?: string): Conversation | undefined => {
  if (!recipientId || recipientId === 'admin') {
    // Find any conversation involving this barangay (for admin conversations)
    return CONVERSATIONS.find(c => c.participantBarangayId === barangayId && !c.adminBarangayId);
  } else {
    // Conversation between two barangays - find conversation that involves both barangays
    return CONVERSATIONS.find(c => 
      (c.adminBarangayId === barangayId && c.participantBarangayId === recipientId) ||
      (c.adminBarangayId === recipientId && c.participantBarangayId === barangayId) ||
      (c.participantBarangayId === barangayId && c.adminBarangayId === recipientId) ||
      (c.participantBarangayId === recipientId && c.adminBarangayId === barangayId)
    );
  }
};

// Get messages in a conversation (with strict filtering)
export const getConversationMessages = (conversationId: string, barangayId?: string): ConversationMessage[] => {
  let messages = CONVERSATION_MESSAGES.filter(m => m.conversationId === conversationId);
  
  // If barangayId provided, ensure all messages involve this barangay or the conversation includes it
  if (barangayId) {
    messages = messages.filter(m => 
      m.senderBarangayId === barangayId || 
      m.conversationId.includes(barangayId) ||
      m.senderRole === 'admin' // Include admin messages in barangay conversations
    );
    console.log(`📨 Barangay(${barangayId}): ${messages.length} messages in conversation`);
  }
  
  return messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
};

// Send message in a conversation
export const sendConversationMessage = async (
  conversationId: string,
  message: Omit<ConversationMessage, 'id' | 'conversationId' | 'sentAt' | 'readAt'>
): Promise<ConversationMessage> => {
  const payload = {
    conversationId,
    sender: message.senderName,
    body: message.content,
    senderName: message.senderName,
    senderRole: message.senderRole,
    senderBarangayId: message.senderBarangayId,
    subject: message.subject,
    type: message.type,
    isRead: message.isRead,
  };
  
  try {
    const created = await apiPost('/api/messages', payload);
    const mapped: ConversationMessage = {
      id: created.id,
      conversationId,
      senderId: created.senderId ?? message.senderId,
      senderName: created.senderName ?? message.senderName,
      senderRole: created.senderRole ?? message.senderRole,
      senderBarangayId: created.barangayId ?? message.senderBarangayId,
      content: created.body ?? created.content ?? message.content,
      subject: created.subject ?? message.subject,
      sentAt: created.createdAt ?? formatISO(new Date()),
      isRead: created.isRead ?? false,
      type: created.type ?? message.type,
    };
    
    CONVERSATION_MESSAGES.push(mapped);
    console.log(`💬 Message sent in conversation ${conversationId}`);
    return mapped;
  } catch (e) {
    console.error('Failed to send message:', e);
    throw e;
  }
};

// Mark message as read
export const markConversationMessageAsRead = (messageId: string): boolean => {
  const message = CONVERSATION_MESSAGES.find(m => m.id === messageId);
  if (!message) return false;
  message.isRead = true;
  message.readAt = formatISO(new Date());
  return true;
};

// Delete message
export const deleteConversationMessage = (messageId: string): boolean => {
  const index = CONVERSATION_MESSAGES.findIndex(m => m.id === messageId);
  if (index === -1) return false;
  CONVERSATION_MESSAGES.splice(index, 1);
  return true;
};

// Create new conversation (admin initiates with a barangay)
export const createConversation = async (adminBarangayId: string | undefined, participantBarangayId: string, participantName: string): Promise<Conversation> => {
  // For barangay-to-barangay conversations, use double dash separator
  const convId = adminBarangayId && adminBarangayId !== 'admin' && adminBarangayId.startsWith('brgy-')
    ? `conv-${Date.now()}-${adminBarangayId}--${participantBarangayId}`
    : `conv-${Date.now()}-${participantBarangayId}`;
  
  const conversation: Conversation = {
    id: convId,
    adminBarangayId,
    participantBarangayId,
    participantName,
    lastMessageAt: formatISO(new Date()),
    unreadCount: 0,
  };
  
  CONVERSATIONS.push(conversation);
  console.log(`✨ New conversation created: ${convId}`);
  return conversation;
};
