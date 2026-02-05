import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BarangayLayout from '@/layouts/BarangayLayout';
import BarangayDashboardOverview from '@/components/barangay/BarangayDashboardOverview';
import BarangayEvacuationCenterManagement from '@/components/barangay/EvacuationCenterManagement'; // Barangay-specific
import BarangayOfficialReports from '@/components/barangay/BarangayOfficialReports';
import BarangayIncidentReportForm from '@/components/barangay/IncidentReportForm';
import IncidentReportStatus from '@/components/barangay/IncidentReportStatus';

const BarangayDashboardPage: React.FC = () => {
  return (
    <BarangayLayout>
      <Routes>
        <Route index element={<BarangayDashboardOverview />} />
        <Route path="evac-centers" element={<BarangayEvacuationCenterManagement />} />
        <Route path="reports" element={<BarangayOfficialReports />} />
        <Route path="incident-report" element={<BarangayIncidentReportForm />} />
        <Route path="incident-status" element={<IncidentReportStatus />} />
        {/* Add more barangay routes here */}
        <Route path="*" element={<h2 className="text-2xl font-bold">Barangay Sub-Page Not Found</h2>} />
      </Routes>
    </BarangayLayout>
  );
};

export default BarangayDashboardPage;