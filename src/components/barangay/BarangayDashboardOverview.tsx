import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ChatSystem from '@/components/common/ChatSystem';
import { getBarangayDashboardOverview } from '@/api/barangay';
import { BarangayDashboardData } from '@/types/barangay';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartLegend
);

const BarangayDashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<BarangayDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.barangayId) {
      setError("No barangay assigned to this user.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getBarangayDashboardOverview(user.barangayId);
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch barangay dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  if (!dashboardData) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No dashboard data available.</p>
      </div>
    );
  }

  const chartData = {
    labels: dashboardData.evacueeTrend.map(trend => format(parseISO(trend.date), 'MMM dd')),
    datasets: [
      {
        label: 'Arrivals',
        data: dashboardData.evacueeTrend.map(trend => trend.arrivals),
        borderColor: '#3B82F6', // Secondary blue
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Departures',
        data: dashboardData.evacueeTrend.map(trend => trend.departures),
        borderColor: '#EF4444', // Primary red
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Total Evacuees',
        data: dashboardData.evacueeTrend.map(trend => trend.total),
        borderColor: '#22C55E', // Accent green
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3,
        fill: false, // Don't fill for total
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Evacuee Trends (Last 7 Days)',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of People',
        },
        beginAtZero: true,
      },
    },
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark mb-4">Dashboard for {dashboardData.barangayName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Evac. Centers" className="text-center bg-[#F1F8FB] text-brand-navy">
          <p className="text-4xl font-bold mt-2">{dashboardData.totalEvacuationCenters}</p>
        </Card>
        <Card title="Open Centers" className="text-center bg-green-50 text-green-800">
          <p className="text-4xl font-bold mt-2">{dashboardData.openCenters}</p>
        </Card>
        <Card title="Full Centers" className="text-center bg-red-50 text-red-800">
          <p className="text-4xl font-bold mt-2">{dashboardData.fullCenters}</p>
        </Card>
        <Card title="Total Evacuees" className="text-center bg-yellow-50 text-yellow-800">
          <p className="text-4xl font-bold mt-2">{dashboardData.totalEvacuees}</p>
          <p className="text-sm">({((dashboardData.totalEvacuees / dashboardData.totalCapacity) * 100 || 0).toFixed(1)}% Capacity)</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Evacuee Trends">
          {dashboardData.evacueeTrend && dashboardData.evacueeTrend.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No evacuee trend data available</p>
            </div>
          )}
        </Card>

        <Card title="Evacuation Center Statuses (Your Barangay)">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboardData.evacCenterSummaries.length > 0 ? (
              dashboardData.evacCenterSummaries.map(center => (
                <div key={center.id} className="p-3 border rounded-md flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="font-semibold text-dark">{center.name}</h3>
                    <p className="text-sm text-gray-600">{center.address}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      center.status === 'Open' ? 'bg-accent text-white' :
                      center.status === 'Full' ? 'bg-danger text-white' :
                      'bg-gray-300 text-dark'
                    }`}>
                      {center.status}
                    </span>
                    <p className="text-sm text-gray-700">{center.currentEvacuees}/{center.maxCapacity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No evacuation centers registered in your barangay.</p>
            )}
          </div>
          <Link to="/barangay/dashboard/evac-centers" className="block mt-4 text-center">
            <Button variant="outline" className="w-full">Manage Evacuation Centers</Button>
          </Link>
        </Card>
      </div>

      <Card title="Active Incidents in Your Barangay">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {dashboardData.activeIncidents.length > 0 ? (
            dashboardData.activeIncidents.map(incident => (
              <div key={incident.id} className="p-3 border rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-dark">
                    {incident.type} Incident ({incident.urgency})
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    incident.status === 'Pending' ? 'bg-brand-yellow/20 text-brand-yellow' :
                    incident.status === 'Verified' ? 'bg-brand-teal/20 text-brand-teal' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                      {incident.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{incident.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Reported by {incident.reporterName} on {format(parseISO(incident.reportedAt), 'MMM dd, yyyy HH:mm')}
                </p>
                {incident.locationDescription && <p className="text-xs text-gray-500">Location: {incident.locationDescription}</p>}
                {incident.affectedHouseholds && <p className="text-xs text-gray-500">Affected Households: {incident.affectedHouseholds}</p>}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No active incidents reported in your barangay.</p>
          )}
        </div>
        <Link to="/barangay/dashboard/reports" className="block mt-4 text-center">
            <Button variant="outline" className="w-full">Submit New Official Report</Button>
        </Link>
      </Card>

      {/* Incident Report Section */}
      <Card title="Report New Incident">
        <p className="text-gray-600 mb-6 text-center">
          Submit an incident report for your barangay. This will be logged and reviewed by administrators.
        </p>
        <Link to="/barangay/dashboard/incident-report" className="block text-center">
          <Button variant="primary" className="w-full">Go to Incident Report Form</Button>
        </Link>
      </Card>

      {/* Chat System - Real-time Messaging */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <ChatSystem />
      </div>
    </div>
  );
};

export default BarangayDashboardOverview;