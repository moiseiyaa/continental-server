import { Response } from 'express';
import { JWT_COOKIE_EXPIRE, NODE_ENV } from '../config/env';

interface TokenResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
}

// Get token from model, create cookie and send response
export const sendTokenResponse = (user: any, statusCode: number, res: Response, includeRefreshToken: boolean = true) => {
  // Create access token
  const token = user.getSignedJwtToken();
  
  // Create refresh token
  const refreshToken = includeRefreshToken ? user.getRefreshToken() : null;

  const options = {
    expires: new Date(
      Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  // Set access token cookie (shorter expiry - 30 minutes)
  res.cookie('token', token, {
    ...options,
    expires: new Date(Date.now() + 30 * 60 * 1000),
  });

  // Set refresh token cookie (longer expiry - from JWT_COOKIE_EXPIRE)
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, options);
  }

  const response: TokenResponse = {
    success: true,
    token,
  };

  if (refreshToken) {
    response.refreshToken = refreshToken;
  }

  res.status(statusCode).json(response);
};

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || [];
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

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}
