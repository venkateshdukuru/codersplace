// src/middleware/errorMiddleware.ts
import { Response, NextFunction, ErrorRequestHandler, Request } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  status?: number;
}

export const createError = (status: number, message: string): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  return error;
};

// Properly typed error handler for Express
export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(
    `Error: ${err.message}, Status: ${err.status || 500}, IP: ${(req as any).ip || 'unknown'}`
  );

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};