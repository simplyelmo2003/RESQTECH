# Messaging & Coordination System

## Overview
The messaging system enables real-time coordination between admin and barangay officials through a localStorage-backed shared messaging store with real-time storage event listeners.

## Architecture

### 1. Shared Store: `src/api/shared-messages.ts`
Central repository for all messages with localStorage persistence and event dispatch.

**Message Interface:**
```typescript
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'barangay';
  barangayId?: string;
  recipientRole: 'admin' | 'barangay' | 'all';
  recipientBarangayId?: string;
  subject: string;
  content: string;
  sentAt: string; // ISO timestamp
  isRead: boolean;
  readAt?: string;
  type: 'alert' | 'coordination' | 'report' | 'general';
}
```

**Key Functions:**
- `loadSharedMessages()` - Retrieve all messages from localStorage
- `saveSharedMessages(messages)` - Save to localStorage + dispatch StorageEvent
- `sendMessage(message)` - Add new message and dispatch event
- `markMessageAsRead(messageId)` - Update read status
- `deleteMessage(messageId)` - Remove message
- `getMessagesForAdmin()` - Get all messages directed to admin
- `getMessagesForBarangay(barangayId)` - Get messages for specific barangay
- `getUnreadCount(messages)` - Count unread messages

**Data Flow:**
```
User Action → sendMessage()
  ↓
Add to localStorage (SHARED_MESSAGES_V1)
  ↓
dispatch(StorageEvent) [same-tab listener]
  ↓
Recipient component refetches via getMessages*() hook
  ↓
UI updates with new message
```

### 2. Admin Messenger: `src/components/admin/Messenger.tsx`
Full-featured messaging component for admin dashboard.

**Features:**
- Send messages to:
  - All barangays (broadcast)
  - Specific barangay (targeted)
- Message types: Alert, Coordination, Report, General
- View all received messages from barangays
- Mark messages as read/unread
- Delete messages
- Real-time updates via storage listener
- Unread count badge
- Message detail modal with sender info, timestamp, type

**Props:** None (uses context/hooks internally)

**Usage:**
```tsx
import AdminMessenger from '@/components/admin/Messenger';

<AdminMessenger />
```

### 3. Barangay Messenger: `src/components/barangay/Messenger.tsx`
Messaging component for barangay officials to communicate with admin.

**Features:**
- Send messages to admin
- Receive messages from admin (for their barangay)
- Message types: Alert, Coordination, Report, General
- Mark messages as read/unread
- Delete messages
- Real-time updates via storage listener
- Unread count badge

**Props:**
- `barangayId` (required): The barangay ID for filtering messages

**Usage:**
```tsx
import BarangayMessenger from '@/components/barangay/Messenger';

<BarangayMessenger barangayId="brgy-serna" />
```

## Integration

### Admin Dashboard
Added `AdminMessenger` component to `src/components/admin/AdminDashboardOverview.tsx`:
- Spans full width below statistics cards
- Shows all messages (admin receives from barangays + broadcasts to barangays)
- Always visible for real-time coordination

### Barangay Dashboard
Added `BarangayMessenger` component to `src/components/barangay/BarangayDashboardOverview.tsx`:
- Passes `user?.barangayId` as prop
- Shows messages for that specific barangay
- Allows rapid response to admin directives

## Communication Flows

### Admin → Single Barangay (Targeted)
1. Admin selects "Specific Barangay" in compose form
2. Chooses barangay from dropdown
3. Sends message with `recipientRole='barangay'`, `recipientBarangayId='brgy-xxx'`
4. BarangayMessenger filters: `senderRole='admin' && recipientBarangayId matches`
5. Barangay official sees message immediately (real-time)

### Admin → All Barangays (Broadcast)
1. Admin selects "All Barangays" in compose form
2. Sends message with `recipientRole='barangay'` (no recipientBarangayId)
3. All BarangayMessenger instances receive message
4. All barangay officials see message simultaneously

### Barangay → Admin
1. Barangay official composes message in reply section
2. Sends with `senderRole='barangay'`, `recipientRole='admin'`, `barangayId=user.barangayId`
3. AdminMessenger filters: `recipientRole='admin' && senderRole='barangay'`
4. Admin sees message with barangay info immediately (real-time)

## Real-Time Synchronization

### Storage Listener Pattern
Both components implement:
```tsx
window.addEventListener('storage', (event: StorageEvent) => {
  if (event.key === 'SHARED_MESSAGES_V1') {
    // Refetch messages
    fetchMessages();
  }
});
```

This enables:
- **Cross-tab sync**: Changes in one tab immediately visible in another
- **Real-time updates**: When message sent, recipient's component refreshes automatically
- **No polling**: Event-driven architecture, zero latency

### Same-Tab Updates
StorageEvent intentionally NOT dispatched for same-tab changes (browser limitation). Therefore:
- Admin composes and sends → immediately shows in component state + localStorage
- Storage listener not triggered in same tab
- This is by design (localStorage events only fire cross-tab)
- UI updates are immediate due to local state management

## Message Types

| Type | Icon | Use Case |
|------|------|----------|
| Alert | 🚨 | Urgent safety notifications, emergencies |
| Coordination | 🤝 | Operational planning, instructions |
| Report | 📋 | Status updates, incident details |
| General | 💬 | Regular communication, feedback |

## UI Components Used
- `Card` - Message container layout
- `Button` - Compose, Send, Mark Read, Delete actions
- `Input/Textarea` - Compose form fields
- `Select` - Message type, recipient, barangay dropdown
- `ConfirmationModal` - Message detail view, delete confirmation
- `LoadingSpinner` - While fetching messages
- `Notification` - Feedback (sent, error, deleted)

## Database Persistence
- **Storage Key:** `SHARED_MESSAGES_V1` (localStorage)
- **Format:** JSON array of Message objects
- **Backup:** Messages persist across page reloads
- **Sync:** Automatic across same browser (multiple tabs)

## Error Handling
- Try-catch blocks in all message operations
- User notifications for success/error
- Graceful fallback to empty message list
- Console logging for debugging

## Future Enhancements
1. Message search/filter by sender, type, date
2. Threaded conversations (reply chains)
3. Attachments (photos, PDFs)
4. Message templates for common alerts
5. Delivery confirmation timestamps
6. Message expiry/auto-archive
7. Message categories (urgent, routine, etc.)
8. Bulk message sending
9. Scheduled messages
10. Message history export

## Testing Checklist
- [ ] Admin can send message to specific barangay
- [ ] Admin can broadcast message to all barangays
- [ ] Barangay receives admin message for their barangay only
- [ ] Barangay can reply to admin
- [ ] Admin receives reply from barangay with barangay name visible
- [ ] Mark message as read updates UI
- [ ] Delete message removes from list
- [ ] Real-time updates work in different tabs
- [ ] Unread count badge displays and updates correctly
- [ ] Messages persist after page reload
- [ ] Message details modal shows all info correctly
- [ ] Compose form validates required fields
- [ ] Message timestamps are correct
- [ ] Sender role displays correctly (admin/barangay)
