import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout';
import EmergencyAlerts from '@/components/guest/EmergencyAlerts';
import EvacuationCenterLocator from '@/components/guest/EvacuationCenterLocator';
import EmergencyContacts from '@/components/guest/EmergencyContacts';
import NewsAndVideos from '@/components/guest/NewsAndVideos';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import WeatherWidget from '@/components/guest/WeatherWidget';

const GuestHomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading data for the home page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate data fetching delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <GuestLayout>
        <div className="flex justify-center items-center h-full min-h-[calc(100vh-6rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="space-y-8 py-8">
        <section className="hero-bg-sm rounded-lg overflow-hidden shadow-md">
          <div className="px-6 py-12 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome to ResQTech</h2>
            <p className="text-white/90 max-w-2xl mx-auto">Find nearby evacuation centers, get live alerts, and access emergency contacts curated by ResQTech for your community.</p>
          </div>
        </section>
        {/* Emergency Alerts Section */}
        <Card title="Latest Emergency Alerts" className="p-0"> {/* Customize card to avoid double padding */}
          <EmergencyAlerts />
        </Card>

        {/* Local Weather (separate from alerts) */}
        <WeatherWidget area="Surigao City" />

        {/* Evacuation Center Locator Section */}
        <Card title="Evacuation Center Locator (Including Barangay Temporary Sites)" className="p-0">
          <EvacuationCenterLocator />
        </Card>

        {/* Emergency Contacts Section */}
        <Card title="Emergency Contacts">
          <EmergencyContacts />
        </Card>

        {/* News and Videos Section (or a preview of it) */}
        <Card title="News & Safety Updates" className="p-0">
          {/* For the home page, maybe only show a few recent items */}
          <NewsAndVideos previewMode={true} />
        </Card>

        {/* Community Incident Reporting CTA */}
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-dark mb-4">Witness an Incident?</h3>
            <p className="text-gray-600 mb-6">Help your community by reporting real-time hazards and events.</p>
            <Link to="/guest/report">
                <Button variant="primary">Report Incident Now</Button>
            </Link>
          </div>
        </Card>
      </div>
    </GuestLayout>
  );
};

export default GuestHomePage;