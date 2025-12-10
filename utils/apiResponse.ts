import { Response } from 'express';
import { JWT_COOKIE_EXPIRE, NODE_ENV } from '../config/env';

// Get token from model, create cookie and send response
export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Not authorized') {
    super(message, 401);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', errors?: any[]) {
    super(message, 400, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}
