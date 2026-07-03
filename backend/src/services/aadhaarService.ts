import { PrismaClient } from '@prisma/client';
import { validateAadhaar, maskAadhaar } from '@/validators/validators';
import { hashValue } from '@/utils/crypto';
import { logger } from '@/utils/logger';
import { ApiError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

export class AadhaarService {
  /**
   * Validate Aadhaar and check for duplicates
   */
  static async validate(aadhaar: string): Promise<{
    isValid: boolean;
    masked: string;
    hash: string;
  }> {
    // Format check
    if (!validateAadhaar(aadhaar)) {
      throw new ApiError(400, 'Invalid Aadhaar format. Must be 12 digits.');
    }

    const hash = hashValue(aadhaar);

    // Check for duplicates
    const existing = await prisma.registration.findUnique({
      where: { aadhaarHash: hash },
    });

    if (existing) {
      logger.warn('Aadhaar already registered', { hash: hash.slice(0, 8) });
      throw new ApiError(400, 'This Aadhaar is already registered.');
    }

    logger.info('Aadhaar validation successful', { hash: hash.slice(0, 8) });

    return {
      isValid: true,
      masked: maskAadhaar(aadhaar),
      hash,
    };
  }

  /**
   * Get masked Aadhaar for display
   */
  static getMaskedAadhaar(aadhaar: string): string {
    return maskAadhaar(aadhaar);
  }
}
