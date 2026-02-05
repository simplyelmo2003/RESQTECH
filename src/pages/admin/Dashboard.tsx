import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import ReportManagement from '@/components/admin/ReportManagement';
import AlertManagement from '@/components/admin/AlertManagement';
import LogViewer from '@/components/admin/LogViewer';
// Placeholder for other Admin components
import AdminUserManagement from '@/components/admin/UserManagement'; // Will create this next
import AdminEvacuationCenters from '@/components/admin/EvacuationCenterManagement'; // Will create this next
import AdminEmergencyContacts from '@/components/admin/EmergencyContactManagement'; // Will create this next
import AdminNewsAndVideos from '@/components/admin/NewsAndVideoManagement'; // Will create this next

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboardOverview />} />
        <Route path="reports" element={<ReportManagement />} />
        <Route path="evac-centers" element={<AdminEvacuationCenters />} /> {/* Placeholder */}
        <Route path="news" element={<AdminNewsAndVideos />} /> {/* Placeholder */}
        <Route path="contacts" element={<AdminEmergencyContacts />} /> {/* Placeholder */}
        <Route path="alerts" element={<AlertManagement />} />
        <Route path="users" element={<AdminUserManagement />} /> {/* Placeholder */}
        <Route path="logs" element={<LogViewer />} />
        {/* Add more admin routes here */}
        <Route path="*" element={<h2 className="text-2xl font-bold">Admin Sub-Page Not Found</h2>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboardPage;