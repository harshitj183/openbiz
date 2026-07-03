import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { ApiResponse } from '@/types';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (err instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    };
    logger.warn(`API Error [${err.statusCode}]: ${err.message}`, err.errors);
    return res.status(err.statusCode).json(response);
  }
  
  // Unhandled errors
  logger.error('Unhandled error in request', err);
  
  const message = isDev 
    ? (err instanceof Error ? err.message : 'Unknown error')
    : 'Internal server error';
  
  const response: ApiResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  
  res.status(500).json(response);
}

// Async error wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
