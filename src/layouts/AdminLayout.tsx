import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import { useAuth } from '@/hooks/useAuth'; // To get the user's role

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth(); // Assuming 'admin' role is guaranteed by ProtectedRoute

  if (!user || user.role !== 'admin') {
    // This case should ideally be handled by ProtectedRoute,
    // but a fallback for type safety or direct access.
    return <div>Unauthorized Access</div>;
  }

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar role="admin" />
      <div className="flex flex-col flex-1 w-full" style={{ marginLeft: '16rem' }}>
        <Header type="authenticated" />
        <main className="flex-grow p-6 w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;