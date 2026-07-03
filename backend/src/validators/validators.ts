/**
 * Individual validator functions (same as frontend)
 */

export function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function validatePAN(pan: string): boolean {
  const normalized = pan.toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalized);
}

export function validateMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function validateBusinessName(name: string): boolean {
  return name.length >= 3 && name.length <= 200;
}

export function validateAddress(address: string): boolean {
  return address.length >= 10 && address.length <= 250;
}

/**
 * Format/mask functions for display
 */

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) return '*'.repeat(12);
  return `****-****-${aadhaar.slice(-4)}`;
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length < 8) return '*'.repeat(pan.length);
  return pan.slice(0, 5) + '****' + pan.slice(-1);
}
