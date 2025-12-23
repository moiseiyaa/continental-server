import { IUser, IUserInput } from '../interfaces';
import User from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRE, FRONTEND_URL } from '../config/env';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from './email.service';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const register = async (userData: IUserInput): Promise<{ user: IUser; token: string }> => {
  try {
    console.log('Auth service: Starting registration for:', userData.email);
    
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Name, email, and password are required');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Normalize email to lowercase
    userData.email = userData.email.toLowerCase();
    console.log('Auth service: Email normalized to:', userData.email);
    
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    console.log('Auth service: Password hashed');
    
    // Set default role if not provided
    if (!userData.role) {
      userData.role = 'user';
    }
    
    // Create user
    const user = await User.create(userData);
    console.log('Auth service: User created in database with ID:', user._id);
    
    // Generate JWT token
    const token = user.getSignedJwtToken();
    console.log('Auth service: JWT token generated successfully');
    
    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();
    console.log('Auth service: Email verification token generated');
    
    // In development, we'll skip sending emails but log the token
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth service: Development mode - Email sending skipped');
      console.log('Verification token (dev only):', verificationToken);
    } else {
      // In production, send verification email
      try {
        await sendVerificationEmail(user.email, verificationToken, FRONTEND_URL);
        await sendWelcomeEmail(user.email, user.name);
        console.log('Auth service: Verification emails sent');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Don't fail the registration if email sending fails
      }
    }
    
    console.log('Auth service: Registration completed successfully');
    return { user, token };
    
  } catch (error: any) {
    console.error('Auth service: Registration failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    // Re-throw with a more user-friendly message
    if (error.code === 11000) {
      throw new Error('This email is already registered');
    } else if (error.name === 'ValidationError') {
      // Format Mongoose validation errors
      const messages = Object.values(error.errors).map((val: any) => val.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    
    // For other errors, include the original message if it's a known error
    if (error.message && typeof error.message === 'string') {
      throw error; // Re-throw with original error message
    }
    
    // For unknown errors, provide a generic message
    throw new Error('Registration failed. Please try again.');
  }
};

export const login = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  // Normalize email to lowercase
  email = email.toLowerCase();
  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = user.getSignedJwtToken();
  return { user, token };
};

export const getMe = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select('-password');
};

export const forgotPassword = async (email: string): Promise<string> => {
  // Normalize email to lowercase
  email = email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found with this email');
  }

  // Generate password reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken, FRONTEND_URL);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new Error('Email could not be sent');
  }

  return 'Password reset email sent';
};

export const resetPassword = async (resetToken: string, newPassword: string): Promise<IUser> => {
  // Hash the token to match with database
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};

export const verifyEmail = async (verificationToken: string): Promise<IUser> => {
  // Hash the token to match with database
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  // Mark email as verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  return user;
};
export const refreshAccessToken = async (refreshToken: string): Promise<IUser | null> => {
  try {
    // Verify refresh token
    const decoded: any = jwt.verify(refreshToken, JWT_SECRET);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify refresh token hasn't expired
    if (!user.refreshTokenExpire || new Date(user.refreshTokenExpire) < new Date()) {
      throw new Error('Refresh token expired');
    }

    // Verify hash matches stored hash
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    if (user.refreshTokenHash !== refreshTokenHash) {
      throw new Error('Invalid refresh token');
    }

    return user;
  } catch (error: any) {
    console.error('Refresh token validation error:', error.message);
    return null;
  }
};