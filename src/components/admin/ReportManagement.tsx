import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import {
  getAdminIncidentReports,
  deleteIncidentReport,
  updateFullIncidentReport,
} from '@/api/admin';
import { AdminIncidentReport } from '@/types/admin';
import { IncidentStatus } from '@/types/guest';
import { format, isValid } from 'date-fns';

const reportStatusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Verified', label: 'Verified (Displayed on map)' },
  { value: 'Published', label: 'Published (Publicly visible)' },
  { value: 'Rejected', label: 'Rejected' },
];

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<AdminIncidentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminIncidentReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'' | IncidentStatus>('');
  const [filterType, setFilterType] = useState<'' | string>('');
  const { addNotification } = useNotification();

  // Edit form state for all editable fields
  const [editReporterName, setEditReporterName] = useState<string>('');
  const [editReporterContact, setEditReporterContact] = useState<string>('');
  const [editType, setEditType] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editLocationDescription, setEditLocationDescription] = useState<string>('');
  const [editReportedAt, setEditReportedAt] = useState<string>('');
  const [editStatus, setEditStatus] = useState<IncidentStatus>('Pending');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminIncidentReports();
      console.log('📋 Fetched incident reports:', data.length, 'reports');
      if (data && data.length > 0) {
        console.log('   First report details:', {
          id: data[0].id,
          reporterName: data[0].reporterName,
          reporterContact: data[0].reporterContact,
          type: data[0].type,
          description: data[0].description?.substring(0, 50),
          imageUrls: data[0].imageUrls ? `${data[0].imageUrls.length} images` : 'none',
          status: data[0].status,
        });
      }
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch incident reports:", err);
      setError("Failed to load incident reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Auto-refresh periodically so admin sees new guest submissions
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReports();
    }, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [fetchReports]);

  const handleEditReport = (report: AdminIncidentReport) => {
    setSelectedReport(report);
    setEditReporterName(report.reporterName || '');
    setEditReporterContact(report.reporterContact || '');
    setEditType(report.type);
    setEditDescription(report.description);
    setEditLocationDescription(report.locationDescription || '');
    setEditReportedAt(report.reportedAt || '');
    setEditStatus(report.status);
    setEditAdminNotes(report.adminNotes || '');
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedReport) return;

    try {
      const updates: Partial<AdminIncidentReport> = {
        reporterName: editReporterName || 'Anonymous',
        reporterContact: editReporterContact || undefined,
        type: editType as any,
        description: editDescription,
        locationDescription: editLocationDescription,
        status: editStatus,
        adminNotes: editAdminNotes,
      };

      await updateFullIncidentReport(selectedReport.id, updates);
      addNotification({ type: 'success', message: 'Report updated successfully!' });
      setIsModalOpen(false);
      fetchReports();
    } catch (err) {
      console.error("Failed to update report:", err);
      addNotification({ type: 'error', message: 'Failed to update report. Please try again.' });
    }
  };

  const handleQuickStatusChange = async (report: AdminIncidentReport, newStatus: IncidentStatus) => {
    try {
      const updates: Partial<AdminIncidentReport> = {
        status: newStatus,
        adminNotes: newStatus === 'Verified' ? 'Verified by admin' : 
                   newStatus === 'Published' ? 'Published for guest viewing' :
                   newStatus === 'Rejected' ? 'Rejected' : report.adminNotes
      };

      await updateFullIncidentReport(report.id, updates);
      addNotification({ type: 'success', message: `Report status changed to ${newStatus}!` });
      fetchReports();
    } catch (err) {
      console.error("Failed to update report status:", err);
      addNotification({ type: 'error', message: 'Failed to update report status. Please try again.' });
    }
  };

  const handleDeleteReport = (report: AdminIncidentReport) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteReport = async () => {
    if (!selectedReport) return;
    try {
      await deleteIncidentReport(selectedReport.id);
      addNotification({ type: 'success', message: 'Report deleted successfully!' });
      setIsDeleteModalOpen(false);
      fetchReports();
    } catch (err) {
      console.error("Failed to delete report:", err);
      addNotification({ type: 'error', message: 'Failed to delete report. Please try again.' });
    }
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = filterStatus === '' || report.status === filterStatus;
    const typeMatch = filterType === '' || report.type === filterType;
    return statusMatch && typeMatch;
  });

  if (loading) {
    return (
      <Card title="Incident Report Management" className="min-h-[500px] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Incident Report Management" className="min-h-[500px] flex justify-center items-center text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  const incidentTypes = Array.from(new Set(reports.map(r => r.type))).sort().map(type => ({ value: type, label: type }));
  incidentTypes.unshift({ value: '' as any, label: 'All Types' } as any);

  const safeFormatDate = (dateInput: any, pattern = 'MMM dd, HH:mm') => {
    try {
      const d = dateInput ? new Date(dateInput) : null;
      if (d && isValid(d)) return format(d, pattern);
    } catch (e) {
      // fall through
    }
    return 'N/A';
  };

  const safeCoord = (coord: any) => (typeof coord === 'number' && !isNaN(coord)) ? coord.toFixed(6) : 'N/A';

  return (
    <Card title="Incident Report Management" className="bg-gradient-to-br from-brand-white to-white">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-brand-teal/30">
        <h3 className="text-xl font-bold text-brand-navy">Filters & Actions</h3>
        <div className="space-x-2 flex">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={fetchReports}
            className="bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-navy"
          >
            🔄 Refresh
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              if (window.localStorage) {
                window.localStorage.removeItem('SHARED_INCIDENT_REPORTS_V1');
                console.log('✓ localStorage cleared');
                fetchReports();
              }
            }}
            className="bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-navy"
          >
            🗑️ Clear Data
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select
          id="filter-status"
          label="Filter by Status"
          options={[{ value: '', label: 'All Statuses' }, ...reportStatusOptions]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | '')}
          className="md:w-1/2 mb-0"
        />
        <Select
          id="filter-type"
          label="Filter by Type"
          options={incidentTypes}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="md:w-1/2 mb-0"
        />
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-brand-navy-light/10 to-brand-teal/10 rounded-lg border-2 border-brand-teal/40 shadow-md">
        <p className="text-sm font-semibold text-brand-navy"><strong>📊 Total Reports:</strong> <span className="text-lg text-brand-teal">{reports.length}</span> | <strong>Showing:</strong> <span className="text-lg text-brand-teal">{filteredReports.length}</span></p>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-2xl border-2 border-brand-navy/10 bg-gradient-to-br from-white to-brand-white">
        <table className="min-w-full divide-y divide-brand-teal/15 bg-transparent">
          <thead className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                ID
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                Reporter
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                Type
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Images
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Reported At
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
                <tbody className="bg-transparent divide-y divide-brand-teal/10">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, idx) => (
                <tr key={report.id} className={`${idx % 2 === 0 ? 'bg-brand-navy/2' : 'bg-brand-teal/3'} hover:bg-gradient-to-r hover:from-brand-teal/15 hover:to-brand-navy/10 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-brand-teal`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-navy-alt">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <strong className="text-brand-navy">{report.reporterName || 'Anonymous'}</strong>
                    {report.reporterContact && (<><br /><span className="text-xs text-brand-teal">{report.reporterContact}</span></>)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-teal">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-navy-light">{report.reporterContact || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-brand-navy max-w-xs truncate">{report.description}</td>
                  <td className="px-6 py-4 text-sm text-brand-navy-alt max-w-xs">
                    {report.locationDescription || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {report.imageUrls && report.imageUrls.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {report.imageUrls.slice(0, 3).map((url, idx) => (
                            <img key={idx} src={url} alt={`img-${idx}`} className="w-8 h-8 object-cover rounded-full border-2 border-brand-teal/30 cursor-pointer hover:opacity-75 transition-opacity shadow-sm" title="Click to view full size" onClick={() => setLightboxImage(url)} />
                          ))}
                        </div>
                        {report.imageUrls.length > 3 && <span className="text-xs font-semibold text-brand-teal bg-brand-navy-light/10 px-2 py-1 rounded-full">+{report.imageUrls.length - 3}</span>}
                      </div>
                    ) : <span className="text-brand-teal/50">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-navy-alt font-medium">
                    {safeFormatDate(report.reportedAt, 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      report.status === 'Pending' ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow' :
                      report.status === 'Verified' ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal' :
                      report.status === 'Published' ? 'bg-green-100 text-green-800 border border-green-300' :
                      'bg-brand-navy/20 text-brand-navy border border-brand-navy/40'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-1 overflow-x-auto min-w-max pb-2">
                      {report.status === 'Pending' && (
                        <>
                          <Button variant="accent" size="sm" onClick={() => handleQuickStatusChange(report, 'Verified')} className="flex-shrink-0 bg-brand-teal hover:bg-brand-teal/80">
                            ✅ Verify
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleQuickStatusChange(report, 'Rejected')} className="flex-shrink-0">
                            ❌ Reject
                          </Button>
                        </>
                      )}
                      {report.status === 'Verified' && (
                        <Button variant="accent" size="sm" onClick={() => handleQuickStatusChange(report, 'Published')} className="flex-shrink-0 bg-green-500 hover:bg-green-600">
                          📢 Publish
                        </Button>
                      )}
                      <Button variant="info" size="sm" onClick={() => handleEditReport(report)} className="flex-shrink-0 bg-brand-teal hover:bg-brand-teal/80 text-white">
                        ✏️ Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteReport(report)} className="flex-shrink-0">
                        🗑️ Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="text-brand-teal/50 text-lg">📋 No incident reports found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/View Report Modal */}
      {selectedReport && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSaveChanges}
          title={`Edit Report #${selectedReport.id}`}
          message={
            <div className="space-y-4 text-left max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Name</label>
                <Input
                  id="edit-reporter-name"
                  type="text"
                  value={editReporterName}
                  onChange={(e) => setEditReporterName(e.target.value)}
                  placeholder="Anonymous"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <Input
                  id="edit-reporter-contact"
                  type="tel"
                  value={editReporterContact}
                  onChange={(e) => setEditReporterContact(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                <Select
                  id="edit-type"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  options={[
                    { value: 'Flood', label: 'Flood' },
                    { value: 'Fire', label: 'Fire' },
                    { value: 'Earthquake', label: 'Earthquake' },
                    { value: 'Landslide', label: 'Landslide' },
                    { value: 'Typhoon', label: 'Typhoon' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Incident description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Description</label>
                <Input
                  id="edit-location"
                  type="text"
                  value={editLocationDescription}
                  onChange={(e) => setEditLocationDescription(e.target.value)}
                  placeholder="e.g., Maharlika St, Brgy. Rosario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reported At (Read-only)</label>
                <Input
                  id="edit-reported-at"
                  type="text"
                  value={editReportedAt ? format(new Date(editReportedAt), 'PPpp') : ''}
                  disabled
                  placeholder="N/A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  id="edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as IncidentStatus)}
                  options={reportStatusOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <Textarea
                  id="edit-admin-notes"
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="Internal notes for admin use"
                />
              </div>

              {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Images ({selectedReport.imageUrls.length})</label>
                  <div className="flex flex-wrap gap-3">
                    {selectedReport.imageUrls.map((url, idx) => (
                      <img key={idx} src={url} alt={`Report image ${idx + 1}`} className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity" onClick={() => setLightboxImage(url)} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click images to view full size</p>
                </div>
              )}

                <div className="bg-brand-navy-light/5 p-3 rounded text-sm text-brand-navy">
                <p><strong>Coordinates:</strong> {selectedReport?.location ? `${safeCoord(selectedReport.location.lat)}, ${safeCoord(selectedReport.location.lng)}` : 'N/A'}</p>
                <p><strong>Reported:</strong> {safeFormatDate(selectedReport?.reportedAt, 'MMM dd, yyyy HH:mm:ss')}</p>
              </div>
            </div>
          }
          confirmText="Save All Changes"
          cancelText="Cancel"
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedReport && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteReport}
          title="Confirm Delete Report"
          message={`Are you sure you want to delete incident report #${selectedReport.id} by ${selectedReport.reporterName || 'Anonymous'}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {/* Lightbox Modal for Full-Size Images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-96 flex items-center justify-center">
            <img
              src={lightboxImage}
              alt="Full-size incident report image"
              className="max-w-full max-h-96 object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold transition-colors"
              title="Close (ESC or click background)"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReportManagement;
