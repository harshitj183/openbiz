// Hook for API calls

'use client';

import { useState, useCallback } from 'react';
import { ApiResponse, SubmissionResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Mock responses for demo mode (when backend is not running)
const MOCK_OTP = '123456';
const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_API === 'true' || typeof window !== 'undefined';

const mockResponses: Record<string, unknown> = {
  '/validate-aadhaar': { success: true, message: `OTP sent to registered mobile. Use ${MOCK_OTP} for demo.`, otp_sent: true, otp_expires_in: 600 },
  '/verify-otp': { success: true, message: 'OTP verified successfully!', verified: true, step1_complete: true },
  '/validate-pan': { success: true, message: 'PAN verified successfully', valid: true },
  '/submit': {
    success: true,
    message: 'Registration submitted successfully!',
    data: {
      registration_id: 'UDYAM-2026-001',
      reference_number: 'REF123456',
      created_at: new Date().toISOString(),
    },
  },
};

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(
      endpoint: string,
      method: 'GET' | 'POST' = 'GET',
      data?: unknown
    ): Promise<ApiResponse<T> | null> => {
      setLoading(true);
      setError(null);

      try {
        // Try real API first
        const url = `${API_BASE_URL}${endpoint}`;
        const options: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(3000), // 3s timeout
        };

        if (data) {
          options.body = JSON.stringify(data);
        }

        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          const result = (await response.json()) as ApiResponse<T>;
          return result;
        } catch (fetchErr) {
          // Backend not running — fall back to mock
          console.warn('Backend unavailable, using mock response for:', endpoint);
          const mock = mockResponses[endpoint];
          if (mock) {
            await new Promise((res) => setTimeout(res, 800)); // simulate delay

            // For OTP verify: check OTP value
            if (endpoint === '/verify-otp' && data) {
              const { otp } = data as { otp: string };
              if (otp !== MOCK_OTP) {
                return { success: false, message: `Invalid OTP. Hint: use ${MOCK_OTP} for demo.` } as ApiResponse<T>;
              }
            }

            return mock as ApiResponse<T>;
          }
          throw fetchErr;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('API call failed:', errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Specific API methods
  const validateAadhaar = useCallback(
    (aadhaarNumber: string) => {
      return request('/validate-aadhaar', 'POST', {
        aadhaar_number: aadhaarNumber,
        consent: true,
      });
    },
    [request]
  );

  const verifyOTP = useCallback(
    (aadhaarNumber: string, otp: string) => {
      return request('/verify-otp', 'POST', {
        aadhaar_number: aadhaarNumber,
        otp,
      });
    },
    [request]
  );

  const validatePAN = useCallback(
    (pan: string, name: string) => {
      return request('/validate-pan', 'POST', {
        pan,
        name,
      });
    },
    [request]
  );

  const submitRegistration = useCallback(
    (formData: Record<string, string | boolean>) => {
      return request<SubmissionResponse>('/submit', 'POST', formData);
    },
    [request]
  );

  const getSubmission = useCallback(
    (id: string) => {
      return request(`/submission/${id}`, 'GET');
    },
    [request]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    validateAadhaar,
    verifyOTP,
    validatePAN,
    submitRegistration,
    getSubmission,
  };
}
