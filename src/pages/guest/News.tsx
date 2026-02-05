import React from 'react';
import GuestLayout from '@/layouts/GuestLayout';
import NewsAndVideos from '@/components/guest/NewsAndVideos';

const GuestNewsPage: React.FC = () => {
  return (
    <GuestLayout>
      <div className="py-8 px-4">
        <h1 className="text-3xl font-bold text-dark mb-6">Latest News & Safety Updates</h1>
        <NewsAndVideos previewMode={false} /> {/* Full mode for the dedicated news page */}
      </div>
    </GuestLayout>
  );
};

export default GuestNewsPage;