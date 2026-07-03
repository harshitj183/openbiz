import { ValidationEngine } from '@/lib/validation';
import { validateAadhaar, validatePAN, validateMobile, validateEmail, validatePincode, validateOTP } from '@/lib/validation';

describe('ValidationEngine - Aadhaar', () => {
  it('should validate correct Aadhaar', () => {
    expect(validateAadhaar('123456789012')).toBe(true);
  });

  it('should reject Aadhaar with letters', () => {
    expect(validateAadhaar('XXXX56789012')).toBe(false);
  });

  it('should reject Aadhaar with less than 12 digits', () => {
    expect(validateAadhaar('12345678901')).toBe(false);
  });

  it('should format Aadhaar correctly', () => {
    expect(ValidationEngine.formatAadhaar('123456789012')).toBe(
      '1234 5678 9012'
    );
  });

  it('should mask Aadhaar for display', () => {
    expect(ValidationEngine.maskAadhaar('123456789012')).toBe(
      '****-****-9012'
    );
  });
});

describe('ValidationEngine - PAN', () => {
  it('should validate correct PAN', () => {
    expect(validatePAN('AAAPA1234F')).toBe(true);
  });

  it('should validate PAN case-insensitively', () => {
    expect(validatePAN('aaapa1234f')).toBe(true);
  });

  it('should reject PAN with invalid format', () => {
    expect(validatePAN('AAAPA123F')).toBe(false); // Missing digit
    expect(validatePAN('AAAPA12345')).toBe(false); // Wrong format
  });

  it('should mask PAN for display', () => {
    expect(ValidationEngine.maskPAN('AAAPA1234F')).toBe('AAAPA****F');
  });
});

describe('ValidationEngine - Mobile', () => {
  it('should validate correct mobile', () => {
    expect(validateMobile('9876543210')).toBe(true);
    expect(validateMobile('8765432109')).toBe(true);
    expect(validateMobile('7654321098')).toBe(true);
    expect(validateMobile('6543210987')).toBe(true);
  });

  it('should reject mobile starting with invalid digit', () => {
    expect(validateMobile('5876543210')).toBe(false);
    expect(validateMobile('0876543210')).toBe(false);
  });

  it('should reject mobile with less than 10 digits', () => {
    expect(validateMobile('987654321')).toBe(false);
  });
});

describe('ValidationEngine - Email', () => {
  it('should validate correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('name.surname@domain.co.uk')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid.email')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('ValidationEngine - Pincode', () => {
  it('should validate correct pincode', () => {
    expect(validatePincode('110001')).toBe(true);
    expect(validatePincode('560001')).toBe(true);
  });

  it('should reject pincode with wrong length', () => {
    expect(validatePincode('11000')).toBe(false);
    expect(validatePincode('1100001')).toBe(false);
  });

  it('should reject pincode with letters', () => {
    expect(validatePincode('11000A')).toBe(false);
  });
});

describe('ValidationEngine - OTP', () => {
  it('should validate correct OTP', () => {
    expect(validateOTP('123456')).toBe(true);
  });

  it('should reject OTP with wrong length', () => {
    expect(validateOTP('12345')).toBe(false);
    expect(validateOTP('1234567')).toBe(false);
  });

  it('should reject OTP with letters', () => {
    expect(validateOTP('12345A')).toBe(false);
  });
});
