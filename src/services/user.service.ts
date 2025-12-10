import { IUser } from '../interfaces';
import User from '../models/user.model';

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select('-password');
};

export const updateUser = async (userId: string, userData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    userData,
    { new: true, runValidators: true }
  ).select('-password');
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(userId);
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: IUser[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    users,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');
};

export const deactivateUser = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true, runValidators: true }
  ).select('-password');
};

export const reactivateUser = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true, runValidators: true }
  ).select('-password');
};
