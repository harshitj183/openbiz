import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import {
  aadhaarValidationSchema,
  otpVerificationSchema,
  panValidationSchema,
  registrationSubmissionSchema,
} from '@/validators/schemas';
import { validateAadhaar } from '@/controllers/aadhaarController';
import { verifyOTP } from '@/controllers/otpController';
import { validatePAN } from '@/controllers/panController';
import { submitRegistration, getSubmission } from '@/controllers/submitController';

const router = Router();

/**
 * POST /api/validate-aadhaar
 * Validates Aadhaar number and sends OTP
 */
router.post(
  '/validate-aadhaar',
  validateRequest(aadhaarValidationSchema),
  validateAadhaar
);

/**
 * POST /api/verify-otp
 * Verifies OTP for the given Aadhaar
 */
router.post('/verify-otp', validateRequest(otpVerificationSchema), verifyOTP);

/**
 * POST /api/validate-pan
 * Validates PAN format and business name
 */
router.post('/validate-pan', validateRequest(panValidationSchema), validatePAN);

/**
 * POST /api/submit
 * Submits the complete registration
 */
router.post(
  '/submit',
  validateRequest(registrationSubmissionSchema),
  submitRegistration
);

/**
 * GET /api/submission/:id
 * Retrieves a submitted registration by ID
 */
router.get('/submission/:id', getSubmission);

export default router;
