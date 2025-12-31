
// Define user roles as a type
export type UserRole = 'user' | 'admin' | 'guest';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  refreshTokenHash?: string;
  refreshTokenExpire?: Date;
  isActive?: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
  getResetPasswordToken: () => string;
  getEmailVerificationToken: () => string;
  getRefreshToken: () => string;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
