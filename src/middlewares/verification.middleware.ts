import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/apiError';

/**
 * Middleware to enforce email verification
 * Prevents users from accessing protected resources until email is verified
 */
export const requireEmailVerification = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  if (!req.user.emailVerified) {
    return next(
      new UnauthorizedError(
        'Please verify your email address before accessing this resource. Check your email for the verification link.'
      )
    );
  }

  next();
};

/**
 * Middleware to check if user account is active
 */
export const requireActiveAccount = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  if (!req.user.isActive) {
    return next(
      new UnauthorizedError('Your account has been deactivated. Please contact support.')
    );
  }

  next();
};

/**
 * Combined middleware for full account verification
 */
export const requireFullVerification = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  if (!req.user.emailVerified) {
    return next(
      new UnauthorizedError(
        'Please verify your email address. Check your email for the verification link.'
      )
    );
  }

  if (!req.user.isActive) {
    return next(
      new UnauthorizedError('Your account has been deactivated. Please contact support.')
    );
  }

  next();
};
