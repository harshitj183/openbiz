// Step 2: PAN & Business Details

'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useApi } from '@/hooks/useApi';
import { getStep2Fields } from '@/lib/schema';
import { ValidationEngine } from '@/lib/validation';

interface Step2FormProps {
  step1Data: Record<string, string | boolean>;
  onComplete: (data: Record<string, string | boolean>) => void;
}

export function Step2Form({ step1Data, onComplete }: Step2FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = getStep2Fields();
  const { errors, validateField, validateAll, clearErrors } =
    useFormValidation(fields);
  const { loading: apiLoading, error: apiError, validatePAN, submitRegistration } =
    useApi();

  const handleFieldChange = useCallback(
    (fieldName: string, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Auto-format PAN
      if (fieldName === 'PANNo') {
        const formatted = ValidationEngine.formatPAN(String(value));
        if (formatted !== String(value)) {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: formatted,
          }));
        }
      }

      // Clear error on change
      validateField(fieldName, value);
    },
    [validateField]
  );

  const handleValidatePAN = async () => {
    setErrorMessage(null);
    clearErrors();

    const pan = String(formData['PANNo'] || '');
    const name = String(formData['PANName'] || '');

    // Validate locally first
    const panError = validateField('PANNo', pan);
    const nameError = validateField('PANName', name);
    if (panError || nameError) return;

    setIsLoading(true);

    try {
      const response = await validatePAN(pan, name);
      if (response?.success) {
        setSuccessMessage('PAN verified successfully!');
      } else {
        setErrorMessage(response?.message || 'PAN verification failed. Please check and try again.');
      }
    } catch (err) {
      setErrorMessage('Verification failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate all fields
    if (!validateAll(formData)) {
      setErrorMessage('Please correct the errors in the form.');
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        ...step1Data,
        ...formData,
      };

      const response = await submitRegistration(submissionData);
      if (response?.success) {
        setSuccessMessage('Registration submitted successfully!');
        const registrationId =
          (response.data as any)?.registration_id ||
          (response as any)?.registration_id ||
          'UDYAM-2026-001';
        // Clear step data from localStorage
        localStorage.removeItem('step1Data');
        setTimeout(() => {
          onComplete(submissionData);
          router.push(`/success/${registrationId}`);
        }, 1500);
      } else {
        setErrorMessage(
          response?.message || 'Submission failed. Please try again.'
        );
      }
    } catch (err) {
      setErrorMessage('Submission failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/step1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      {/* Alerts */}
      <div className="space-y-3">
        {successMessage && (
          <Alert message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
        )}
        {(errorMessage || apiError) && (
          <Alert
            message={errorMessage || apiError || ''}
            type="error"
            onClose={() => {
              setErrorMessage(null);
            }}
            autoClose={false}
          />
        )}
      </div>

      {/* PAN Section */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900">PAN Verification</h3>
        <div className="space-y-4">
          {fields
            .filter((f) => ['PANNo', 'PANName'].includes(f.name))
            .map((field) => (
              <InputField
                key={field.name}
                field={field}
                value={formData[field.name] ?? ''}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={isLoading || apiLoading}
              />
            ))}
          <Button
            type="button"
            onClick={handleValidatePAN}
            variant="outline"
            isLoading={isLoading || apiLoading}
            fullWidth
            disabled={!formData['PANNo'] || !formData['PANName']}
          >
            Verify PAN
          </Button>
        </div>
      </div>

      {/* Business Details Section */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900">Business Information</h3>
        <div className="space-y-4">
          {fields
            .filter((f) =>
              [
                'BusinessName',
                'BusinessType',
                'BusinessSector',
              ].includes(f.name)
            )
            .map((field) => (
              <InputField
                key={field.name}
                field={field}
                value={formData[field.name] ?? ''}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={isLoading || apiLoading}
              />
            ))}
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900">Contact Information</h3>
        <div className="space-y-4">
          {fields
            .filter((f) => ['Mobile', 'Email'].includes(f.name))
            .map((field) => (
              <InputField
                key={field.name}
                field={field}
                value={formData[field.name] ?? ''}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={isLoading || apiLoading}
              />
            ))}
        </div>
      </div>

      {/* Address Details Section */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900">Address Information</h3>
        <div className="space-y-4">
          {fields
            .filter((f) =>
              ['State', 'Pincode', 'City', 'Address'].includes(f.name)
            )
            .map((field) => (
              <InputField
                key={field.name}
                field={field}
                value={formData[field.name] ?? ''}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={isLoading || apiLoading}
              />
            ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        {fields
          .filter((f) => f.type === 'checkbox')
          .map((field) => (
            <InputField
              key={field.name}
              field={field}
              value={formData[field.name] ?? false}
              onChange={(value) => handleFieldChange(field.name, value)}
              error={errors[field.name]}
              disabled={isLoading || apiLoading}
            />
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          size="lg"
          disabled={isLoading || apiLoading}
          fullWidth
        >
          Go Back
        </Button>
        <Button
          type="submit"
          isLoading={isLoading || apiLoading}
          size="lg"
          fullWidth
          disabled={!formData['AgreeTerms']}
        >
          Submit Registration
        </Button>
      </div>

      {isLoading && <Spinner text="Submitting..." />}
    </form>
  );
}
