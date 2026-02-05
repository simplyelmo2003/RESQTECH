import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminCommunication from '@/components/admin/Communication';
import BarangayCommunication from '@/components/barangay/Communication';

const ChatSystem: React.FC = () => {
  const { user } = useAuth();

  // Show admin communication component if user is admin
  if (user?.role === 'admin') {
    return <AdminCommunication />;
  }

  // Show barangay communication component if user is barangay
  if (user?.role === 'barangay' && user?.barangayId) {
    return <BarangayCommunication barangayId={user.barangayId} />;
  }

  // Fallback
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Unable to load messaging system. Please check your role and barangay assignment.</p>
    </div>
  );
};

export default ChatSystem;
