import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getCurrentUser, forgotPasswordHandler, resetPasswordHandler, verifyEmailHandler } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post(
  '/forgot-password',
  [
    body('email', 'Please include a valid email').isEmail(),
  ],
  forgotPasswordHandler
);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password',
  [
    body('token', 'Token is required').not().isEmpty(),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  resetPasswordHandler
);

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post(
  '/verify-email',
  [
    body('token', 'Token is required').not().isEmpty(),
  ],
  verifyEmailHandler
);

export default router;
