import { Response } from 'express';
import { ApiResponse } from '@/types';

export function sendSuccess<T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string>
) {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}
