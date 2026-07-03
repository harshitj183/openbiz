import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { ApiError } from './errorHandler';

export function validateRequest(schema: joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    
    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        const key = detail.path[0] as string;
        errors[key] = detail.message;
      });
      throw new ApiError(400, 'Validation failed', errors);
    }
    
    req.body = value;
    next();
  };
}
