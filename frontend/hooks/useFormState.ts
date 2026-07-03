// Hook for managing form state across steps

'use client';

import { useState, useCallback } from 'react';
import { FormState } from '@/types';

const initialState: FormState = {
  currentStep: 1,
  step1Data: {},
  step2Data: {},
  errors: {},
  isLoading: false,
  isSubmitting: false,
};

export function useFormState() {
  const [state, setState] = useState<FormState>(initialState);

  const updateStep1Data = useCallback((data: Record<string, string | boolean>) => {
    setState((prev) => ({
      ...prev,
      step1Data: { ...prev.step1Data, ...data },
    }));
  }, []);

  const updateStep2Data = useCallback((data: Record<string, string | boolean>) => {
    setState((prev) => ({
      ...prev,
      step2Data: { ...prev.step2Data, ...data },
    }));
  }, []);

  const setCurrentStep = useCallback((step: 1 | 2) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setState((prev) => ({
      ...prev,
      errors,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    updateStep1Data,
    updateStep2Data,
    setCurrentStep,
    setErrors,
    setLoading,
    setSubmitting,
    reset,
  };
}

// Helper hook to access form data
export function useFormData(state: FormState) {
  return {
    step1: state.step1Data,
    step2: state.step2Data,
    combined: {
      ...state.step1Data,
      ...state.step2Data,
    },
  };
}
