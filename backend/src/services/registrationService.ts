import { PrismaClient } from '@prisma/client';
import { RegistrationData, RegistrationResponse } from '@/types';
import { logger } from '@/utils/logger';
import { ApiError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

export class RegistrationService {
  /**
   * Create a new registration
   */
  static async create(
    data: RegistrationData,
    aadhaarHash: string
  ): Promise<RegistrationResponse> {
    try {
      const registration = await prisma.registration.create({
        data: {
          aadhaarHash,
          aadhaarMasked: `****-****-${data.aadhaar.slice(-4)}`,
          pan: data.pan.toUpperCase(),
          businessName: data.businessName,
          businessType: data.businessType,
          businessSector: data.businessSector,
          mobile: data.mobile,
          email: data.email,
          state: data.state,
          pincode: data.pincode,
          city: data.city,
          address: data.address,
        },
      });

      logger.info('Registration created successfully', {
        id: registration.id,
        email: data.email,
      });

      return {
        registration_id: registration.id,
        reference_number: registration.referenceNumber,
        created_at: registration.createdAt.toISOString(),
      };
    } catch (err) {
      logger.error('Failed to create registration', err);
      throw new ApiError(500, 'Failed to create registration');
    }
  }

  /**
   * Get registration by ID
   */
  static async getById(id: string): Promise<any> {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        id: true,
        referenceNumber: true,
        aadhaarMasked: true,
        businessName: true,
        email: true,
        mobile: true,
        pan: true,
        state: true,
        pincode: true,
        city: true,
        createdAt: true,
      },
    });

    if (!registration) {
      throw new ApiError(404, 'Registration not found');
    }

    return registration;
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const registration = await prisma.registration.findUnique({
      where: { email },
    });
    return !!registration;
  }

  /**
   * Check if mobile exists
   */
  static async mobileExists(mobile: string): Promise<boolean> {
    const registration = await prisma.registration.findFirst({
      where: { mobile },
    });
    return !!registration;
  }
}
