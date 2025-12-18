import { IBooking, IBookingInput } from '../interfaces/booking.interface';
import Booking from '../models/booking.model';
import Trip from '../models/trip.model';
import { updateTripParticipants } from './trip.service';
import { logError } from '../utils/logger';
import mongoose from 'mongoose';

export const createBooking = async (bookingData: IBookingInput, userId: string): Promise<IBooking> => {
  // Use MongoDB session for transaction support
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get trip details with session
    const trip = await Trip.findById(bookingData.trip).session(session);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if trip has available spots
    if (trip.currentParticipants + bookingData.numberOfParticipants > trip.maxParticipants) {
      throw new Error('Not enough available spots for this trip');
    }

    // Calculate total price
    const totalPrice = trip.price * bookingData.numberOfParticipants;

    // Create booking within transaction
    const booking = await Booking.create(
      [
        {
          ...bookingData,
          user: userId,
          totalPrice,
        },
      ],
      { session }
    );

    // Update trip participants within transaction
    await Trip.findByIdAndUpdate(
      bookingData.trip,
      { $inc: { currentParticipants: bookingData.numberOfParticipants } },
      { new: true, session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Return populated booking (after transaction)
    return await booking[0].populate('user trip');
  } catch (error: any) {
    // Rollback transaction on error
    await session.abortTransaction();
    logError('Error creating booking', error);
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getUserBookings = async (userId: string): Promise<IBooking[]> => {
  return await Booking.find({ user: userId })
    .populate('trip')
    .sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId: string): Promise<IBooking | null> => {
  return await Booking.findById(bookingId).populate('user trip');
};

export const getAllBookings = async (
  page: number = 1,
  limit: number = 10,
  filters?: any
): Promise<{ bookings: IBooking[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters?.status) {
    query.status = filters.status;
  }
  if (filters?.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }
  if (filters?.trip) {
    query.trip = filters.trip;
  }

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate('user', 'name email')
    .populate('trip', 'title destination')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    bookings,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<IBooking | null> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // If cancelling, reduce trip participants
  if (status === 'cancelled' && booking.status !== 'cancelled') {
    await updateTripParticipants(booking.trip.toString(), -booking.numberOfParticipants);
  }

  booking.status = status;
  await booking.save();

  return booking.populate('user trip');
};

export const updatePaymentStatus = async (
  bookingId: string,
  paymentStatus: 'pending' | 'paid' | 'refunded'
): Promise<IBooking | null> => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    { paymentStatus },
    { new: true }
  ).populate('user trip');
};

export const cancelBooking = async (bookingId: string): Promise<IBooking | null> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  // Reduce trip participants
  await updateTripParticipants(booking.trip.toString(), -booking.numberOfParticipants);

  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  return booking.populate('user trip');
};

export const deleteBooking = async (bookingId: string): Promise<IBooking | null> => {
  const booking = await Booking.findByIdAndDelete(bookingId);
  if (booking && booking.status !== 'cancelled') {
    await updateTripParticipants(booking.trip.toString(), -booking.numberOfParticipants);
  }
  return booking;
};
