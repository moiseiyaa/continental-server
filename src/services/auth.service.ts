import { IUser, IUserInput } from '../interfaces';
import User from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRE, FRONTEND_URL } from '../config/env';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from './email.service';
import crypto from 'crypto';

export const register = async (userData: IUserInput): Promise<{ user: IUser; token: string }> => {
  // Normalize email to lowercase
  userData.email = userData.email.toLowerCase();
  const user = await User.create(userData);
  const token = user.getSignedJwtToken();
  
  // Generate email verification token
  const verificationToken = user.getEmailVerificationToken();
  await user.save();
  
  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken, FRONTEND_URL);
    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.error('Error sending email:', error);
  }
  
  return { user, token };
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