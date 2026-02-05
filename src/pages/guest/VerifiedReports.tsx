import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import GuestLayout from '@/layouts/GuestLayout';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getVerifiedIncidentReports } from '@/api/guest';
import { IncidentReport } from '@/types/guest';

const VerifiedReportsPage: React.FC = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getVerifiedIncidentReports();
      setReports(data);
      console.log('📋 Verified reports loaded:', data.length);
    } catch (err) {
      console.error('Failed to fetch verified reports:', err);
      setError('Failed to load verified reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="space-y-6 py-8">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-brand-navy to-brand-teal">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-brand-yellow">📋 Verified Incident Reports</h1>
            <p className="text-black text-lg font-medium">
              Community members have reported {reports.length} verified {reports.length === 1 ? 'incident' : 'incidents'}. 
              Stay informed about ongoing situations in your area.
            </p>
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {/* Empty State */}
        {reports.length === 0 && !error && (
          <Card className="bg-blue-50">
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">✅ Great news! No verified incidents reported at the moment.</p>
              <p className="text-gray-500 mt-2">Your community is safe. If you witness an incident, please report it to help others.</p>
            </div>
          </Card>
        )}

        {/* Reports Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {/* Type Badge */}
                <div className="inline-block">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.type === 'Fire'
                      ? 'bg-red-100 text-red-800'
                      : report.type === 'Flood'
                      ? 'bg-blue-100 text-blue-800'
                      : report.type === 'Earthquake'
                      ? 'bg-orange-100 text-orange-800'
                      : report.type === 'Landslide'
                      ? 'bg-amber-100 text-amber-800'
                      : report.type === 'Typhoon'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.type}
                  </span>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-gray-600">📍 Location</p>
                  <p className="font-semibold text-gray-900">{report.locationDescription}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-800 text-sm line-clamp-3">{report.description}</p>
                </div>

                {/* Reported By */}
                {report.reporterName && (
                  <div>
                    <p className="text-xs text-gray-500">Reported by: {report.reporterName}</p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500">
                    📅 {format(parseISO(report.reportedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                {/* Images */}
                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">📸 Evidence Photos</p>
                    <div className="flex gap-2 flex-wrap">
                      {report.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Report ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
};

export default VerifiedReportsPage;
