// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}

// Registration data models
export interface RegistrationData {
  // Step 1
  aadhaar: string;
  
  // Step 2
  pan: string;
  businessName: string;
  businessType: string;
  businessSector: string;
  mobile: string;
  email: string;
  state: string;
  pincode: string;
  city: string;
  address: string;
}

export interface OtpRequest {
  aadhaar: string;
}

export interface OtpVerification {
  aadhaar: string;
  otp: string;
}

export interface AadhaarValidation {
  aadhaar: string;
}

export interface PanValidation {
  pan: string;
  businessName: string;
}

export interface RegistrationSubmission extends RegistrationData {}

// Response data models
export interface RegistrationResponse {
  registration_id: string;
  reference_number: string;
  created_at: string;
}

export interface AadhaarValidationResponse {
  masked: string;
  otp?: string; // Development only
}

export interface SubmissionResponse {
  id: string;
  referenceNumber: string;
  aadhaarMasked: string;
  businessName: string;
  email: string;
  createdAt: string;
}

// Request context
export interface RequestContext {
  userId?: string;
  timestamp: string;
  ipAddress?: string;
}
