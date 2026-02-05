import React, { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

import ConfirmationModal from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNotification } from '@/hooks/useNotifications';
import {
  getAdminEvacuationCenters,
  createEvacuationCenter,
  updateEvacuationCenter,
  deleteEvacuationCenter,
} from '@/api/admin';
import { AdminEvacuationCenter } from '@/types/admin';
import { EvacCenterStatus, EvacCenterService } from '@/types/guest';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { SURIGAO_CITY_BARANGAYS, getBarangayById } from '@/lib/barangayData';
import { geocodeAddress } from '@/lib/geocode';
import MapPicker from '@/components/common/MapPicker';

type EvacuationCenterFormInputs = {
    name: string;
    address: string;
    capacity: number;
    currentOccupancy: number; // Admin can set this
    contact: string;
    status: EvacCenterStatus;
    barangayId: string; // Admin assigns this
    services: EvacCenterService[];
    imageUrl?: string;
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

const barangayOptions = SURIGAO_CITY_BARANGAYS.map(b => ({ value: b.id, label: b.displayName }));


function ErrorFallback({ error }: { error: Error }) {
    return (
        <Card title="Evacuation Center Management" className="min-h-[500px] flex flex-col justify-center items-center text-danger">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="mb-2">{error.message}</p>
            <pre className="text-xs bg-gray-100 p-2 rounded max-w-xl overflow-x-auto">{error.stack}</pre>
        </Card>
    );
}

const AdminEvacuationCenterManagement: React.FC = () => {
    const [centers, setCenters] = useState<AdminEvacuationCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [isMapPickerOpen, setIsMapPickerOpen] = useState<boolean>(false);
    const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [editingCenter, setEditingCenter] = useState<AdminEvacuationCenter | null>(null);
    const { addNotification } = useNotification();

    const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<EvacuationCenterFormInputs>({
        defaultValues: {
            name: '',
            address: '',
            capacity: 0,
            currentOccupancy: 0,
            contact: '',
            status: 'Open',
            barangayId: '',
            services: [],
            imageUrl: '',
        },
    });

    const fetchCenters = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAdminEvacuationCenters();
            setCenters(data);
        } catch (err) {
            console.error("Failed to fetch evacuation centers:", err);
            setError("Failed to load evacuation centers. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    const handleOpenCreateForm = () => {
        setEditingCenter(null);
        setPickedLocation(null); // Reset picked location for new center
        reset({ // Reset with empty values for creation
                name: '',
                address: '',
                capacity: 0,
                currentOccupancy: 0,
                contact: '',
                status: 'Open',
                barangayId: '',
                services: [],
                imageUrl: '',
            });
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (center: AdminEvacuationCenter) => {
        try {
            setEditingCenter(center);
            // Ensure services is an array
            const servicesArray = Array.isArray(center.services) ? center.services : [];
            reset({ // Populate form with existing data
                name: center.name || '',
                address: center.address || '',
                capacity: center.capacity || 0,
                currentOccupancy: center.currentOccupancy || 0,
                contact: center.contact || '',
                status: center.status || 'Open',
                barangayId: center.barangayId || '',
                services: servicesArray,
                imageUrl: center.imageUrl || '',
            });
            setIsFormModalOpen(true);
        } catch (err) {
            console.error('❌ Error opening edit form:', err);
            addNotification({ type: 'error', message: 'Failed to open edit form. Please try again.' });
        }
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        // Prevent form submission on Enter key press
        // Only allow submission via the Confirm button click
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const onSubmit: SubmitHandler<EvacuationCenterFormInputs> = async (data) => {
        try {
            console.log('📝 Form submitted with data:', data);
            console.log('📍 Picked location:', pickedLocation);
            console.log('✏️ Editing center:', editingCenter?.id || 'NEW');
            
            // Picking a location is optional: prefer manual pick, then geocoded address, then barangay centroid
            
            // Restructure form data to match AdminEvacuationCenter type
                    const barangay = data.barangayId ? getBarangayById(data.barangayId) : null;
                    console.log('🏘️ Selected barangay:', data.barangayId, barangay ? `${barangay.displayName} (${barangay.lat}, ${barangay.lng})` : 'NOT FOUND');
                                    // Try geocoding the provided address for more accurate placement. Fall back to barangay centroid.
                                    let geocoded: { lat: number; lng: number } | null = null;
                                    if (data.address && data.address.trim().length > 0) {
                                        try {
                                            geocoded = await geocodeAddress(`${data.address}, ${barangay ? barangay.displayName : ''}`);
                                            if (geocoded) console.log('🗺️ Geocoded address to', geocoded);
                                        } catch (e) {
                                            console.warn('Geocoding exception, falling back to barangay coords', e);
                                            geocoded = null;
                                        }
                                    }

                                    // prefer manual pick if available
                                    const finalLocation = pickedLocation ? pickedLocation : null;

                                    // Ensure location coordinates are valid numbers
                                    const getLat = (): number => {
                                        if (finalLocation && typeof finalLocation.lat === 'number' && !isNaN(finalLocation.lat)) return finalLocation.lat;
                                        if (geocoded && typeof geocoded.lat === 'number' && !isNaN(geocoded.lat)) return geocoded.lat;
                                        if (barangay && typeof barangay.lat === 'number' && !isNaN(barangay.lat)) return barangay.lat;
                                        return 9.7785; // Default Surigao City
                                    };

                                    const getLng = (): number => {
                                        if (finalLocation && typeof finalLocation.lng === 'number' && !isNaN(finalLocation.lng)) return finalLocation.lng;
                                        if (geocoded && typeof geocoded.lng === 'number' && !isNaN(geocoded.lng)) return geocoded.lng;
                                        if (barangay && typeof barangay.lng === 'number' && !isNaN(barangay.lng)) return barangay.lng;
                                        return 125.4944; // Default Surigao City
                                    };

                                    const centerData = {
                                            name: data.name,
                                            address: data.address,
                                            capacity: Number(data.capacity),
                                            currentOccupancy: Number(data.currentOccupancy),
                                            contact: data.contact,
                                            status: data.status,
                                            barangayId: data.barangayId,
                                            services: data.services || [],
                                            imageUrl: data.imageUrl || undefined,
                                            location: {
                                                lat: getLat(),
                                                lng: getLng(),
                                            },
                                        };

            console.log('📦 Formatted center data:', centerData);

            try {
                if (editingCenter) {
                    console.log('🔧 Updating evacuation center:', editingCenter.id);
                    await updateEvacuationCenter(editingCenter.id, centerData);
                    addNotification({ type: 'success', message: 'Evacuation center updated successfully!' });
                } else {
                    console.log('✅ Creating new evacuation center');
                    await createEvacuationCenter(centerData as Omit<AdminEvacuationCenter, 'id' | 'lastUpdated'>);
                    addNotification({ type: 'success', message: 'Evacuation center created successfully!' });
                }
                setIsFormModalOpen(false);
                // Re-fetch data after a brief delay to ensure backend updates are reflected
                setTimeout(() => {
                    try {
                        fetchCenters();
                    } catch (e) {
                        console.error('Error fetching centers after save:', e);
                    }
                }, 500);
            } catch (err: any) {
                console.error("❌ Failed to save evacuation center:", err);
                addNotification({ type: 'error', message: err.message || 'Failed to save evacuation center.' });
            }
        } catch (err: any) {
            console.error('❌ Unexpected error in onSubmit:', err);
            addNotification({ type: 'error', message: 'An unexpected error occurred.' });
        }
    };

    const confirmDelete = async (centerId: string) => {
        try {
            await deleteEvacuationCenter(centerId);
            addNotification({ type: 'success', message: 'Evacuation center deleted successfully!' });
            setIsDeleteModalOpen(false);
            fetchCenters(); // Re-fetch data
        } catch (err: any) {
            console.error("Failed to delete evacuation center:", err);
            addNotification({ type: 'error', message: err.message || 'Failed to delete evacuation center.' });
        }
    };

    if (loading) {
        return (
            <Card title="Evacuation Center Management" className="min-h-[500px] flex justify-center items-center">
                <LoadingSpinner size="lg" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Evacuation Center Management" className="min-h-[500px] flex justify-center items-center text-danger">
                <p>{error}</p>
            </Card>
        );
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Card title="Evacuation Center Management" className="bg-gradient-to-br from-[#F7FAFC] to-white">
            <div className="flex justify-end mb-6 pb-4 border-b-2 border-brand-teal/30">
                <Button onClick={handleOpenCreateForm} variant="primary" className="bg-gradient-to-r from-brand-navy-alt to-brand-navy hover:from-brand-navy hover:to-brand-navy-alt text-white shadow-lg">
                    ➕ Add New Evacuation Center
                </Button>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-2xl border-2 border-brand-navy/10 bg-gradient-to-br from-white to-brand-white">
                <table className="min-w-full divide-y divide-brand-teal/20">
                    <thead className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Contact
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Capacity
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Occupancy
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Services
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                Barangay
                            </th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {centers.length > 0 ? (
                            centers.map((center, idx) => (
                                <tr key={center.id} className={`${idx % 2 === 0 ? 'bg-brand-navy/2' : 'bg-brand-teal/3'} hover:bg-gradient-to-r hover:from-brand-teal/15 hover:to-brand-navy/10 border-l-4 border-l-transparent hover:border-l-brand-teal transition-all duration-200`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-navy">{center.name}</td>
                                    <td className="px-6 py-4 text-sm text-brand-navy-alt">{center.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-navy-light">{center.contact || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-teal">{center.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-teal">{center.currentOccupancy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                            center.status === 'Open' ? 'bg-brand-teal/20 text-brand-teal border-brand-teal' :
                                            center.status === 'Full' ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow' :
                                            'bg-gray-100 text-gray-800 border-gray-300'
                                        }`}>
                                            {center.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-block px-2 py-1 bg-brand-navy-light/10 text-brand-navy rounded text-xs font-medium border border-brand-teal/40\">
                                            {Array.isArray(center.services) && center.services.length > 0 ? center.services.join(', ') : 'None'}
                                        </span>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-teal font-medium">{getBarangayById(center.barangayId)?.displayName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(center)} className="bg-brand-teal hover:bg-brand-teal/80 text-white\">
                                                ✏️ Edit
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => { setEditingCenter(center); setIsDeleteModalOpen(true); }}>
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center">
                                    <div className="text-brand-navy/50 text-lg">🏢 No evacuation centers found.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && (
                <ConfirmationModal
                    isOpen={isFormModalOpen}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setPickedLocation(null);
                    }}
                    onConfirm={() => {
                        try {
                            console.log('🔘 Confirm button clicked - triggering form submit');
                            const form = document.getElementById('evac-center-form') as HTMLFormElement;
                            if (form) {
                                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                            }
                        } catch (err) {
                            console.error('❌ Error submitting form:', err);
                            addNotification({ type: 'error', message: 'Failed to submit form. Please try again.' });
                        }
                    }}
                    title={editingCenter ? 'Edit Evacuation Center' : 'Add New Evacuation Center'}
                    confirmText={editingCenter ? 'Save Changes' : 'Create Center'}
                    cancelText="Cancel"
                    isConfirming={isSubmitting}
                    disableConfirm={false}
                    message={
                        <form id="evac-center-form" className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
                            <Input
                                id="name"
                                label="Name"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                            />
                            <Input
                                id="address"
                                label="Address"
                                {...register('address', { required: 'Address is required' })}
                                error={errors.address?.message}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="capacity"
                                    label="Capacity"
                                    type="number"
                                    {...register('capacity', { required: 'Capacity is required', min: 1 })}
                                    error={errors.capacity?.message}
                                />
                                <Input
                                    id="currentOccupancy"
                                    label="Current Occupancy"
                                    type="number"
                                    {...register('currentOccupancy', {
                                        min: 0,
                                        validate: (val) => {
                                            const capacity = watch('capacity');
                                            return (Number(val) || 0) <= (Number(capacity) || 0) || 'Occupancy cannot exceed capacity';
                                        }
                                    })}
                                    error={errors.currentOccupancy?.message}
                                />
                            </div>
                            <Input
                                id="contact"
                                label="Contact Number"
                                {...register('contact', { required: 'Contact is required' })}
                                error={errors.contact?.message}
                            />
                            <Select
                                id="status"
                                label="Status"
                                options={statusOptions}
                                {...register('status')}
                                error={errors.status?.message}
                            />
                            <Select
                                id="barangayId"
                                label="Assigned Barangay"
                                options={barangayOptions}
                                placeholder="Select Barangay"
                                {...register('barangayId')}
                                error={errors.barangayId?.message}
                            />
                            <div className="mt-3">
                                {/* Show barangay details when selected */}
                                {(() => {
                                    const selectedId = watch('barangayId');
                                    const brgy = selectedId ? getBarangayById(selectedId) : null;
                                    if (!brgy) return null;
                                    
                                    // Defensive checks for location data
                                    const validLat = typeof brgy.lat === 'number' && !isNaN(brgy.lat) ? brgy.lat : 9.7785;
                                    const validLng = typeof brgy.lng === 'number' && !isNaN(brgy.lng) ? brgy.lng : 125.4944;
                                    
                                    return (
                                        <div className="p-3 border rounded bg-gray-50">
                                            <div className="text-sm font-semibold">Location Details</div>
                                            <div className="text-sm text-dark/70">{brgy.displayName} — {brgy.address}</div>
                                            <div className="text-sm text-dark/60">Direction: {brgy.direction}</div>
                                            <div className="text-sm text-dark/60">Population: {brgy.population?.toLocaleString() || 'N/A'}</div>
                                            <div className="text-sm text-dark/60">Coords: {validLat.toFixed(6)}, {validLng.toFixed(6)}</div>
                                            <div className="mt-2">
                                                <Button type="button" size="sm" variant="outline" onClick={() => {
                                                    // open map picker initialized at barangay centroid with validated coordinates
                                                    // But don't set pickedLocation here - only open the map picker
                                                    // User must actually pick on the map to set location
                                                    setIsMapPickerOpen(true);
                                                }} disabled={!editingCenter && isSubmitting}>
                                                    Pick exact location on map
                                                </Button>
                                                {pickedLocation && typeof pickedLocation.lat === 'number' && typeof pickedLocation.lng === 'number' && !isNaN(pickedLocation.lat) && !isNaN(pickedLocation.lng) && (
                                                    <div className="text-xs text-success mt-2">✓ Location picked: {pickedLocation.lat.toFixed(6)}, {pickedLocation.lng.toFixed(6)}</div>
                                                )}
                                                {!editingCenter && !pickedLocation && (
                                                    <div className="text-xs text-gray-600 mt-2">ℹ️ Optional: click the button above to pick a more precise location on the map (defaults to barangay centroid).</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div>
                              <Controller
                                control={control}
                                name="services"
                                render={({ field: { onChange, value } }) => {
                                    // Ensure value is an array
                                    const servicesArray = Array.isArray(value) ? value : [];
                                    return (
                                    <>
                                      <label className="block text-sm font-medium text-dark mb-2">Services Available</label>
                                      <div className="grid grid-cols-2 gap-2">
                                          {serviceOptions.map(option => (
                                              <div key={option.value} className="flex items-center">
                                                  <input
                                                      type="checkbox"
                                                      id={`service-${option.value}`}
                                                      value={option.value}
                                                      checked={servicesArray.includes(option.value as EvacCenterService) || false}
                                                  onChange={(e) => {
                                                      const currentArray = Array.isArray(value) ? value : [];
                                                      if (e.target.checked) {
                                                          onChange([...currentArray, option.value]);
                                                      } else {
                                                          onChange(currentArray.filter(item => item !== option.value));
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
                                );
                                }}
                              />
                            </div>
                            <Input
                                id="imageUrl"
                                label="Image URL (Optional)"
                                {...register('imageUrl')}
                                error={errors.imageUrl?.message}
                            />
                            {/* Coordinates are derived from selected barangay */}
                        </form>
                    }
                />
            )}

            {isMapPickerOpen && (
                <ConfirmationModal
                    isOpen={isMapPickerOpen}
                    onClose={() => setIsMapPickerOpen(false)}
                    onConfirm={() => {}}
                    title="Pick Exact Location"
                    showButtons={false}
                    message={
                        <MapPicker
                            initial={(() => {
                                // If already picked, use that location
                                if (pickedLocation?.lat && pickedLocation?.lng && typeof pickedLocation.lat === 'number' && typeof pickedLocation.lng === 'number' && !isNaN(pickedLocation.lat) && !isNaN(pickedLocation.lng)) {
                                    return pickedLocation;
                                }
                                // Otherwise, use selected barangay coordinates if available
                                const selectedBarangayId = watch('barangayId');
                                const brgy = selectedBarangayId ? getBarangayById(selectedBarangayId) : null;
                                if (brgy && typeof brgy.lat === 'number' && typeof brgy.lng === 'number' && !isNaN(brgy.lat) && !isNaN(brgy.lng)) {
                                    return { lat: brgy.lat, lng: brgy.lng };
                                }
                                // Default to Surigao City
                                return { lat: 9.7785, lng: 125.4944 };
                            })()}
                            onConfirm={(c) => {
                                if (typeof c.lat === 'number' && typeof c.lng === 'number' && !isNaN(c.lat) && !isNaN(c.lng)) {
                                    setPickedLocation(c);
                                    setIsMapPickerOpen(false);
                                }
                            }}
                            onCancel={() => setIsMapPickerOpen(false)}
                        />
                    }
                />
            )}

            {editingCenter && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => confirmDelete(editingCenter.id)}
                    title="Confirm Delete Evacuation Center"
                    message={`Are you sure you want to delete "${editingCenter.name || 'Unknown'}" at "${editingCenter.address || 'Unknown location'}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                />
            )}
        </Card>
    </ErrorBoundary>
);
};

export default AdminEvacuationCenterManagement;