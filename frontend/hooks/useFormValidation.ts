// Hook for form-level validation

'use client';

import { useState, useCallback } from 'react';
import { FormField, ValidationError } from '@/types';
import { ValidationEngine } from '@/lib/validation';

export function useFormValidation(fields: any[]) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (fieldName: string, value: string | boolean) => {
      const field = fields.find((f) => f.name === fieldName);
      if (!field) return null;

      const error = ValidationEngine.validateField(field, value);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [fieldName]: error.message };
        } else {
          const { [fieldName]: _, ...rest } = prev;
          return rest;
        }
      });

      return error;
    },
    [fields]
  );

  const validateAll = useCallback(
    (data: Record<string, string | boolean>) => {
      const validationErrors = ValidationEngine.validateFields(fields, data);
      const errorMap = validationErrors.reduce(
        (acc, err) => ({
          ...acc,
          [err.field]: err.message,
        }),
        {}
      );
      setErrors(errorMap);
      return validationErrors.length === 0;
    },
    [fields]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}
