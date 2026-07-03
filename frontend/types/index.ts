// Type definitions for Udyam Registration Portal

export interface ValidationRule {
  pattern?: string;
  min_length?: number;
  max_length?: number;
  length?: number;
  error_message?: string;
  error_messages?: Record<string, string>;
  required?: boolean;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'button' | 'radio';
  input_type?: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  options?: Array<{ value: string; text: string }>;
  disabled?: boolean;
  read_only?: boolean;
  conditional?: string;
  hint?: string;
  auto_uppercase?: boolean;
}

export interface FormStep {
  title: string;
  description: string;
  fields: FormField[];
}

export interface UdyamSchema {
  metadata: {
    source: string;
    version: string;
    description: string;
  };
  step1: FormStep;
  step2: FormStep;
  validation_rules: Record<string, ValidationRule>;
  ui_components: Record<string, unknown>;
  api_endpoints: Record<string, unknown>;
  error_handling: Record<string, unknown>;
}

export interface FormData {
  step1: Record<string, string | boolean>;
  step2: Record<string, string | boolean>;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface SubmissionResponse {
  registration_id: string;
  reference_number: string;
  created_at: string;
}

export interface FormState {
  currentStep: 1 | 2;
  step1Data: Record<string, string | boolean>;
  step2Data: Record<string, string | boolean>;
  errors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
}
