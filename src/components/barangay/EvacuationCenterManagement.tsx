import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import {
  getBarangayEvacuationCenters,
  updateBarangayEvacuationCenter,
  createEvacuationCenterForBarangay,
} from '@/api/barangay';
import { BarangayEvacuationCenter } from '@/types/barangay';
import { EvacCenterStatus, EvacCenterService } from '@/types/guest';
import { useAuth } from '@/hooks/useAuth';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { format } from 'date-fns';
import { SURIGAO_CITY_BARANGAYS, getBarangayById } from '@/lib/barangayData';

interface ContactPerson {
    name: string;
    phone: string;
    role: string;
}

type EvacuationCenterFormInputs = {
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  contact: string;
  status: EvacCenterStatus;
  barangayId: string;
  services: EvacCenterService[];
  imageUrl?: string;
  contactPersons: ContactPerson[];
  isTemporary: boolean;
};

const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Full', label: 'Full' },
  { value: 'Closed', label: 'Closed' },
];

const serviceOptions = [
  { value: 'Water', label: 'Water' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Food', label: 'Food' },
  { value: 'Power', label: 'Power' },
];

const BarangayEvacuationCenterManagement: React.FC = () => {
    const { user } = useAuth();
    const [centers, setCenters] = useState<BarangayEvacuationCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [editingCenter, setEditingCenter] = useState<BarangayEvacuationCenter | null>(null);
    const { addNotification } = useNotification();

    const { register, handleSubmit, reset, control, watch, formState: { errors, isValid, isDirty, isSubmitting } } = useForm<EvacuationCenterFormInputs>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contactPersons',
    });

    const isTemporaryWatch = watch('isTemporary');

    const fetchCenters = useCallback(async () => {
        if (!user?.barangayId) {
            setError("Barangay ID not found for current user.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getBarangayEvacuationCenters(user.barangayId);
            setCenters(data);
        } catch (err) {
            console.error("Failed to fetch evacuation centers:", err);
            setError("Failed to load evacuation centers. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user?.barangayId]);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    const handleOpenCreateForm = () => {
        setEditingCenter(null);
        reset({
            name: '',
            address: '',
            capacity: 0,
            currentOccupancy: 0,
            contact: '',
            status: 'Open',
            barangayId: user?.barangayId || '',
            services: [],
            imageUrl: '',
            contactPersons: [],
            isTemporary: false,
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (center: BarangayEvacuationCenter) => {
        setEditingCenter(center);
        reset({
            name: center.name,
            address: center.address,
            capacity: center.capacity,
            currentOccupancy: center.currentOccupancy,
            contact: center.contact,
            status: center.status,
            barangayId: center.barangayId,
            services: center.services,
            imageUrl: center.imageUrl,
            contactPersons: center.contactPersons || [],
            isTemporary: center.id.startsWith('temp-'),
        });
        setIsFormModalOpen(true);
    };


    const onSubmit: SubmitHandler<EvacuationCenterFormInputs> = async (data) => {
        if (!user?.barangayId || !user?.id || !user?.username) {
            addNotification({ type: 'error', message: 'User not properly authenticated for this action.' });
            return;
        }

        const centerData = {
          ...data,
          capacity: Number(data.capacity),
          currentOccupancy: Number(data.currentOccupancy),
        };

        try {
            if (editingCenter) {
                // Officials only update specific fields, not main name/address/barangayId
                const updatePayload = {
                  currentOccupancy: centerData.currentOccupancy,
                  contact: centerData.contact,
                  status: centerData.status,
                  services: centerData.services,
                  contactPersons: centerData.contactPersons,
                  imageUrl: centerData.imageUrl, // allow image update
                };
                await updateBarangayEvacuationCenter(editingCenter.id, user.barangayId, updatePayload, user.id, user.username);
                addNotification({ type: 'success', message: 'Evacuation center updated successfully!' });
            } else {
                // For new temporary centers - add required fields for creation
                const creationData = {
                  name: centerData.name,
                  address: centerData.address,
                  location: { lat: 0, lng: 0 }, // TODO: Use geolocation or address geocoding
                  capacity: centerData.capacity,
                  currentOccupancy: centerData.currentOccupancy,
                  contact: centerData.contact,
                  status: centerData.status,
                  barangayId: centerData.barangayId,
                  services: centerData.services,
                  imageUrl: centerData.imageUrl,
                  lastUpdatedBy: user.id,
                };
                await createEvacuationCenterForBarangay(
                    user.barangayId,
                    creationData as any
                );
                addNotification({ type: 'success', message: 'Temporary evacuation center created successfully!' });
            }
            setIsFormModalOpen(false);
            fetchCenters(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to save evacuation center:", err);
            addNotification({ type: 'error', message: err.message || 'Failed to save evacuation center.' });
        }
    };


    if (loading) {
        return (
            <Card title="My Barangay Evacuation Centers" className="min-h-[500px] flex justify-center items-center">
                <LoadingSpinner size="lg" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="My Barangay Evacuation Centers" className="min-h-[500px] flex justify-center items-center text-danger">
                <p>{error}</p>
            </Card>
        );
    }

    return (
        <Card title={`Evacuation Centers for ${user?.barangayId?.replace('brgy-', 'Brgy. ').replace(/-/g, ' ').toUpperCase() || 'Your Barangay'}`}>
            <div className="flex justify-end mb-4">
                <Button onClick={handleOpenCreateForm} variant="primary">
                    Add Temporary Evacuation Site
                </Button>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-2xl border-2 border-brand-navy/10 bg-gradient-to-br from-white to-brand-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Capacity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Occupancy
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Services
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Last Updated
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {centers.length > 0 ? (
                            centers.map((center, idx) => (
                                <tr key={center.id} className={`${idx % 2 === 0 ? 'bg-brand-navy/2' : 'bg-brand-teal/3'} hover:bg-gradient-to-r hover:from-brand-teal/15 hover:to-brand-navy/10 border-l-4 border-l-transparent hover:border-l-brand-teal transition-all duration-200`}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {center.name}
                                        {center.id.startsWith('temp-') && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-brand-navy-light/10 text-brand-navy">TEMP</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{center.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{center.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{center.currentOccupancy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            center.status === 'Open' ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal' :
                                            center.status === 'Full' ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {center.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {center.services.length > 0 ? center.services.join(', ') : 'None'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {format(new Date(center.lastUpdated), 'MMM dd, yyyy HH:mm')} by {center.lastUpdatedBy === user?.id ? 'You' : center.lastUpdatedBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(center)} className="mr-2">
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    No evacuation centers found for your barangay.
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
                    title={editingCenter ? 'Edit Evacuation Center' : 'Add Temporary Evacuation Site'}
                    confirmText={editingCenter ? 'Save Changes' : 'Create Site'}
                    cancelText="Cancel"
                    isConfirming={isSubmitting}
                    disableConfirm={!isValid || !isDirty}
                    message={
                        <form id="barangay-evac-center-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                id="name"
                                label="Name"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                                readOnly={!!editingCenter && !isTemporaryWatch} // Cannot edit name of established centers
                            />
                            <Input
                                id="address"
                                label="Address"
                                {...register('address', { required: 'Address is required' })}
                                error={errors.address?.message}
                                readOnly={!!editingCenter && !isTemporaryWatch} // Cannot edit address of established centers
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="capacity"
                                    label="Capacity"
                                    type="number"
                                    {...register('capacity', { required: 'Capacity is required', min: 1 })}
                                    error={errors.capacity?.message}
                                    readOnly={!!editingCenter && !isTemporaryWatch}
                                />
                                <Input
                                    id="currentOccupancy"
                                    label="Current Occupancy"
                                    type="number"
                                    {...register('currentOccupancy', { min: 0, validate: (val) => val <= watch('capacity') || 'Occupancy cannot exceed capacity' })}
                                    error={errors.currentOccupancy?.message}
                                />
                            </div>
                            <Input
                                id="contact"
                                label="General Contact Number"
                                {...register('contact', { required: 'Contact is required' })}
                                error={errors.contact?.message}
                            />
                            <Select
                                id="status"
                                label="Status"
                                options={statusOptions}
                                {...register('status', { required: 'Status is required' })}
                                error={errors.status?.message}
                            />
                             <Input
                                id="barangayId"
                                label="Assigned Barangay (Read-Only)"
                                type="text"
                                value={user?.barangayId?.replace('brgy-', 'Brgy. ').replace(/-/g, ' ').toUpperCase() || 'N/A'}
                                readOnly
                                disabled
                            />
                            <div>
                              <Controller
                                control={control}
                                name="services"
                                render={({ field: { onChange, value } }) => (
                                    <>
                                  <label className="block text-sm font-medium text-dark mb-2">Services Available</label>
                                  <div className="grid grid-cols-2 gap-2">
                                      {serviceOptions.map(option => (
                                          <div key={option.value} className="flex items-center">
                                              <input
                                                  type="checkbox"
                                                  id={`service-${option.value}`}
                                                  value={option.value}
                                                  checked={value?.includes(option.value as EvacCenterService) || false}
                                                  onChange={(e) => {
                                                      if (e.target.checked) {
                                                          onChange([...(value || []), option.value]);
                                                      } else {
                                                          onChange((value || []).filter(item => item !== option.value));
                                                      }
                                                  }}
                                                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                              />
                                              <label htmlFor={`service-${option.value}`} className="ml-2 block text-sm text-gray-700">
                                                  {option.label}
                                              </label>
                                          </div>
                                      ))}
                                  </div>
                                  </>
                                )}
                              />
                            </div>
                            <Input
                                id="imageUrl"
                                label="Image URL (Optional)"
                                {...register('imageUrl')}
                                error={errors.imageUrl?.message}
                            />
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">Barangay Location <span className="text-danger">*</span></label>
                                <Select
                                    id="barangayId"
                                    options={SURIGAO_CITY_BARANGAYS.map(b => ({
                                        value: b.id,
                                        label: `${b.displayName} - ${b.address}`,
                                    }))}
                                    {...register('barangayId', { required: 'Barangay is required' })}
                                    error={errors.barangayId?.message}
                                    disabled={!!editingCenter && !isTemporaryWatch}
                                />
                                {watch('barangayId') && getBarangayById(watch('barangayId')) && (
                                    <div className="mt-3 p-3 bg-brand-navy-light/10 rounded-md border border-[#BEE7F7]">
                                        <p className="text-sm font-semibold text-brand-navy">📍 Location Details:</p>
                                        <p className="text-sm text-brand-navy mt-1">
                                            <strong>Address:</strong> {getBarangayById(watch('barangayId'))?.address}
                                        </p>
                                        <p className="text-sm text-brand-navy mt-1">
                                            <strong>Direction:</strong> {getBarangayById(watch('barangayId'))?.direction}
                                        </p>
                                        <p className="text-sm text-brand-navy mt-1">
                                            <strong>Population:</strong> {getBarangayById(watch('barangayId'))?.population?.toLocaleString()} residents
                                        </p>
                                        <p className="text-sm text-brand-navy mt-2 italic">
                                            📌 Coordinates: {getBarangayById(watch('barangayId'))?.lat.toFixed(4)}, {getBarangayById(watch('barangayId'))?.lng.toFixed(4)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Persons Field Array */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">Contact Persons for this Center</label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border rounded-md bg-gray-50">
                                        <Input
                                            id={`contact-person-name-${index}`}
                                            placeholder="Name"
                                            {...register(`contactPersons.${index}.name`, { required: 'Name is required' })}
                                            error={errors.contactPersons?.[index]?.name?.message}
                                            className="col-span-1"
                                        />
                                        <Input
                                            id={`contact-person-phone-${index}`}
                                            placeholder="Phone"
                                            {...register(`contactPersons.${index}.phone`, { required: 'Phone is required' })}
                                            error={errors.contactPersons?.[index]?.phone?.message}
                                            className="col-span-1"
                                        />
                                        <Input
                                            id={`contact-person-role-${index}`}
                                            placeholder="Role"
                                            {...register(`contactPersons.${index}.role`)}
                                            error={errors.contactPersons?.[index]?.role?.message}
                                            className="col-span-1"
                                        />
                                        <div className="flex items-center justify-end md:justify-start">
                                            <Button type="button" variant="danger" size="sm" onClick={() => remove(index)}>Remove</Button>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="ghost" onClick={() => append({ name: '', phone: '', role: '' })} className="mt-2 w-full">
                                    Add Contact Person
                                </Button>
                            </div>
                            {/* Hidden field for temporary flag when creating new */}
                            {!editingCenter && <input type="hidden" {...register('isTemporary', { value: true })} />}
                        </form>
                    }
                />
            )}
        </Card>
    );
};

export default BarangayEvacuationCenterManagement;