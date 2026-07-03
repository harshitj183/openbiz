import { Request, Response } from 'express';
import { asyncHandler, ApiError } from '@/middleware/errorHandler';
import { sendSuccess } from '@/utils/responses';
import { PanService } from '@/services/panService';
import { logger } from '@/utils/logger';

/**
 * POST /api/validate-pan
 * Validates PAN format and checks for duplicates
 */
export const validatePAN = asyncHandler(async (req: Request, res: Response) => {
  const { pan, businessName } = req.body;

  try {
    await PanService.validate(pan, businessName);

    sendSuccess(res, 200, 'PAN validated successfully', {
      pan: pan.toUpperCase(),
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error('Error in validatePAN', err);
    throw new ApiError(500, 'Internal server error');
  }
});
