export enum BookingStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export interface BookingParticipant {
  name: string;
  email: string;
  phone: string;
  age?: number;
}

export interface IBooking {
  // New canonical fields
  id: string;
  userId: string;
  tripId: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  addAccommodation: boolean;
  reservationExpiry?: Date;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  participants: BookingParticipant[];
  createdAt: Date;
  updatedAt?: Date;

  // Legacy fields (kept for backward compatibility)
  _id?: string;
  user?: any;
  trip?: any;
  numberOfParticipants?: number;
  paymentStatusLegacy?: string;
  participantDetails?: BookingParticipant[];
  bookingDate?: Date;
}

export interface IBookingInput {
  // New canonical fields
  tripId?: string;
  guests?: number;
  participants?: BookingParticipant[];
  addAccommodation?: boolean;
  specialRequests?: string;

  // Legacy fields (for older callers)
  trip?: string;
  numberOfParticipants?: number;
  participantDetails?: BookingParticipant[];
}

