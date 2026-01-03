import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import {
  createBooking,
  getUserBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  deleteBooking,
} from '../services/booking.service';

import {
  notifyBookingConfirmation,
  notifyBookingCancellation,
} from '../services/notification.service';

import { sendBookingConfirmation } from '../services/email.service';

import { IBookingInput } from '../interfaces/booking.interface';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBookingHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const bookingData: IBookingInput = req.body;
    const paymentInfo = req.body.payment;
    // Step 1: Handle user or guest
    let userId;
    let userEmail = req.user?.email;
    let userName = req.user?.name || 'Traveler';
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (
      bookingData.participantDetails && bookingData.participantDetails.length > 0 && bookingData.participantDetails[0].email
    ) {
      // GUEST: lookup or create a new user by email (stub logic for now)
      // TODO: Replace with db find-or-create logic
      userEmail = bookingData.participantDetails[0].email;
      userName = bookingData.participantDetails[0].name || 'Traveler';
      userId = null; // In a real implementation, save the result user id
    } else {
      return res.status(400).json({ message: 'User email is required for booking.' });
    }
    // Step 2: Take payment (mock - always success for now)
    // Integrate with Stripe or payment gateway here if paymentInfo exists
    if (paymentInfo) {
      // Example stub: if (!paymentInfo.cardNumber) ...
      // Simulate payment succeeded
    } else {
      // Optionally, you could require payment for bookings
    }
    // Step 3: Create booking (use userId or fallback to mock id: 0 for guests)
    const booking = await createBooking(bookingData, userId || 0);
    if (!booking) {
      return res.status(500).json({ message: 'Failed to create booking' });
    }
    // Send booking confirmation notification & email if email known
    try {
      const tripId = booking.trip as any;
      const tripTitle = (tripId && tripId.title) || 'Your Booked Trip';
      const bookingId = (booking as any)._id?.toString() || '';
      if (bookingId && userEmail) {
        // Do not fail booking if these fail
        await notifyBookingConfirmation(userId, tripTitle, bookingId).catch(() => {});
        await sendBookingConfirmation(userEmail, userName, {
          bookingId: bookingId,
          tourName: tripTitle,
          date: booking.bookingDate ? new Date(booking.bookingDate).toISOString().substring(0,10) : new Date().toISOString().substring(0,10),
          travelers: booking.numberOfParticipants || 1,
          totalAmount: booking.totalPrice || 0,
        }).catch(() => {});
      }
    } catch (notificationError) {
      // Log notification error but don't fail the booking creation
      console.error('Failed to send booking confirmation notification:', notificationError);
    }
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/my-bookings
// @access  Private
export const getUserBookingsHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const bookings = await getUserBookings(req.user.id);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingByIdHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const booking = await getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership (admin can view any booking, users only their own)
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = {
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      trip: req.query.trip,
    };

    const result = await getAllBookings(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await updateBookingStatus(req.params.id, status);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment-status
// @access  Private/Admin
export const updatePaymentStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const booking = await updatePaymentStatus(req.params.id, paymentStatus);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBookingHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const booking = await getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking',
      });
    }

    const cancelledBooking = await cancelBooking(req.params.id);

    if (!cancelledBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Send booking cancellation notification
    try {
      const tripId = cancelledBooking.trip as any;
      const tripTitle = (tripId && tripId.title) || 'Your Booked Trip';
      await notifyBookingCancellation(req.user.id, tripTitle);
    } catch (notificationError) {
      // Log notification error but don't fail the cancellation
      console.error('Failed to send booking cancellation notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await deleteBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
