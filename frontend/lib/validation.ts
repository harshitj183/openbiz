// Validation logic based on extracted schema

import { ValidationError, FormField } from '@/types';

export class ValidationEngine {
  /**
   * Validate a single field against its rules
   */
  static validateField(
    field: FormField,
    value: string | boolean
  ): ValidationError | null {
    const validation = field.validation;

    if (!validation) return null;

    // Check if field is required
    if (field.required && !value) {
      return {
        field: field.name,
        message: validation.error_messages?.['required'] || `${field.label} is required`,
        type: 'error',
      };
    }

    // Skip further validation if not required and empty
    if (!field.required && !value) return null;

    // Type-specific validation
    if (typeof value === 'boolean') {
      if (field.type === 'checkbox' && field.required && !value) {
        return {
          field: field.name,
          message: validation.error_messages?.['required'] || `${field.label} must be checked`,
          type: 'error',
        };
      }
      return null;
    }

    // String validations
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(String(value))) {
        return {
          field: field.name,
          message: validation.error_message || validation.error_messages?.['invalid_format'] || 
                   `${field.label} format is invalid`,
          type: 'error',
        };
      }
    }

    if (validation.length && String(value).length !== validation.length) {
      return {
        field: field.name,
        message: validation.error_messages?.['invalid_length'] || 
                 `${field.label} must be exactly ${validation.length} characters`,
        type: 'error',
      };
    }

    if (validation.min_length && String(value).length < validation.min_length) {
      return {
        field: field.name,
        message: validation.error_messages?.['too_short'] ||
                 `${field.label} must be at least ${validation.min_length} characters`,
        type: 'error',
      };
    }

    if (validation.max_length && String(value).length > validation.max_length) {
      return {
        field: field.name,
        message: validation.error_messages?.['too_long'] ||
                 `${field.label} must not exceed ${validation.max_length} characters`,
        type: 'error',
      };
    }

    return null;
  }

  /**
   * Validate multiple fields
   */
  static validateFields(
    fields: FormField[],
    data: Record<string, string | boolean>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field of fields) {
      const error = this.validateField(field, data[field.name] ?? '');
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Format Aadhaar with spaces (XXXX XXXX XXXX)
   */
  static formatAadhaar(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
  }

  /**
   * Format mobile number with country code
   */
  static formatMobile(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '+91 ';
    if (digits.length === 10) return `+91 ${digits}`;
    return digits;
  }

  /**
   * Format PAN to uppercase
   */
  static formatPAN(value: string): string {
    return value.toUpperCase();
  }

  /**
   * Mask sensitive data (for display)
   */
  static maskAadhaar(aadhaar: string): string {
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length !== 12) return aadhaar;
    return `****-****-${cleaned.slice(-4)}`;
  }

  /**
   * Mask PAN (for display)
   */
  static maskPAN(pan: string): string {
    if (pan.length !== 10) return pan;
    return `${pan.slice(0, 5)}****${pan.slice(-1)}`;
  }
}

// Export utility functions
export const validateAadhaar = (value: string): boolean => {
  return /^\d{12}$/.test(value.replace(/\D/g, ''));
};

export const validateOTP = (value: string): boolean => {
  return /^\d{6}$/.test(value);
};

export const validatePAN = (value: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase());
};

export const validateMobile = (value: string): boolean => {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''));
};

export const validateEmail = (value: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

export const validatePincode = (value: string): boolean => {
  return /^\d{6}$/.test(value);
};
