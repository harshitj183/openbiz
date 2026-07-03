import { Request, Response } from 'express';
import { asyncHandler, ApiError } from '@/middleware/errorHandler';
import { sendSuccess } from '@/utils/responses';
import { RegistrationService } from '@/services/registrationService';
import { hashValue } from '@/utils/crypto';
import { logger } from '@/utils/logger';

/**
 * POST /api/submit
 * Submits the complete registration form
 */
export const submitRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const { aadhaar, ...data } = req.body;

    try {
      const aadhaarHash = hashValue(aadhaar);

      // Create registration
      const registration = await RegistrationService.create(
        { aadhaar, ...data },
        aadhaarHash
      );

      sendSuccess(res, 201, 'Registration submitted successfully', registration);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      logger.error('Error in submitRegistration', err);
      throw new ApiError(500, 'Failed to submit registration');
    }
  }
);

/**
 * GET /api/submission/:id
 * Retrieves a registration by ID
 */
export const getSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const submission = await RegistrationService.getById(id);
    sendSuccess(res, 200, 'Submission retrieved successfully', submission);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error('Error in getSubmission', err);
    throw new ApiError(500, 'Failed to retrieve submission');
  }
});
