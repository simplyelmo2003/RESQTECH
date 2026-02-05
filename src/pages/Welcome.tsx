import React from 'react';
import { Link } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout';
import Button from '@/components/ui/Button'; // Assuming Button component is available

const WelcomePage: React.FC = () => {
  return (
    <GuestLayout>
      <div className="min-h-[calc(100vh-6rem-8rem)]">
        <section className="hero-bg flex items-center justify-center text-center px-4 py-20">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg mb-4">Disaster Ready Philippines</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">Focused for your community — your centralized platform for real-time disaster information, evacuation resources, and community reporting. Stay informed, stay safe.</p>
            <div className="flex justify-center space-x-4">
              <Link to="/guest/home">
                <Button size="lg" variant="primary">
                  Explore Resources
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Login to Admin/Barangay
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto text-gray-700">
            <p className="text-lg font-medium mb-6">Key Features</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <li className="flex items-start"><span className="mr-3 text-accent">•</span>Real-time Emergency Alerts from PAGASA, PHIVOLCS, NDRRMC</li>
              <li className="flex items-start"><span className="mr-3 text-accent">•</span>Interactive Evacuation Center Locator with Routing</li>
              <li className="flex items-start"><span className="mr-3 text-accent">•</span>Comprehensive Emergency Contacts directory</li>
              <li className="flex items-start"><span className="mr-3 text-accent">•</span>Community Incident Reporting with map integration</li>
              <li className="flex items-start"><span className="mr-3 text-accent">•</span>Latest Disaster News, Safety Tips, and Educational Videos</li>
            </ul>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
};

export default WelcomePage;