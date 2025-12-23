import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getCurrentUser, forgotPasswordHandler, resetPasswordHandler, verifyEmailHandler, logoutUser, refreshTokenHandler } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { authRateLimiter, passwordResetLimiter } from '../middlewares/rateLimiter.middleware';
import { validate } from '../middleware/validateRequest';
import { registerValidation } from '../validations/user.validation';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  authRateLimiter,
  validate(registerValidation),
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  '/login',
  authRateLimiter,
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

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public (with refresh token cookie)
router.post('/refresh-token', refreshTokenHandler);// @route   POST /api/auth/logout
// @desc    Logout user & clear token
// @access  Private
router.post('/logout', protect, logoutUser);


// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post(
  '/forgot-password',
  passwordResetLimiter,
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
