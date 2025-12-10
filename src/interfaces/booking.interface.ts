import { Document } from 'mongoose';

export interface IBooking extends Document {
  user: string;
  trip: string;
  numberOfParticipants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingDate: Date;
  specialRequests?: string;
  participantDetails: {
    name: string;
    email: string;
    phone: string;
    age?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingInput {
  trip: string;
  numberOfParticipants: number;
  specialRequests?: string;
  participantDetails: {
    name: string;
    email: string;
    phone: string;
    age?: number;
  }[];
}
