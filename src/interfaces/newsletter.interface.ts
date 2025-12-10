import { Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  isActive: boolean;
  unsubscribedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsletterInput {
  email: string;
  name?: string;
}
