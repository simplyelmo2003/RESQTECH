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
  getAdminEmergencyAlerts,
  createAlert,
  updateEmergencyAlert,
  deleteEmergencyAlert,
  broadcastAlert,
} from '@/api/admin';
import { AdminEmergencyAlert } from '@/types/admin';
import { useForm, SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';

type AlertFormInputs = Omit<AdminEmergencyAlert, 'id' | 'issuedAt'>;

const levelOptions = [
  { value: 'High', label: 'High' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Low', label: 'Low' },
];

const sourceOptions = [
  { value: 'PAGASA', label: 'PAGASA' },
  { value: 'PHIVOLCS', label: 'PHIVOLCS' },
  { value: 'NDRRMC', label: 'NDRRMC' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Local News', label: 'Local News' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<AdminEmergencyAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [editingAlert, setEditingAlert] = useState<AdminEmergencyAlert | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<AdminEmergencyAlert | null>(null);
  const [alertToBroadcast, setAlertToBroadcast] = useState<AdminEmergencyAlert | null>(null);
  const { addNotification } = useNotification();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlertFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      source: 'Admin',
      level: 'Moderate',
      areaAffected: '',
      expiresAt: '',
      link: '',
      status: 'active',
    },
  });

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminEmergencyAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Failed to load alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleOpenCreateForm = () => {
    setEditingAlert(null);
    reset({
      title: '',
      description: '',
      source: 'Admin',
      level: 'Moderate',
      areaAffected: '',
      expiresAt: '',
      link: '',
      status: 'active',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (alert: AdminEmergencyAlert) => {
    setEditingAlert(alert);
    reset({
      title: alert.title,
      description: alert.description,
      source: alert.source,
      level: alert.level,
      areaAffected: alert.areaAffected,
      expiresAt: alert.expiresAt || '',
      link: alert.link || '',
      status: alert.status,
    });
    setIsFormModalOpen(true);
  };

  const onSubmit: SubmitHandler<AlertFormInputs> = async (data) => {
    try {
      if (editingAlert) {
        await updateEmergencyAlert(editingAlert.id, data);
        addNotification({ type: 'success', message: 'Alert updated successfully!' });
      } else {
        await createAlert(data);
        addNotification({ type: 'success', message: 'Alert created successfully!' });
      }
      setIsFormModalOpen(false);
      fetchAlerts();
    } catch (err: any) {
      console.error("Failed to save alert:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to save alert.' });
    }
  };

  const handleDeleteClick = (alert: AdminEmergencyAlert) => {
    setAlertToDelete(alert);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!alertToDelete) return;
    try {
      await deleteEmergencyAlert(alertToDelete.id);
      addNotification({ type: 'success', message: 'Alert deleted successfully!' });
      setIsDeleteModalOpen(false);
      fetchAlerts();
    } catch (err: any) {
      console.error("Failed to delete alert:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to delete alert.' });
    }
  };

  const handleBroadcastClick = (alert: AdminEmergencyAlert) => {
    setAlertToBroadcast(alert);
    setIsBroadcastModalOpen(true);
  };

  const confirmBroadcast = async () => {
    if (!alertToBroadcast) return;
    try {
      await broadcastAlert(alertToBroadcast.id);
      addNotification({ type: 'success', message: 'Alert broadcast successfully!' });
      setIsBroadcastModalOpen(false);
      fetchAlerts();
    } catch (err: any) {
      console.error("Failed to broadcast alert:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to broadcast alert.' });
    }
  };

  if (loading) {
    return (
      <Card title="Emergency Alert Management" className="min-h-[500px] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Emergency Alert Management" className="min-h-[500px] flex justify-center items-center text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const archivedAlerts = alerts.filter(a => a.status === 'archived');

  const AlertTable: React.FC<{ alerts: AdminEmergencyAlert[], title: string }> = ({ alerts, title }) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-dark mb-4 border-b pb-2">{title}</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-500 py-4">No {title.toLowerCase()} found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl border-2 border-brand-navy/10 bg-gradient-to-br from-white to-brand-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Area</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Source</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Issued</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">Expires</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alerts.map((alert, idx) => (
                <tr key={alert.id} className={`${idx % 2 === 0 ? 'bg-brand-navy/2' : 'bg-brand-teal/3'} hover:bg-gradient-to-r hover:from-brand-teal/15 hover:to-brand-navy/10 border-l-4 border-l-transparent hover:border-l-brand-teal transition-all duration-200`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{alert.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.level === 'High' ? 'bg-brand-navy/20 text-brand-navy border border-brand-navy/40' :
                      alert.level === 'Moderate' ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow' :
                      'bg-brand-teal/20 text-brand-teal border border-brand-teal'
                    }`}>
                      {alert.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{alert.areaAffected}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(alert.issuedAt), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {alert.expiresAt ? format(new Date(alert.expiresAt), 'MMM dd, HH:mm') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {alert.status === 'active' && (
                      <Button variant="secondary" size="sm" onClick={() => handleBroadcastClick(alert)} className="mr-1">
                        Broadcast
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(alert)} className="mr-1">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(alert)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <Card title="Emergency Alert Management">
      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenCreateForm} variant="primary">
          Create New Alert
        </Button>
      </div>

      <AlertTable alerts={activeAlerts} title="Active Alerts" />
      <AlertTable alerts={archivedAlerts} title="Archived Alerts" />

      {isFormModalOpen && (
        <ConfirmationModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onConfirm={() => {
            const form = document.getElementById('alert-form') as HTMLFormElement;
            if (form) {
              form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
          }}
          title={editingAlert ? 'Edit Alert' : 'Create New Alert'}
          confirmText={editingAlert ? 'Save Changes' : 'Create Alert'}
          cancelText="Cancel"
          isConfirming={isSubmitting}
          disableConfirm={false}
          message={
            <form id="alert-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="title"
                label="Alert Title"
                placeholder="e.g., Typhoon Advisory"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
              />
              <Textarea
                id="description"
                label="Description"
                rows={4}
                placeholder="Detailed information about the alert..."
                {...register('description', { required: 'Description is required' })}
                error={errors.description?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="level"
                  label="Alert Level"
                  options={levelOptions}
                  {...register('level')}
                  error={errors.level?.message}
                />
                <Select
                  id="source"
                  label="Source"
                  options={sourceOptions}
                  {...register('source')}
                  error={errors.source?.message}
                />
              </div>
              <Input
                id="areaAffected"
                label="Area Affected"
                placeholder="e.g., Surigao City, Caraga Region"
                {...register('areaAffected', { required: 'Area is required' })}
                error={errors.areaAffected?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="expiresAt"
                  label="Expires At (Optional)"
                  type="datetime-local"
                  {...register('expiresAt')}
                  error={errors.expiresAt?.message}
                />
                <Input
                  id="link"
                  label="Reference Link (Optional)"
                  type="url"
                  placeholder="https://example.com"
                  {...register('link')}
                  error={errors.link?.message}
                />
              </div>
              <Select
                id="status"
                label="Status"
                options={statusOptions}
                {...register('status')}
                error={errors.status?.message}
              />
            </form>
          }
        />
      )}

      {alertToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Delete Alert"
          message={`Are you sure you want to delete the alert "${alertToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {alertToBroadcast && (
        <ConfirmationModal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          onConfirm={confirmBroadcast}
          title="Broadcast Alert"
          message={`Broadcast the alert "${alertToBroadcast.title}" to all users? This will make it highly visible.`}
          confirmText="Broadcast"
          cancelText="Cancel"
          variant="primary"
        />
      )}
    </Card>
  );
};

export default AlertManagement;
