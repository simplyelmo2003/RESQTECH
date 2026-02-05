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
  getAdminEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '@/api/admin';
import { AdminEmergencyContact } from '@/types/admin';
import { EmergencyContact as GuestEmergencyContactType } from '@/types/guest'; // Importing the base type
import { useForm, SubmitHandler } from 'react-hook-form';

type EmergencyContactFormInputs = Omit<GuestEmergencyContactType, 'id'>;

const contactTypeOptions = [
  { value: 'Fire', label: 'Fire' },
  { value: 'Police', label: 'Police' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Red Cross', label: 'Red Cross' },
  { value: 'NDRRMC', label: 'NDRRMC' },
  { value: 'Others', label: 'Others' },
];

const AdminEmergencyContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<AdminEmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<AdminEmergencyContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<AdminEmergencyContact | null>(null);
  const { addNotification } = useNotification();

  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty, isSubmitting } } = useForm<EmergencyContactFormInputs>();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminEmergencyContacts();
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch emergency contacts:", err);
      setError("Failed to load emergency contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleOpenCreateForm = () => {
    setEditingContact(null);
    reset({ // Reset with empty values for creation
      name: '',
      organization: '',
      phoneNumber: '',
      type: 'Others',
      description: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (contact: AdminEmergencyContact) => {
    setEditingContact(contact);
    reset(contact); // Populate form with existing data
    setIsFormModalOpen(true);
  };

  const onSubmit: SubmitHandler<EmergencyContactFormInputs> = async (data) => {
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, data);
        addNotification({ type: 'success', message: 'Emergency contact updated successfully!' });
      } else {
        await createEmergencyContact(data);
        addNotification({ type: 'success', message: 'Emergency contact created successfully!' });
      }
      setIsFormModalOpen(false);
      fetchContacts(); // Re-fetch data
    } catch (err: any) {
      console.error("Failed to save emergency contact:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to save emergency contact.' });
    }
  };

  const handleDeleteClick = (contact: AdminEmergencyContact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      await deleteEmergencyContact(contactToDelete.id);
      addNotification({ type: 'success', message: 'Emergency contact deleted successfully!' });
      setIsDeleteModalOpen(false);
      fetchContacts(); // Re-fetch data
    } catch (err: any) {
      console.error("Failed to delete emergency contact:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to delete emergency contact.' });
    }
  };

  if (loading) {
    return (
      <Card title="Emergency Contact Management" className="min-h-[500px] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Emergency Contact Management" className="min-h-[500px] flex justify-center items-center text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card title="Emergency Contact Management">
      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenCreateForm} variant="primary">
          Add New Contact
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary/5 border-b border-primary/10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Organization
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-primary/2 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{contact.organization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">{contact.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark/70">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark/70 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {contact.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(contact)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(contact)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-dark/50">
                  No emergency contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <ConfirmationModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onConfirm={handleSubmit(onSubmit)}
          title={editingContact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
          confirmText={editingContact ? 'Save Changes' : 'Create Contact'}
          cancelText="Cancel"
          isConfirming={isSubmitting}
          disableConfirm={!isValid || !isDirty} // Disable if form is not valid or not changed
          message={
            <form id="emergency-contact-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="name"
                label="Contact Name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                id="organization"
                label="Organization"
                {...register('organization', { required: 'Organization is required' })}
                error={errors.organization?.message}
              />
              <Input
                id="phoneNumber"
                label="Phone Number"
                type="tel"
                {...register('phoneNumber', { required: 'Phone Number is required', pattern: {value: /^[0-9\-\(\)\s]+$/, message: 'Invalid phone number format'} })}
                error={errors.phoneNumber?.message}
              />
              <Select
                id="type"
                label="Type"
                options={contactTypeOptions}
                {...register('type', { required: 'Type is required' })}
                error={errors.type?.message}
              />
              <Textarea
                id="description"
                label="Description (Optional)"
                rows={3}
                {...register('description')}
                error={errors.description?.message}
              />
            </form>
          }
        />
      )}

      {contactToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Delete Contact"
          message={`Are you sure you want to delete "${contactToDelete.name} - ${contactToDelete.organization}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </Card>
  );
};

export default AdminEmergencyContactManagement;