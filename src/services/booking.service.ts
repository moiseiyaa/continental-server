// Booking service – PostgreSQL migration TODO
import { pool } from '../config/db'
import { IBooking, IBookingInput } from '../interfaces/booking.interface'

// NOTE: Full Booking implementation is pending PostgreSQL tables.
// These minimal stubs keep the server compiling while we finish the migration.

export const createBooking = async (_data: IBookingInput, _userId: string): Promise<IBooking | null> => {
  // TODO: insert into bookings table & update trip participants atomically
  return null
}

export const getUserBookings = async (_userId: string): Promise<IBooking[]> => {
  return []
}

export const getBookingById = async (_id: string): Promise<IBooking | null> => {
  return null
}

export const getAllBookings = async (
  _page = 1,
  _limit = 10,
  _filters: any = {}
): Promise<{ bookings: IBooking[]; total: number; pages: number }> => {
  return { bookings: [], total: 0, pages: 0 }
}

export const updateBookingStatus = async (
  _id: string,
  _status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<IBooking | null> => null

export const updatePaymentStatus = async (
  _id: string,
  _status: 'pending' | 'paid' | 'refunded'
): Promise<IBooking | null> => null

export const cancelBooking = async (_id: string): Promise<IBooking | null> => null

export const deleteBooking = async (_id: string): Promise<IBooking | null> => null