import { Request, Response } from 'express';
import { asyncHandler, ApiError } from '@/middleware/errorHandler';
import { sendSuccess } from '@/utils/responses';
import { OtpService } from '@/services/otpService';
import { hashValue } from '@/utils/crypto';
import { logger } from '@/utils/logger';

/**
 * POST /api/verify-otp
 * Verifies OTP for Aadhaar
 */
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { aadhaar, otp } = req.body;

  try {
    const aadhaarHash = hashValue(aadhaar);
    const isValid = await OtpService.verifyOTP(aadhaarHash, otp);

    if (!isValid) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    sendSuccess(res, 200, 'OTP verified successfully', {
      aadhaarHash,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error('Error in verifyOTP', err);
    throw new ApiError(500, 'Internal server error');
  }
});
