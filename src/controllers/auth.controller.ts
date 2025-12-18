import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { register, login, getMe, forgotPassword, resetPassword, verifyEmail, refreshAccessToken } from '../services/auth.service';
import { IUserInput } from '../interfaces';
import { sendTokenResponse, UnauthorizedError } from '../utils/apiResponse';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role }: IUserInput = req.body;
    const { user, token } = await register({ name, email, password, role });
    
    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    
    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const message = await forgotPassword(email);
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const user = await resetPassword(token, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const user = await verifyEmail(token);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return next(new UnauthorizedError('Refresh token not found'));
    }

    const user = await refreshAccessToken(refreshToken);

    if (!user) {
      return next(new UnauthorizedError('Invalid or expired refresh token'));
    }

    // Send new access token (without including new refresh token in response body)
    res.cookie('token', user.getSignedJwtToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    res.status(200).json({
      success: true,
      token: user.getSignedJwtToken(),
      message: 'Token refreshed successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
