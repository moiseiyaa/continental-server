import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  isActive: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
  getResetPasswordToken: () => string;
  getEmailVerificationToken: () => string;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}
