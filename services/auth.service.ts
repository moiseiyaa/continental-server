import { IUser, IUserInput } from '../server/interfaces';
import User from '../server/models/user.model';
import { JWT_SECRET, JWT_EXPIRE } from '../config/env';
import jwt from 'jsonwebtoken';

export const register = async (userData: IUserInput): Promise<{ user: IUser; token: string }> => {
  const user = await User.create(userData);
  const token = user.getSignedJwtToken();
  return { user, token };
};

export const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ user: IUser; token: string }> => {
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

  // Generate token with extended expiry if rememberMe is true
  const token = user.getSignedJwtToken(rememberMe ? '30d' : undefined);
  return { user, token };
};

export const getMe = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select('-password');
};
