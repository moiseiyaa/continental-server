import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserRoleHandler,
  deactivateUserHandler,
  reactivateUserHandler,
} from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  updateUserProfile
);

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', protect, deleteUserAccount);

// @route   GET /api/users
// @desc    Get all users (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllUsersHandler);

// @route   GET /api/users/:id
// @desc    Get single user (Admin)
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getUserByIdHandler);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin)
// @access  Private/Admin
router.put(
  '/:id/role',
  protect,
  authorize('admin'),
  [body('role').notEmpty().withMessage('Role is required')],
  updateUserRoleHandler
);

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate user account (Admin)
// @access  Private/Admin
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUserHandler);

// @route   PUT /api/users/:id/reactivate
// @desc    Reactivate user account (Admin)
// @access  Private/Admin
router.put('/:id/reactivate', protect, authorize('admin'), reactivateUserHandler);

export default router;
