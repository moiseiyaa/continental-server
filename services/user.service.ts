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

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select('-password');
};
