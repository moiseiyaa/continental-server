import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiResponse';
import logger, { logError, logSecurityEvent } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error using Winston
  logError(`${req.method} ${req.path}`, err);

  // Security event logging for 401/403 errors
  if (err.statusCode === 401 || err.statusCode === 403) {
    const userId = (req as any).user?.id || 'anonymous';
    logSecurityEvent(
      err.statusCode === 401 ? 'Unauthorized Access Attempt' : 'Forbidden Access Attempt',
      userId,
      { path: req.path, method: req.method }
    );
  }

  // PostgreSQL invalid input syntax (equivalent to Mongoose CastError)
  if (err.name === 'CastError' || err.code === '22P02') {
    const message = `Resource not found with invalid id`;
    error = new ApiError(message, 404);
  }

  // PostgreSQL unique violation (equivalent to Mongoose duplicate key)
  if (err.code === '23505' || err.code === 11000) {
    const message = err.detail || 'Duplicate field value entered';
    error = new ApiError(message, 400);
    logSecurityEvent('Duplicate Entry Attempt', (req as any).user?.id, { 
      detail: err.detail || 'unknown field' 
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    const message = 'Referenced record does not exist';
    error = new ApiError(message, 400);
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    const message = `Required field missing: ${err.column || 'unknown'}`;
    error = new ApiError(message, 400);
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    const message = 'Data validation failed';
    error = new ApiError(message, 400);
  }

  // Legacy Mongoose validation error (for backward compatibility)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {}).map((val: any) => val.message).join(', ') || err.message;
    error = new ApiError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
