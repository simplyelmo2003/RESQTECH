import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light text-white py-8 px-4 mt-auto border-t-4 border-t-brand-teal shadow-lg">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-brand-yellow mb-2">About ResQTech</h3>
            <p className="text-brand-white/80 text-sm">A modern disaster management system serving Surigao City residents.</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-brand-yellow mb-2">Emergency Hotline</h3>
            <p className="text-brand-white/80 text-sm">911 - Surigao City Police</p>
            <p className="text-brand-white/80 text-sm">8-911 - Emergency Medical Services</p>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-bold text-lg text-brand-yellow mb-2">Quick Links</h3>
            <p className="text-brand-white/80 text-sm">Report Incident • View News • Evacuation Centers</p>
          </div>
        </div>
        <div className="border-t border-brand-teal/30 pt-4 text-center">
          <p className="font-medium text-sm">&copy; {new Date().getFullYear()} Surigao City Resilience • Disaster Management System</p>
          <p className="mt-2 text-xs text-brand-white/70">
            Disclaimer: This system provides informational resources. Follow official government advisories and emergency instructions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;