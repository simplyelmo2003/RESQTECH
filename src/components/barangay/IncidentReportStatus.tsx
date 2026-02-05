import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getBarangayOfficialIncidentReports } from '@/api/barangay';
import { format, parseISO } from 'date-fns';

const IncidentReportStatus: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!user?.barangayId) {
      setError("No barangay assigned to this user.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Fetching incident reports for barangay:', user.barangayId);
      const data = await getBarangayOfficialIncidentReports(user.barangayId);
      console.log('📋 Reports fetched:', data.length, data);
      setReports(data.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()));
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch incident reports:", err);
      setError("Failed to load incident reports.");
    } finally {
      setLoading(false);
    }
  }, [user?.barangayId]);

  useEffect(() => {
    fetchReports();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  // Debug: Log when reports change
  useEffect(() => {
    console.log('📊 IncidentReportStatus - Reports updated:', reports.length, reports);
  }, [reports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow';
      case 'Verified':
        return 'bg-brand-teal/20 text-brand-teal border-brand-teal';
      case 'Rejected':
        return 'bg-brand-navy/20 text-brand-navy border-brand-navy/40';
      case 'Published':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Verified':
        return '✅';
      case 'Rejected':
        return '❌';
      case 'Published':
        return '📢';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="Incident Report Status" className="text-center">
        <p className="text-danger py-8">{error}</p>
        <Button variant="primary" onClick={fetchReports}>Retry</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card title="Incident Report Status" className="p-6">
        <p className="text-gray-600 mb-6 text-center">
          Monitor the status of your submitted incident reports. Reports are reviewed and verified by administrators.
        </p>

        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No incident reports submitted yet.</p>
            <Button variant="primary" onClick={fetchReports}>Check Again</Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reports.map(report => (
              <div
                key={report.id}
                className={`p-4 border-l-4 rounded-lg shadow-sm transition-all hover:shadow-md ${getStatusColor(report.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <span>{getStatusIcon(report.status)}</span>
                      <span>{report.type} - {report.locationDescription}</span>
                    </h3>
                    <p className="text-xs opacity-75 mt-1">
                      {format(parseISO(report.reportedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-sm mb-2 line-clamp-2">{report.description}</p>

                {report.adminNotes && (
                  <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm border-l-2 border-current">
                    <p className="font-semibold text-xs mb-1">Admin Notes:</p>
                    <p>{report.adminNotes}</p>
                  </div>
                )}

                <div className="mt-3 text-xs opacity-75 space-y-1">
                  {report.affectedHouseholds > 0 && (
                    <p>Affected Households: <strong>{report.affectedHouseholds}</strong></p>
                  )}
                  {report.urgency && (
                    <p>Urgency Level: <strong>{report.urgency}</strong></p>
                  )}
                  <p>Report ID: {report.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={fetchReports}
          >
            🔄 Refresh Status
          </Button>
        </div>
      </Card>

      <Card title="Status Legend" className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={`p-3 rounded border ${getStatusColor('Pending')}`}>
            <p className="font-semibold">⏳ Pending</p>
            <p className="text-xs mt-1">Awaiting admin review</p>
          </div>
          <div className={`p-3 rounded border ${getStatusColor('Verified')}`}>
            <p className="font-semibold">✅ Verified</p>
            <p className="text-xs mt-1">Confirmed by admin</p>
          </div>
          <div className={`p-3 rounded border ${getStatusColor('Rejected')}`}>
            <p className="font-semibold">❌ Rejected</p>
            <p className="text-xs mt-1">Not verified by admin</p>
          </div>
          <div className={`p-3 rounded border ${getStatusColor('Published')}`}>
            <p className="font-semibold">📢 Published</p>
            <p className="text-xs mt-1">Shared with public</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IncidentReportStatus;
