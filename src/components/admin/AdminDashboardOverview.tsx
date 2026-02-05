import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ChatSystem from '@/components/common/ChatSystem';
import {
  getAdminIncidentReports,
  getAdminEvacuationCenters,
  getAdminEmergencyAlerts,
  getSystemUsers
} from '@/api/admin';
import { AdminIncidentReport, AdminEvacuationCenter, AdminEmergencyAlert, SystemUser } from '@/types/admin';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const AdminDashboardOverview: React.FC = () => {
  const [reports, setReports] = useState<AdminIncidentReport[]>([]);
  const [evacCenters, setEvacCenters] = useState<AdminEvacuationCenter[]>([]);
  const [alerts, setAlerts] = useState<AdminEmergencyAlert[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          fetchedReports,
          fetchedEvacCenters,
          fetchedAlerts,
          fetchedUsers
        ] = await Promise.all([
          getAdminIncidentReports(),
          getAdminEvacuationCenters(),
          getAdminEmergencyAlerts(),
          getSystemUsers()
        ]);

        setReports(fetchedReports);
        setEvacCenters(fetchedEvacCenters);
        setAlerts(fetchedAlerts);
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger py-8">
        <p>{error}</p>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const openEvacCenters = evacCenters.filter(ec => ec.status === 'Open').length;
  const totalEvacuees = evacCenters.reduce((sum, ec) => sum + ec.currentOccupancy, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card title="Total Incident Reports" className="bg-gradient-to-br from-brand-teal/20 to-brand-teal/10 border-l-4 border-l-brand-teal">
        <p className="text-5xl font-bold mt-4 text-brand-navy">{reports.length}</p>
        <p className="text-lg mt-2 text-brand-navy-alt">({pendingReports} Pending)</p>
        <Link to="/admin/dashboard/reports"><Button variant="secondary" className="mt-4">View Reports</Button></Link>
      </Card>

      <Card title="Active Alerts" className="bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/10 border-l-4 border-l-brand-yellow">
        <p className="text-5xl font-bold mt-4 text-brand-navy">{activeAlerts}</p>
        <p className="text-lg mt-2 text-brand-navy-alt">from {alerts.length} total</p>
        <Link to="/admin/dashboard/alerts"><Button variant="secondary" className="mt-4">Manage Alerts</Button></Link>
      </Card>

      <Card title="Open Evacuation Centers" className="bg-gradient-to-br from-brand-teal/20 to-brand-teal/10 border-l-4 border-l-brand-teal">
        <p className="text-5xl font-bold mt-4 text-brand-navy">{openEvacCenters}</p>
        <p className="text-lg mt-2 text-brand-navy-alt">({totalEvacuees} Total Evacuees)</p>
        <Link to="/admin/dashboard/evac-centers"><Button variant="secondary" className="mt-4">View Centers</Button></Link>
      </Card>

      <Card title="System Users" className="bg-gradient-to-br from-brand-navy/10 to-brand-navy/5 border-l-4 border-l-brand-navy">
        <p className="text-5xl font-bold mt-4 text-brand-navy">{users.length}</p>
        <p className="text-lg mt-2 text-brand-navy-alt">({users.filter(u => u.isActive).length} Active)</p>
        <Link to="/admin/dashboard/users"><Button variant="secondary" className="mt-4">Manage Users</Button></Link>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="lg:col-span-2 xl:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/dashboard/alerts"><Button variant="secondary" className="w-full">Publish New Alert</Button></Link>
          <Link to="/admin/dashboard/evac-centers"><Button variant="secondary" className="w-full">Add Evacuation Center</Button></Link>
          <Link to="/admin/dashboard/news"><Button variant="secondary" className="w-full">Create News Article</Button></Link>
          <Link to="/admin/dashboard/contacts"><Button variant="secondary" className="w-full">Add Emergency Contact</Button></Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity" className="lg:col-span-1 xl:col-span-2">
        <p className="text-gray-600 mb-2">Check audit logs for details.</p>
        <Link to="/admin/dashboard/logs"><Button variant="outline" className="w-full">View All Logs</Button></Link>
      </Card>

      {/* Messaging Section - spans full width */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
        <ChatSystem />
      </div>
    </div>
  );
};

export default AdminDashboardOverview;