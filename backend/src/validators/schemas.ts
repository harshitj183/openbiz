import joi from 'joi';

// Validation Schemas using Joi
export const aadhaarValidationSchema = joi.object({
  aadhaar: joi
    .string()
    .required()
    .pattern(/^\d{12}$/)
    .messages({
      'string.pattern.base': 'Aadhaar must be exactly 12 digits',
      'any.required': 'Aadhaar is required',
    }),
});

export const otpVerificationSchema = joi.object({
  aadhaar: joi
    .string()
    .required()
    .pattern(/^\d{12}$/)
    .messages({
      'string.pattern.base': 'Aadhaar must be exactly 12 digits',
    }),
  otp: joi
    .string()
    .required()
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'OTP must be exactly 6 digits',
      'any.required': 'OTP is required',
    }),
});

export const panValidationSchema = joi.object({
  pan: joi
    .string()
    .required()
    .uppercase()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .messages({
      'string.pattern.base': 'Invalid PAN format. Expected: ABCDE1234F',
      'any.required': 'PAN is required',
    }),
  businessName: joi
    .string()
    .required()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Business name must be at least 3 characters',
      'string.max': 'Business name must not exceed 200 characters',
    }),
});

export const registrationSubmissionSchema = joi.object({
  aadhaar: joi
    .string()
    .required()
    .pattern(/^\d{12}$/),
  pan: joi
    .string()
    .required()
    .uppercase()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  businessName: joi
    .string()
    .required()
    .min(3)
    .max(200),
  businessType: joi
    .string()
    .required()
    .min(2)
    .max(50),
  businessSector: joi
    .string()
    .required()
    .min(2),
  mobile: joi
    .string()
    .required()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      'string.pattern.base': 'Mobile must be 10 digits starting with 6-9',
    }),
  email: joi
    .string()
    .required()
    .email()
    .messages({
      'string.email': 'Invalid email format',
    }),
  state: joi
    .string()
    .required()
    .min(2),
  pincode: joi
    .string()
    .required()
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'PIN code must be exactly 6 digits',
    }),
  city: joi
    .string()
    .required()
    .min(2)
    .max(100),
  address: joi
    .string()
    .required()
    .min(10)
    .max(250)
    .messages({
      'string.min': 'Address must be at least 10 characters',
      'string.max': 'Address must not exceed 250 characters',
    }),
});
