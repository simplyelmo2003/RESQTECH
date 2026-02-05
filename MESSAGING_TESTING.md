# Messaging System Testing Guide

## Quick Start

### 1. Access the Messaging Feature

**For Admin:**
- Go to Admin Dashboard (`/admin/dashboard`)
- Scroll to bottom of page
- See "Messages" card with messaging interface

**For Barangay:**
- Go to Barangay Dashboard (`/barangay/dashboard`)
- Scroll to bottom of page
- See "Messages from Admin" card with messaging interface

### 2. Send a Message (Admin)

1. Click **"✉️ New Message"** button in Messages card
2. Select **Message Type**: Alert, Coordination, Report, or General
3. Select **Send To**: 
   - "All Barangays" (broadcast to everyone)
   - "Specific Barangay" (choose one from dropdown)
4. Fill **Subject** (required) - e.g., "Evacuation Order"
5. Fill **Message** (required) - detailed instructions
6. Click **"📤 Send"**
7. See success notification: "Message sent successfully!"
8. Message appears in your inbox with ✅ read status

### 3. Receive a Message (Barangay)

**For Admin Message to Specific Barangay:**
1. Barangay official opens their dashboard
2. In Messages section, new message appears with 🔵 unread indicator (blue dot)
3. Click message to see full content
4. Click **"Mark Read"** button
5. 🔵 indicator disappears, message background returns to white

**For Admin Broadcast Message:**
1. All barangay officials see same message
2. Each can mark as read independently
3. Unread count shows at top

### 4. Send a Reply (Barangay → Admin)

1. Barangay official clicks **"✉️ Reply to Admin"** button
2. Select **Message Type**: Alert, Coordination, Report, or General
3. Fill **Subject** - e.g., "Status Update: Evacuation Center X Full"
4. Fill **Message** - provide update
5. Click **"📤 Send to Admin"**
6. See success notification
7. Message immediately appears in barangay's inbox (read status: ✅)

### 5. Receive Reply (Admin)

1. Admin opens dashboard
2. In Messages section, new barangay message appears with:
   - Sender name and role: "Barangay Official" (barangay)
   - Message type badge
   - 🔵 unread indicator
3. Click message to view full content in modal
4. See sender info, timestamp, message type
5. Click **"Mark as Read"** to update status

## Message Lifecycle

### New Message
```
Unread Count: 1 ➜ Sender: [Name] | Role: [admin/barangay] | Type: [badge]
                ➜ Subject: [Subject]
                ➜ Preview: [First 2 lines of content...]
                ➜ Timestamp: [Date & Time]
                ➜ Actions: [Mark Read] [Delete]
                ➜ Visual: Blue background (unread), Red dot indicator
```

### Read Message
```
Unread Count: 0 ➜ White background
                ➜ Red dot removed
                ➜ [Mark Read] button disappears
                ➜ Can still click to view details
```

### Deleted Message
```
Message removed from inbox
Success notification: "Message deleted"
Cannot be recovered
```

## Message Details Modal

When clicking a message:
1. Modal opens with subject as title
2. Shows sender info box:
   - From: [Sender Name] ([admin/barangay])
   - Time: [Full timestamp]
   - Type: [Message Type]
3. Full message content in scrollable area
4. Two options:
   - **Mark as Read**: Updates read status and closes modal
   - **Close**: Just closes modal without changing status

## Real-Time Updates

### Scenario 1: Two Browser Windows (Same User)
1. Open admin dashboard in Window A
2. Open admin dashboard in Window B
3. In Window A, send message to barangay
4. In Window B, Messages card automatically refreshes
5. New message appears without page reload ✅

### Scenario 2: Two Users (Admin + Barangay)
1. Admin has dashboard open in Browser A
2. Barangay has dashboard open in Browser B
3. Admin sends message to that barangay
4. Barangay's dashboard (Browser B) immediately updates ✅
5. New message appears in Barangay's inbox
6. Barangay replies
7. Admin's dashboard (Browser A) immediately updates ✅

### Scenario 3: Page Reload
1. Admin sends message
2. Barangay refreshes page
3. Message is still there (localStorage persistence) ✅

## Expected Behavior

### Unread Count Badge
- Shows number of unread messages
- Only visible if > 0
- Red background with white text
- Example: `(3 unread)` next to Messages title

### Message Statuses
- **Unread**: Blue background `bg-blue-50`, blue border `border-blue-300`, red dot `🔵`
- **Read**: White background `bg-white`, gray border `border-gray-200`, no dot
- **Hover**: Light gray background on any message

### Message Type Badges
- **Alert** 🚨: `bg-blue-100 text-blue-800`
- **Coordination** 🤝: `bg-orange-100 text-orange-800`
- **Report** 📋: `bg-green-100 text-green-800`
- **General** 💬: `bg-gray-100 text-gray-800`

## Common Test Cases

### Test 1: Broadcast to All Barangays
**Steps:**
1. Admin sends message with "All Barangays" selected
2. Switch to Barangay Dashboard (any barangay)
3. Message should appear

**Expected Result:** Message visible to all barangay officials ✅

### Test 2: Targeted Message
**Steps:**
1. Admin sends message to "Brgy. Serna" specifically
2. Check Brgy. Serna dashboard → message appears
3. Check different barangay (Brgy. Rizal) → message does NOT appear

**Expected Result:** Only selected barangay sees message ✅

### Test 3: Reply Confirmation
**Steps:**
1. Barangay sends reply to admin
2. Check admin's Messages card
3. Message has sender role: "barangay"

**Expected Result:** Admin sees barangay's reply with correct sender info ✅

### Test 4: Read/Unread Toggle
**Steps:**
1. Admin sends message to barangay
2. Barangay sees message with blue background + red dot
3. Barangay clicks "Mark Read"
4. Background turns white, red dot disappears
5. Unread count decreases

**Expected Result:** Visual feedback changes appropriately ✅

### Test 5: Delete Message
**Steps:**
1. Barangay receives message
2. Clicks "Delete" button
3. Confirmation modal appears: "Are you sure you want to delete this message?"
4. Click "Delete" to confirm
5. Message removed from list

**Expected Result:** Message deleted with success notification ✅

### Test 6: Form Validation
**Steps:**
1. Click "New Message" / "Reply to Admin"
2. Leave Subject or Message empty
3. Click Send

**Expected Result:** Error notification: "Please fill in subject and content" ✅

### Test 7: Barangay Dropdown (Admin)
**Steps:**
1. Admin selects "Specific Barangay" in Send To
2. Barangay dropdown appears
3. Select any barangay from list
4. Barangay name displays correctly

**Expected Result:** Dropdown populated with all 54 barangays, selection works ✅

## Debugging

### Check localStorage
Open browser Developer Tools (F12):
```javascript
// In Console tab:
JSON.parse(localStorage.getItem('SHARED_MESSAGES_V1'))
```

Should show array of message objects.

### Check Component State
In React DevTools:
1. Find AdminMessenger or BarangayMessenger component
2. Check `messages` state: should be array
3. Check `loading` state: should be false when loaded
4. Check unread count badge value

### Check Real-Time Updates
1. Open two browser windows side-by-side
2. Open Console in both (F12)
3. Send message in first window
4. In second window console, see: "🔄 Messages updated, refetching..."
5. Messages card refreshes automatically

### Common Issues

**Issue: Messages not appearing**
- Solution 1: Check localStorage key - should be `SHARED_MESSAGES_V1`
- Solution 2: Verify recipientBarangayId matches current barangay
- Solution 3: Check if senderRole and recipientRole are set correctly
- Solution 4: Clear localStorage and try again

**Issue: Real-time updates not working**
- Solution 1: Verify browser supports StorageEvent
- Solution 2: Check that storage listener is registered (should see console logs)
- Solution 3: Try sending from different browser tab to test cross-tab sync

**Issue: Form not submitting**
- Solution 1: Check Subject and Message fields not empty
- Solution 2: If targeting specific barangay, ensure one is selected
- Solution 3: Check browser console for errors

## Performance Notes

- Messages loaded once on mount
- Real-time updates via storage listener (event-driven, not polling)
- Max message list size: Scrollable, shows ~5-10 messages per screen
- Archive old messages if inbox grows beyond 100 messages

## Feature Completeness Checklist

✅ Send message (admin to barangay)
✅ Send message (admin broadcast to all)
✅ Send message (barangay to admin)
✅ Receive message (real-time)
✅ View message details
✅ Mark as read/unread
✅ Delete message
✅ Message type selector
✅ Unread count badge
✅ Sender info display
✅ Recipient filtering
✅ localStorage persistence
✅ Real-time storage listener
✅ Form validation
✅ Error notifications
✅ Loading states
✅ Empty state (no messages)

## Next Phase (Optional Enhancements)

- [ ] Message search filter
- [ ] Sort by date/sender/type
- [ ] Message categories/tags
- [ ] Scheduled messages
- [ ] Message templates
- [ ] Attachments support
- [ ] Bulk send
- [ ] Message expiry/archive
