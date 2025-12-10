import { Document } from 'mongoose';

export interface IGallery extends Document {
  trip: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryInput {
  trip: string;
  title: string;
  description?: string;
}
