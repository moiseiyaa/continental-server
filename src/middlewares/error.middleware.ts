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

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(message, 400);
    logSecurityEvent('Duplicate Entry Attempt', (req as any).user?.id, { field: Object.keys(err.keyValue)[0] });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ApiError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
