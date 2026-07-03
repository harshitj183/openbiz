// Input field component with validation

'use client';

import React, { useState } from 'react';
import { FormField } from '@/types';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  field: any;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export function InputField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let newValue = e.target.value;

    // Auto-uppercase for PAN
    if (field.auto_uppercase) {
      newValue = newValue.toUpperCase();
    }

    // For Aadhaar, only allow digits (formatting happens in parent)
    if (field.name === 'AadhaarNo') {
      newValue = newValue.replace(/\D/g, '');
      // Limit to 12 digits only
      if (newValue.length > 12) {
        newValue = newValue.slice(0, 12);
      }
    }

    // For OTP, only allow digits, max 6
    if (field.name === 'OTP') {
      newValue = newValue.replace(/\D/g, '');
      if (newValue.length > 6) {
        newValue = newValue.slice(0, 6);
      }
    }

    // For Mobile, strip +91 prefix and non-digits, max 10 digits
    if (field.name === 'Mobile') {
      newValue = newValue.replace(/^\+91\s?/, '').replace(/\D/g, '');
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
      }
    }

    // For Pincode, only digits, max 6
    if (field.name === 'Pincode') {
      newValue = newValue.replace(/\D/g, '');
      if (newValue.length > 6) {
        newValue = newValue.slice(0, 6);
      }
    }

    onChange(newValue);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  // Get maxLength dynamically
  const getMaxLength = () => {
    // These fields handle their own max via onChange
    if (['AadhaarNo', 'OTP', 'Mobile', 'Pincode'].includes(field.name)) return undefined;
    return field.validation?.max_length;
  };

  // Get display value (formatted for Aadhaar and Mobile)
  const getDisplayValue = () => {
    if (field.name === 'AadhaarNo' && typeof value === 'string') {
      const digits = value.replace(/\D/g, '');
      if (digits.length === 0) return '';
      if (digits.length <= 4) return digits;
      if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
    }
    if (field.name === 'Mobile' && typeof value === 'string') {
      const digits = value.replace(/\D/g, '');
      if (digits.length === 0) return '';
      return `+91 ${digits}`;
    }
    return String(value || '');
  };

  // Text/number input
  if (field.type === 'input' && field.input_type !== 'checkbox') {
    return (
      <div className="form-group">
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
        <input
          id={field.id}
          name={field.name}
          type={field.input_type || 'text'}
          value={getDisplayValue()}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={() => setIsFocused(true)}
          onBlurCapture={() => setIsFocused(false)}
          placeholder={field.placeholder}
          disabled={disabled}
          maxLength={getMaxLength()}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'placeholder:text-gray-400 text-gray-900',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 hover:border-gray-400',
            isFocused && !error && 'border-primary-300 shadow-md'
          )}
        />
        {field.hint && !error && (
          <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-error-600 font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Textarea
  if (field.type === 'textarea') {
    return (
      <div className="form-group">
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
        <textarea
          id={field.id}
          name={field.name}
          value={String(value || '')}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={disabled}
          rows={4}
          maxLength={field.validation?.max_length}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'placeholder:text-gray-400 text-gray-900 resize-none',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 hover:border-gray-400'
          )}
        />
        {field.hint && !error && (
          <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-error-600 font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Select
  if (field.type === 'select') {
    return (
      <div className="form-group">
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
        <select
          id={field.id}
          name={field.name}
          value={String(value || '')}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'text-gray-900 bg-white cursor-pointer',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          {field.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {field.hint && !error && (
          <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-error-600 font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Checkbox
  if (field.type === 'checkbox') {
    return (
      <div className="form-group">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            id={field.id}
            name={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleCheckboxChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              'w-5 h-5 border rounded transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              Boolean(value) ? 'bg-primary-500 border-primary-500' : 'border-gray-300',
              error ? 'border-error-500' : ''
            )}
          />
          <span className="text-sm text-gray-700 leading-relaxed flex-1">
            {field.label}
            {field.required && <span className="text-error-500 ml-1">*</span>}
          </span>
        </label>
        {error && (
          <p className="mt-1 text-sm text-error-600 font-medium animate-fade-in ml-8">
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
}
