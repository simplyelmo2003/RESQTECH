import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface GuestLayoutProps {
  children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header type="guest" />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;