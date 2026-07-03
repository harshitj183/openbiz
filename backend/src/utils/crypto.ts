import crypto from 'crypto';

/**
 * Create SHA256 hash of a value
 * Used for Aadhaar and OTP hashing (never store plaintext)
 */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Hash OTP (same algorithm for consistency)
 */
export function hashOTP(otp: string): string {
  return hashValue(otp);
}

/**
 * Create random OTP (6 digits)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Mask Aadhaar for display (e.g., ****-****-9012)
 */
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) return '*'.repeat(12);
  return `****-****-${aadhaar.slice(-4)}`;
}

/**
 * Mask PAN for display (e.g., AAAPA****F)
 */
export function maskPAN(pan: string): string {
  if (!pan || pan.length < 8) return '*'.repeat(pan.length);
  return pan.slice(0, 5) + '****' + pan.slice(-1);
}
