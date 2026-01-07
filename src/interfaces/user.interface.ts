
// Define user roles as a type
// Define user roles as a type (legacy)
export type UserRole = 'user' | 'admin' | 'guest';

// New Ghost/Verified user model
export interface User {
  id: string;
  email: string; // Unique identifier
  fullName: string;
  phone: string;
  country: string;
  hasPassword: boolean; // false = Ghost Account
  createdAt: Date;
}

// Legacy IUser shape (many services/controllers expect this)
export interface IUser {
  id?: number | string;
  name?: string;
  email: string;
  password?: string;
  role?: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  refreshTokenHash?: string;
  refreshTokenExpire?: Date;
  isActive?: boolean;
  createdAt?: Date;
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken?: () => string;
  getResetPasswordToken?: () => string;
  getEmailVerificationToken?: () => string;
  getRefreshToken?: () => string;
}

export interface IUserInput {
  // keep both name and fullName to be flexible
  name?: string;
  fullName?: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  country?: string;
}

