import { PrismaClient } from '@prisma/client';
import { validatePAN, validateBusinessName } from '@/validators/validators';
import { logger } from '@/utils/logger';
import { ApiError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

export class PanService {
  /**
   * Validate PAN and check for duplicates
   */
  static async validate(pan: string, businessName: string): Promise<boolean> {
    // Format check
    if (!validatePAN(pan)) {
      throw new ApiError(400, 'Invalid PAN format. Expected: ABCDE1234F');
    }

    // Business name check
    if (!validateBusinessName(businessName)) {
      throw new ApiError(
        400,
        'Business name must be between 3 and 200 characters.'
      );
    }

    const normalizedPan = pan.toUpperCase();

    // Check for duplicates
    const existing = await prisma.registration.findUnique({
      where: { pan: normalizedPan },
    });

    if (existing) {
      logger.warn('PAN already registered', { pan: normalizedPan });
      throw new ApiError(400, 'This PAN is already registered.');
    }

    logger.info('PAN validation successful', { pan: normalizedPan });

    // In production: Call actual GST/PAN verification API
    // For now, we just validate format

    return true;
  }
}
