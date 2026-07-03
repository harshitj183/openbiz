// Step 1: Aadhaar & OTP Verification

'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useApi } from '@/hooks/useApi';
import { getStep1Fields } from '@/lib/schema';
import { ValidationEngine } from '@/lib/validation';

interface Step1FormProps {
  onComplete: (data: Record<string, string | boolean>) => void;
}

export function Step1Form({ onComplete }: Step1FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpResending, setOtpResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = getStep1Fields();
  const { errors, validateField, validateAll, clearErrors } =
    useFormValidation(fields);
  const { loading: apiLoading, error: apiError, validateAadhaar, verifyOTP } = useApi();

  const handleFieldChange = useCallback(
    (fieldName: string, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Clear error on change
      validateField(fieldName, value);
    },
    [validateField]
  );

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Aadhaar field
    const aadhaarField = fields.find((f) => f.name === 'AadhaarNo');
    if (!aadhaarField) return;

    const aadhaarValue = formData['AadhaarNo'] || '';
    const error = validateField('AadhaarNo', aadhaarValue);
    if (error) return;

    // Validate consent
    const consentError = validateField('AadhaarConsent', formData['AadhaarConsent']);
    if (consentError) return;

    setIsLoading(true);

    try {
      const response = await validateAadhaar(String(aadhaarValue));
      if (response?.success) {
        setOtpRequested(true);
        setSuccessMessage('OTP sent to your registered mobile number');
      } else {
        setErrorMessage(response?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate OTP field
    const otpError = validateField('OTP', formData['OTP'] || '');
    if (otpError) return;

    setIsLoading(true);

    try {
      const response = await verifyOTP(
        String(formData['AadhaarNo']),
        String(formData['OTP'])
      );
      if (response?.success) {
        setSuccessMessage('OTP verified successfully!');
        const completedData = {
          aadhaar: formData['AadhaarNo'],
          aadhaar_verified: true,
          otp_verified_at: new Date().toISOString(),
        };
        // Save to localStorage so Step 2 can access it
        if (typeof window !== 'undefined') {
          localStorage.setItem('step1Data', JSON.stringify(completedData));
        }
        setTimeout(() => {
          onComplete(completedData);
          router.push('/step2');
        }, 1500);
      } else {
        setErrorMessage(response?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Verification failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await validateAadhaar(String(formData['AadhaarNo']));
      if (response?.success) {
        setSuccessMessage('OTP resent successfully');
      } else {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setOtpResending(false);
    }
  };

  return (
    <form className="space-y-6 animate-slide-up">
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

      {/* Aadhaar & Consent (Step 1 - Always visible) */}
      {!otpRequested && (
        <div className="space-y-6">
          {fields
            .filter((f) => !f.conditional || f.conditional === '')
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
            onClick={handleRequestOTP}
            isLoading={isLoading || apiLoading}
            fullWidth
            size="lg"
            disabled={!formData['AadhaarNo'] || !formData['AadhaarConsent']}
          >
            Send OTP
          </Button>
        </div>
      )}

      {/* OTP Verification (Step 2 - Shown after OTP request) */}
      {otpRequested && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Enter the 6-digit OTP sent to your registered mobile number. OTP expires in 10 minutes.
            </p>
          </div>

          {fields
            .filter((f) => f.conditional === 'shown_after_otp_request')
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

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyOTP}
              isLoading={isLoading || apiLoading}
              fullWidth
              size="lg"
              disabled={!formData['OTP']}
            >
              Verify OTP
            </Button>
          </div>

          <button
            onClick={handleResendOTP}
            disabled={otpResending}
            className="w-full text-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors disabled:text-gray-400"
          >
            {otpResending ? 'Resending...' : 'Resend OTP'}
          </button>

          <button
            onClick={() => {
              setOtpRequested(false);
              setFormData((prev) => {
                const { OTP, ...rest } = prev;
                return rest;
              });
            }}
            disabled={isLoading || apiLoading}
            className="w-full text-center text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      )}

      {isLoading && <Spinner text="Processing..." />}
    </form>
  );
}
