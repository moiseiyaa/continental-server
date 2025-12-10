import { Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  response?: string | null;
  respondedAt?: Date | null;
  respondedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface IContactResponse {
  response: string;
}
