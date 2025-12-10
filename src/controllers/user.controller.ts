import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { getMe } from '../services/auth.service';
import {
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  reactivateUser,
} from '../services/user.service';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const user = await updateUser(req.user.id, { name, email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await deleteUser(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await getAllUsers(page, limit);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await updateUserRole(req.params.id, role);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Deactivate user account (Admin)
// @route   PUT /api/users/:id/deactivate
// @access  Private/Admin
export const deactivateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deactivateUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User account deactivated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reactivate user account (Admin)
// @route   PUT /api/users/:id/reactivate
// @access  Private/Admin
export const reactivateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await reactivateUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User account reactivated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
