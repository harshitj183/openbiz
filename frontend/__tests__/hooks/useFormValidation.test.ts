import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { FormField } from '@/types';

describe('useFormValidation', () => {
  const fields: FormField[] = [
    {
      id: 'aadhaar',
      name: 'aadhaar',
      label: 'Aadhaar',
      type: 'input',
      required: true,
      validation: {
        pattern: '^\\d{12}$',
        length: 12,
        error_message: 'Aadhaar must be 12 digits',
      },
    },
    {
      id: 'pan',
      name: 'pan',
      label: 'PAN',
      type: 'input',
      required: true,
      validation: {
        pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
        length: 10,
        error_message: 'PAN format is invalid',
      },
    },
  ];

  it('should initialize with no errors', () => {
    const { result } = renderHook(() => useFormValidation(fields));
    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  it('should validate a single field', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.validateField('aadhaar', '');
    });

    expect(result.current.errors.aadhaar).toBeDefined();
    expect(result.current.hasErrors).toBe(true);
  });

  it('should validate all fields', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    let isValid: boolean | undefined;
    act(() => {
      // validateAll returns a boolean synchronously; capture it inside act
      isValid = result.current.validateAll({
        aadhaar: '123456789012',
        pan: 'AAAPA1234F',
      });
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.validateField('aadhaar', '');
    });
    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  it('should clear specific field error', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.validateField('aadhaar', '');
      result.current.validateField('pan', '');
    });
    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.clearFieldError('aadhaar');
    });

    expect(result.current.errors.aadhaar).toBeUndefined();
    expect(result.current.errors.pan).toBeDefined();
  });
});
