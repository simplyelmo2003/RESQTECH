import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { submitOfficialIncidentReport } from '@/api/barangay';
import { IncidentType } from '@/types/guest';
import { OfficialIncidentUrgency } from '@/types/barangay';

interface IncidentReportFormInputs {
  location: string;
  type: IncidentType;
  description: string;
  reporterContact?: string;
  affectedHouseholds?: number;
  urgency: OfficialIncidentUrgency;
  imageFiles?: FileList;
}

const incidentTypeOptions = Object.values(IncidentType).map(type => ({ value: type, label: type }));
const urgencyOptions = Object.values(OfficialIncidentUrgency).map(urgency => ({ value: urgency, label: urgency }));

const BarangayIncidentReportForm: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IncidentReportFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      location: '',
      type: undefined,
      description: '',
      reporterContact: '',
      affectedHouseholds: 0,
      urgency: 'Medium',
    }
  });

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const onSubmit: SubmitHandler<IncidentReportFormInputs> = async (data) => {
    // Validate location
    if (!data.location || data.location.trim() === '') {
      addNotification({ type: 'error', message: 'Please provide the incident location.' });
      return;
    }

    // Validate incident type
    if (!data.type) {
      addNotification({ type: 'error', message: 'Please select an incident type.' });
      return;
    }

    // Validate description
    const descriptionValue = data.description ? String(data.description).trim() : '';
    if (!descriptionValue || descriptionValue === '') {
      addNotification({ type: 'error', message: 'Please provide a description of the incident.' });
      return;
    }

    try {
      if (!user?.id || !user?.barangayId) {
        addNotification({ type: 'error', message: 'User information not available.' });
        return;
      }

      // Convert image files to data URLs (same as guest form)
      const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const imageUrls = data.imageFiles && data.imageFiles.length > 0
        ? await Promise.all(Array.from(data.imageFiles).map((f) => readFileAsDataUrl(f)))
        : [];

      await submitOfficialIncidentReport(
        {
          barangayId: user.barangayId,
          locationDescription: data.location,
          type: data.type,
          description: descriptionValue,
          reporterContact: data.reporterContact || '',
          affectedHouseholds: data.affectedHouseholds || 0,
          urgency: data.urgency,
          status: 'Pending',
          reporterName: user.username || 'Barangay Official',
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        },
        user.id,
        user.username || 'Barangay Official'
      );

      setConfirmationMessage('Your incident report has been submitted successfully. Administrators will review and verify the details.');
      setIsConfirmationOpen(true);
    } catch (err: any) {
      console.error("Incident report submission failed:", err);
      addNotification({ type: 'error', message: err.message || 'Failed to submit report. Please try again.' });
    }
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <Card title="Incident Report" className="p-6">
        <p className="text-gray-600 mb-6 text-center">
          Report an emergency incident in your barangay. This report will be logged and reviewed by administrators.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="location"
            label="Incident Location"
            type="text"
            placeholder="e.g., Purok 1, near the barangay hall"
            {...register('location', {
              required: 'Location is required'
            })}
            error={errors.location?.message}
          />

          <Input
            id="reporterContact"
            label="Reporter Contact (Phone / Mobile)"
            type="tel"
            placeholder="e.g., 09123456789"
            {...register('reporterContact', {
              required: 'Contact number is required',
              pattern: {
                value: /^[0-9\-\+\s]{7,}$/,
                message: 'Please enter a valid contact number'
              }
            })}
            error={errors.reporterContact?.message}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                {...field}
                id="type"
                label="Type of Emergency"
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
                label="Description of Incident"
                placeholder="Provide a detailed description of the incident..."
                rows={5}
                error={errors.description?.message}
              />
            )}
          />

          <Input
            id="affectedHouseholds"
            label="Affected Households (Optional)"
            type="number"
            min="0"
            {...register('affectedHouseholds', {
              valueAsNumber: true
            })}
            error={errors.affectedHouseholds?.message}
          />

          <Controller
            control={control}
            name="urgency"
            render={({ field }) => (
              <Select
                {...field}
                id="urgency"
                label="Urgency Level"
                options={urgencyOptions}
                error={errors.urgency?.message}
              />
            )}
          />

          <div>
            <label htmlFor="imageFiles" className="block text-sm font-medium text-dark mb-2">
              Photo (Optional)
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
                        if (files[i].size > 5 * 1024 * 1024) { // 5MB limit
                          return "Each image must be less than 5MB.";
                        }
                      }
                    }
                    return true;
                  },
                  maxCount: (files) => (!files || files.length <= 3) || "You can upload a maximum of 3 images.",
                }
              })}
              className="block w-full text-sm text-dark file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
            />
            {errors.imageFiles && <p className="mt-1 text-sm text-danger">{errors.imageFiles.message}</p>}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationClose}
        title="Report Submitted"
        message={confirmationMessage}
        confirmText="Done"
        cancelText=""
      />
    </div>
  );
};

export default BarangayIncidentReportForm;
