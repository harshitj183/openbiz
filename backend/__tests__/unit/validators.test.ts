import {
  validateAadhaar,
  validateOTP,
  validatePAN,
  validateMobile,
  validateEmail,
  validatePincode,
  validateBusinessName,
  validateAddress,
  maskAadhaar,
  maskPAN,
} from '@/validators/validators';

describe('Backend validators', () => {
  it('should validate Aadhaar numbers', () => {
    expect(validateAadhaar('123456789012')).toBe(true);
    expect(validateAadhaar('123456')).toBe(false);
  });

  it('should validate OTP codes', () => {
    expect(validateOTP('123456')).toBe(true);
    expect(validateOTP('abcdef')).toBe(false);
  });

  it('should validate PAN values', () => {
    expect(validatePAN('AAAPA1234F')).toBe(true);
    expect(validatePAN('aaa1234ff')).toBe(false);
  });

  it('should validate mobile numbers', () => {
    expect(validateMobile('9876543210')).toBe(true);
    expect(validateMobile('12345')).toBe(false);
  });

  it('should validate emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user@invalid')).toBe(false);
  });

  it('should validate pincodes', () => {
    expect(validatePincode('110001')).toBe(true);
    expect(validatePincode('123')).toBe(false);
  });

  it('should validate business name and address lengths', () => {
    expect(validateBusinessName('My Business')).toBe(true);
    expect(validateBusinessName('A')).toBe(false);
    expect(validateAddress('123 Main Street, City')).toBe(true);
    expect(validateAddress('Short')).toBe(false);
  });

  it('should mask sensitive values', () => {
    expect(maskAadhaar('123456789012')).toBe('****-****-9012');
    expect(maskPAN('AAAPA1234F')).toBe('AAAPA****F');
  });
});
