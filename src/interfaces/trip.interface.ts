import { Document } from 'mongoose';

export interface ITrip extends Document {
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  itinerary: string[];
  images: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  difficulty: 'easy' | 'moderate' | 'hard';
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITripInput {
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  itinerary?: string[];
  images?: string[];
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  difficulty?: 'easy' | 'moderate' | 'hard';
}
