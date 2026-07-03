import { Request, Response } from 'express';
import { asyncHandler, ApiError } from '@/middleware/errorHandler';
import { sendSuccess } from '@/utils/responses';
import { AadhaarService } from '@/services/aadhaarService';
import { OtpService } from '@/services/otpService';
import { logger } from '@/utils/logger';

/**
 * POST /api/validate-aadhaar
 * Validates Aadhaar and sends OTP
 */
export const validateAadhaar = asyncHandler(
  async (req: Request, res: Response) => {
    const { aadhaar } = req.body;

    try {
      // Validate Aadhaar
      const validation = await AadhaarService.validate(aadhaar);

      // Request OTP
      const otp = await OtpService.requestOTP(validation.hash);

      sendSuccess(res, 200, 'OTP sent successfully', {
        masked: validation.masked,
        // Only return OTP in development for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      logger.error('Error in validateAadhaar', err);
      throw new ApiError(500, 'Internal server error');
    }
  }
);
