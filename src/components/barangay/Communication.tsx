import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { SURIGAO_CITY_BARANGAYS } from '@/lib/barangayData';
import {
  getBarangayConversation,
  getConversationMessages,
  sendConversationMessage,
  createConversation,
  loadConversations,
  Conversation,
  ConversationMessage,
} from '@/api/conversations';
import { format, parseISO } from 'date-fns';

const BarangayCommunication: React.FC<{ barangayId: string }> = ({ barangayId }) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('admin');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const { addNotification } = useNotification();
  const { user } = useAuth();

  // Create recipient options: Admin + other barangays (excluding current)
  const recipientOptions = [
    { value: 'admin', label: 'Admin' },
    ...SURIGAO_CITY_BARANGAYS
      .filter(b => b.id !== barangayId)
      .map(b => ({ value: b.id, label: b.displayName }))
  ];

  const handleRecipientSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const recipientId = event.target.value;
    setSelectedRecipient(recipientId);
    setLoading(true);
    
    try {
      // Refresh conversations from database to get latest messages
      await loadConversations();
      
      let conv: Conversation | null = null;
      
      if (recipientId === 'admin') {
        // Get conversation with admin
        conv = getBarangayConversation(barangayId) || null;
        if (!conv) {
          // Create conversation with admin if it doesn't exist
          conv = await createConversation(undefined, barangayId, 'Admin');
        }
      } else {
        // Get or create conversation with another barangay
        // For barangay-to-barangay, sort IDs to ensure consistent conversation lookup
        const [adminId, participantId] = [barangayId, recipientId].sort();
        conv = getBarangayConversation(barangayId, recipientId) || null;
        if (!conv) {
          const recipientBarangay = SURIGAO_CITY_BARANGAYS.find(b => b.id === recipientId);
          conv = await createConversation(adminId, participantId, recipientBarangay?.displayName || recipientId);
        }
      }
      
      setConversation(conv);
      const msgs = getConversationMessages(conv.id, barangayId);
      setMessages(msgs);
      console.log(`📨 Barangay(${barangayId}): Selected recipient ${recipientId}, loaded ${msgs.length} messages`);
    } catch (err) {
      console.error('Failed to select recipient:', err);
      addNotification({ type: 'error', message: 'Failed to load conversation' });
    } finally {
      setLoading(false);
    }
  };

  // Load initial conversation with admin on mount
  useEffect(() => {
    const loadInitialConversation = async () => {
      setLoading(true);
      try {
        // Refresh conversations from database
        await loadConversations();
        
        let conv = getBarangayConversation(barangayId) || null;
        if (!conv) {
          conv = await createConversation(undefined, barangayId, 'Admin');
        }
        setConversation(conv);
        const msgs = getConversationMessages(conv.id, barangayId);
        setMessages(msgs);
        console.log(`📨 Barangay(${barangayId}): Initial load - conversation with admin, ${msgs.length} messages`);
      } catch (err) {
        console.error('Failed to load initial conversation:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialConversation();
  }, [barangayId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      addNotification({ type: 'error', message: 'Please enter a message' });
      return;
    }

    if (!conversation) {
      addNotification({ type: 'error', message: 'Please select a recipient first' });
      return;
    }

    try {
      const barangayDisplayName = SURIGAO_CITY_BARANGAYS.find(b => b.id === barangayId)?.displayName || barangayId;
      
      await sendConversationMessage(conversation.id, {
        senderId: user?.id || `barangay-${barangayId}`,
        senderName: `${barangayDisplayName} Barangay Official`,
        senderRole: 'barangay',
        senderBarangayId: barangayId,
        content: messageContent,
        subject: subject || undefined,
        isRead: false,
        type: 'message',
      });

      addNotification({ type: 'success', message: 'Message sent!' });
      setMessageContent('');
      setSubject('');
      
      // Reload conversations and messages
      await loadConversations();
      const msgs = getConversationMessages(conversation.id, barangayId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to send message:', err);
      addNotification({ type: 'error', message: 'Failed to send message' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <Card className="p-8 text-center">
        <p className="text-black mb-4">No communication channel opened yet.</p>
        <p className="text-sm text-black">Wait for admin to initiate communication.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recipient Selector */}
      <Card className="p-4 bg-gradient-to-r from-brand-navy to-brand-teal text-white">
        <label className="block text-sm font-semibold mb-2 text-black">Select Recipient:</label>
        <Select
          id="barangay-recipient-select"
          options={recipientOptions}
          value={selectedRecipient}
          onChange={handleRecipientSelect}
          placeholder="Choose recipient..."
          className="w-full text-black"
        />
      </Card>

      {/* Conversation Header */}
      <Card className="!bg-black text-black p-4">
        <h2 className="text-xl font-bold text-black">
          Chat with {selectedRecipient === 'admin' ? 'Admin' : SURIGAO_CITY_BARANGAYS.find(b => b.id === selectedRecipient)?.displayName}
        </h2>
        <p className="text-sm text-black">
          {selectedRecipient === 'admin' ? 'Direct communication channel' : `Conversation with ${SURIGAO_CITY_BARANGAYS.find(b => b.id === selectedRecipient)?.displayName}`}
        </p>
      </Card>

      {/* Messages Area */}
      <Card className="h-[400px] overflow-y-auto p-4 space-y-3 bg-black text-black">
        {messages.length === 0 ? (
          <div className="text-center text-black py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.senderRole === 'barangay'
                  ? 'bg-brand-teal text-black ml-8'
                  : 'bg-white border border-gray-200 mr-8 text-black'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">
                  {msg.senderRole === 'admin' 
                    ? 'Administrator' 
                    : msg.senderRole === 'barangay' 
                      ? `${SURIGAO_CITY_BARANGAYS.find(b => b.id === msg.senderBarangayId)?.displayName || msg.senderBarangayId} Barangay Official`
                      : msg.senderName
                  }
                </span>
                <span className={`text-xs ${
                  msg.senderRole === 'barangay' ? 'opacity-70' : 'text-black'
                }`}>
                  {format(parseISO(msg.sentAt), 'MMM dd, HH:mm')}
                </span>
              </div>
              {msg.subject && <p className={`text-xs font-semibold mb-1 ${
                msg.senderRole === 'barangay' ? 'text-white' : 'text-black'
              }`}>Subject: {msg.subject}</p>}
              <p className={`text-sm ${
                msg.senderRole === 'barangay' ? 'text-white' : 'text-black'
              }`}>{msg.content}</p>
            </div>
          ))
        )}
      </Card>

      {/* Message Input */}
      <Card className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
        />
        <Textarea
          id="barangay-message-input"
          placeholder="Type your message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          rows={3}
          className="w-full"
        />
        <Button onClick={handleSendMessage} variant="primary" className="w-full">
          Send Message
        </Button>
      </Card>
    </div>
  );
};

export default BarangayCommunication;
