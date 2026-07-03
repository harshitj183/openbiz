import { renderHook, act } from '@testing-library/react';
import { useFormState } from '@/hooks/useFormState';

describe('useFormState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFormState());

    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.step1Data).toEqual({});
    expect(result.current.state.step2Data).toEqual({});
    expect(result.current.state.errors).toEqual({});
    expect(result.current.state.isLoading).toBe(false);
  });

  it('should update step1 data', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateStep1Data({ aadhaar: '123456789012' });
    });

    expect(result.current.state.step1Data).toEqual({ aadhaar: '123456789012' });
  });

  it('should update step2 data', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateStep2Data({ pan: 'AAAPA1234F' });
    });

    expect(result.current.state.step2Data).toEqual({ pan: 'AAAPA1234F' });
  });

  it('should set current step', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.state.currentStep).toBe(2);
  });

  it('should set errors', () => {
    const { result } = renderHook(() => useFormState());

    const errors = { aadhaar: 'Invalid Aadhaar' };
    act(() => {
      result.current.setErrors(errors);
    });

    expect(result.current.state.errors).toEqual(errors);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.state.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.state.isLoading).toBe(false);
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateStep1Data({ aadhaar: '123456789012' });
      result.current.updateStep2Data({ pan: 'AAAPA1234F' });
      result.current.setCurrentStep(2);
    });

    expect(result.current.state.step1Data).not.toEqual({});

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toEqual({
      currentStep: 1,
      step1Data: {},
      step2Data: {},
      errors: {},
      isLoading: false,
      isSubmitting: false,
    });
  });
});
