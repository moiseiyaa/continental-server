import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/apiError';

/**
 * Verify that the requesting user owns the resource
 * Compares req.user.id with the resource owner ID from params or body
 */
export const verifyOwnership = (paramName: string = 'id', allowAdmin: boolean = true) => {
  return (req: any, res: Response, next: NextFunction) => {
    const resourceOwnerId = req.params[paramName];

    if (!resourceOwnerId) {
      return next(new UnauthorizedError('Resource ID is required'));
    }

    // Allow admins to bypass ownership check if enabled
    if (allowAdmin && req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.user._id.toString() !== resourceOwnerId && req.user.id !== resourceOwnerId) {
      return next(
        new UnauthorizedError('You are not authorized to perform this action on this resource')
      );
    }

    next();
  };
};

/**
 * Verify user has specific role
 * More strict than authorize middleware - will be called directly
 */
export const requireRole = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          `User role '${req.user.role}' is not authorized to access this resource. Required role(s): ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};

/**
 * Verify that the resource belongs to the user or user is admin
 * Used for resources like bookings that belong to a user
 */
export const verifyResourceOwnership = (resourceOwnerField: string = 'user') => {
  return async (req: any, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;

    if (!resourceId) {
      return next(new UnauthorizedError('Resource ID is required'));
    }

    // Admin bypass
    if (req.user.role === 'admin') {
      return next();
    }

    // For now, just pass to controller to handle - controller will verify ownership
    // This middleware sets up a flag for the controller to use
    req.requireOwnershipVerification = resourceOwnerField;
    next();
  };
};
