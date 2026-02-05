import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import GuestLayout from '@/layouts/GuestLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useNotification } from '@/hooks/useNotifications';
import { submitIncidentReport } from '@/api/guest';
import { IncidentType } from '@/types/guest';

interface IncidentReportFormInputs {
  reporterName: string;
  reporterContact?: string;
  location: string;
  type: IncidentType;
  description: string;
  imageFiles?: FileList;
}

const incidentTypeOptions = Object.values(IncidentType).map(type => ({ value: type, label: type }));

const GuestIncidentReportPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<IncidentReportFormInputs>({
        mode: 'onBlur',
        defaultValues: {
            reporterName: '',
            reporterContact: '',
            location: '',
            type: undefined,
            description: '',
        }
    });

    const { addNotification } = useNotification();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const onSubmit: SubmitHandler<IncidentReportFormInputs> = async (data) => {
        console.log('Form data received:', data);
        console.log('reporterName value:', data.reporterName, 'type:', typeof data.reporterName, 'length:', data.reporterName?.length);
        console.log('reporterContact value:', data.reporterContact, 'type:', typeof data.reporterContact, 'length:', data.reporterContact?.length);
        
        // Validate location details
        if (!data.location || data.location.trim() === '') {
            addNotification({ type: 'error', message: 'Please provide the incident location.' });
            return;
        }
        
        // Validate required fields
        if (!data.type) {
            addNotification({ type: 'error', message: 'Please select an incident type.' });
            return;
        }
        
        const descriptionValue = data.description ? String(data.description).trim() : '';
        if (!descriptionValue || descriptionValue === '') {
            addNotification({ type: 'error', message: 'Please provide a description of the incident.' });
            return;
        }

        try {
            // FormData preparation for files (if any) - simplified for dummy API
            const imageFilesArray = data.imageFiles ? Array.from(data.imageFiles) : [];

            const payload = {
                reporterName: data.reporterName,
                reporterContact: data.reporterContact,
                location: { lat: 9.7785, lng: 125.4944 }, // Default Surigao City coordinates
                locationDescription: data.location,
                type: data.type,
                description: descriptionValue,
                imageFiles: imageFilesArray
            };

            console.log('Submitting incident report payload (guest):', payload);

            const result = await submitIncidentReport(payload);
            console.log('submitIncidentReport result:', result);

            setConfirmationMessage('Your incident report has been submitted successfully. Thank you for helping your community. An admin will review your report shortly.');
            setIsConfirmationOpen(true);
        } catch (err: any) {
            console.error('Incident report submission failed:', err);
            addNotification({ type: 'error', message: err.message || 'Failed to submit report. Please try again.' });
        }
    };

    return (
        <GuestLayout>
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <Card title="Community Incident Report" className="bg-gradient-to-br from-[#f0f5ff] to-white shadow-xl">
                <p className="text-brand-teal mb-6 text-center font-medium text-lg">
                    🚨 Report an emergency incident to alert authorities and the community.
                    Your report will be reviewed by administrators.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="p-4 bg-brand-navy-light/10 border-l-4 border-brand-teal rounded">
                        <p className="text-sm text-brand-navy"><strong>📝 Note:</strong> All fields marked with * are required. Your contact information helps us follow up on urgent matters.</p>
                    </div>

                    <Input
                        id="reporterName"
                        label="Your Name (Optional)"
                        type="text"
                        placeholder="Enter your name or leave blank for Anonymous"
                        {...register('reporterName')}
                        error={errors.reporterName?.message}
                    />

                    <Input
                        id="reporterContact"
                        label="Your Contact Number (Optional)"
                        type="tel"
                        placeholder="e.g., 09123456789"
                        {...register('reporterContact')}
                        error={errors.reporterContact?.message}
                    />

                    <Input
                        id="location"
                        label="Incident Location *"
                        type="text"
                        placeholder="e.g., Barangay Rosario, Maharlika Street near the market"
                        {...register('location', {
                            required: 'Location is required'
                        })}
                        error={errors.location?.message}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select
                                {...field}
                                id="type"
                                label="Type of Emergency *"
                                options={incidentTypeOptions}
                                placeholder="Select an emergency type"
                                error={errors.type?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id="description"
                                label="Description of Incident *"
                                placeholder="Provide a detailed description of the incident..."
                                rows={5}
                                error={errors.description?.message}
                            />
                        )}
                    />

                    <div className="p-4 bg-brand-navy-light/5 border border-brand-teal/40 rounded">
                        <label htmlFor="imageFiles" className="block text-sm font-semibold text-brand-navy mb-2">
                            📸 Photo (Optional)
                        </label>
                        <input
                            id="imageFiles"
                            type="file"
                            accept="image/*"
                            multiple
                                {...register('imageFiles', {
                                validate: {
                                    maxSize: (files) => {
                                        if (files && files.length > 0) {
                                            for (let i = 0; i < files.length; i++) {
                                                if (files[i].size > 5 * 1024 * 1024) {
                                                    return "Each image must be less than 5MB.";
                                                }
                                            }
                                        }
                                        return true;
                                    },
                                    maxCount: (files) => (!files || files.length <= 3) || "You can upload a maximum of 3 images.",
                                }
                            })}
                                className="block w-full text-sm text-brand-teal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-teal file:text-white hover:file:bg-brand-teal/80 cursor-pointer"
                        />
                        {errors.imageFiles && <p className="mt-2 text-sm text-red-600 font-medium">{errors.imageFiles.message}</p>}
                            <p className="text-xs text-brand-teal mt-2">Max 3 images, 5MB each</p>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-brand-navy-alt to-brand-navy hover:from-brand-navy hover:to-brand-navy-alt text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-200"
                            variant="primary"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '⏳ Submitting...' : '📤 Submit Report'}
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
                onConfirm={() => {
                    setIsConfirmationOpen(false);
                    window.location.reload();
                }}
                title="✅ Report Submitted"
                message={confirmationMessage}
                confirmText="Done"
                cancelText=""
            />
        </div>
    </GuestLayout>
);
};

export default GuestIncidentReportPage;