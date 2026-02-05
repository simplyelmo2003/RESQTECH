import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { SURIGAO_CITY_BARANGAYS } from '@/lib/barangayData';
import {
  getAdminConversations,
  getConversationMessages,
  sendConversationMessage,
  createConversation,
  loadConversations,
  Conversation,
  ConversationMessage,
} from '@/api/conversations';
import { format, parseISO } from 'date-fns';

const AdminCommunication: React.FC = () => {
  const [selectedBarangayId, setSelectedBarangayId] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const barangayOptions = SURIGAO_CITY_BARANGAYS.map(b => ({
    value: b.id,
    label: b.displayName,
  }));

  const handleBarangaySelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const barangayId = event.target.value;
    setSelectedBarangayId(barangayId);
    setLoading(true);
    
    try {
      // Refresh conversations from database
      await loadConversations();
      
      // Check if conversation exists
      let conv = getAdminConversations(barangayId)[0];
      
      // If not, create one
      if (!conv) {
        const barangay = SURIGAO_CITY_BARANGAYS.find(b => b.id === barangayId);
        conv = await createConversation(undefined, barangayId, barangay?.displayName || barangayId);
      }
      
      setConversation(conv);
      const msgs = getConversationMessages(conv.id);
      setMessages(msgs);
      console.log(`📨 Admin: Selected barangay ${barangayId}, loaded ${msgs.length} messages`);
    } catch (err) {
      console.error('Failed to select barangay:', err);
      addNotification({ type: 'error', message: 'Failed to load conversation' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      addNotification({ type: 'error', message: 'Please enter a message' });
      return;
    }

    if (!conversation) {
      addNotification({ type: 'error', message: 'Please select a barangay first' });
      return;
    }

    try {
      await sendConversationMessage(conversation.id, {
        senderId: user?.id || 'admin-001',
        senderName: 'Administrator',
        senderRole: 'admin',
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
      const msgs = getConversationMessages(conversation.id);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to send message:', err);
      addNotification({ type: 'error', message: 'Failed to send message' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Barangay Selector */}
      <Card className="p-4 bg-gradient-to-r from-brand-navy to-brand-teal text-white">
        <label className="block text-sm font-semibold mb-2 text-black">Select Barangay to Message:</label>
        <Select
          id="admin-barangay-select"
          options={barangayOptions}
          value={selectedBarangayId}
          onChange={handleBarangaySelect}
          placeholder="Choose a barangay..."
          className="w-full text-black"
        />
      </Card>

      {/* Conversation Area */}
      {!selectedBarangayId ? (
        <Card className="p-8 text-center">
          <p className="text-black">Select a barangay to start messaging</p>
        </Card>
      ) : loading ? (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : conversation ? (
        <>
          {/* Conversation Header */}
          <Card className="!bg-black text-black p-4">
            <h2 className="text-xl font-bold text-black">
              Chat with {SURIGAO_CITY_BARANGAYS.find(b => b.id === selectedBarangayId)?.displayName}
            </h2>
            <p className="text-sm text-black">Conversation ID: {conversation.id}</p>
          </Card>

          {/* Messages Area */}
          <Card className="h-[400px] overflow-y-auto p-4 space-y-3 bg-black text-white">
            {messages.length === 0 ? (
              <div className="text-center text-white py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.senderRole === 'admin'
                      ? 'bg-brand-navy text-white ml-8'
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
                      msg.senderRole === 'admin' ? 'text-white opacity-70' : 'text-black'
                    }`}>
                      {format(parseISO(msg.sentAt), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  {msg.subject && <p className={`text-xs font-semibold mb-1 ${
                    msg.senderRole === 'admin' ? 'text-white' : 'text-black'
                  }`}>Subject: {msg.subject}</p>}
                  <p className={`text-sm ${
                    msg.senderRole === 'admin' ? 'text-white' : 'text-black'
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
              id="admin-message-input"
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
        </>
      ) : null}
    </div>
  );
};

export default AdminCommunication;
