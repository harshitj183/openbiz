import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { config } from '@/config';
import { hashOTP, maskAadhaar } from '@/utils/crypto';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

export class OtpService {
  /**
   * Generate a random 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request OTP for Aadhaar
   * Stores hashed OTP in database
   */
  static async requestOTP(aadhaarHash: string): Promise<string> {
    const otp = this.generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + config.otp.expirySeconds * 1000);

    // Delete expired OTPs for this Aadhaar
    await prisma.otpLog.deleteMany({
      where: {
        aadhaarHash,
        expiresAt: { lt: new Date() },
      },
    });

    // Create new OTP record
    await prisma.otpLog.create({
      data: {
        aadhaarHash,
        otpHash,
        expiresAt,
      },
    });

    logger.info(`OTP requested for Aadhaar hash`, { aadhaarHash: aadhaarHash.slice(0, 8) });

    // In production, send via SMS API
    // For development, return OTP for testing
    if (config.isDev) {
      logger.debug(`📱 Development OTP: ${otp} (expires in ${config.otp.expirySeconds}s)`);
      return otp;
    }

    return ''; // Production: don't return OTP
  }

  /**
   * Verify OTP for Aadhaar
   * Checks expiry, attempts, and hash match
   */
  static async verifyOTP(aadhaarHash: string, otp: string): Promise<boolean> {
    const otpHash = hashOTP(otp);

    // Find valid OTP record
    const otpRecord = await prisma.otpLog.findFirst({
      where: {
        aadhaarHash,
        expiresAt: { gt: new Date() }, // Not expired
        isVerified: false,
      },
    });

    if (!otpRecord) {
      logger.warn('OTP verification failed - no valid OTP found', { aadhaarHash: aadhaarHash.slice(0, 8) });
      return false;
    }

    // Check max attempts
    if (otpRecord.attempts >= config.otp.maxAttempts) {
      logger.warn('OTP verification failed - max attempts exceeded', { aadhaarHash: aadhaarHash.slice(0, 8) });
      return false;
    }

    // Increment attempts
    await prisma.otpLog.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 },
    });

    // Check OTP match
    if (otpRecord.otpHash !== otpHash) {
      logger.warn('OTP verification failed - hash mismatch', { aadhaarHash: aadhaarHash.slice(0, 8) });
      return false;
    }

    // Mark as verified
    await prisma.otpLog.update({
      where: { id: otpRecord.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    logger.info('OTP verified successfully', { aadhaarHash: aadhaarHash.slice(0, 8) });
    return true;
  }
}
