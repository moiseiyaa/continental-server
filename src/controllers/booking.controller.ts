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

import { verifyPayment } from '../services/payment.service';

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

    // Validate required fields
    if (!bookingData.trip) {
      return res.status(400).json({ message: 'Trip ID is required.' });
    }
    if (!bookingData.numberOfParticipants || bookingData.numberOfParticipants < 1) {
      return res.status(400).json({ message: 'Number of participants must be at least 1.' });
    }
    if (!bookingData.participantDetails || bookingData.participantDetails.length === 0) {
      return res.status(400).json({ message: 'At least one participant is required.' });
    }

    // Validate participant details
    for (let i = 0; i < bookingData.participantDetails.length; i++) {
      const p = bookingData.participantDetails[i];
      if (!p.name || !p.name.trim()) {
        return res.status(400).json({ message: `Participant ${i + 1}: Name is required.` });
      }
      if (!p.email || !p.email.trim()) {
        return res.status(400).json({ message: `Participant ${i + 1}: Email is required.` });
      }
      if (!p.phone || !p.phone.trim()) {
        return res.status(400).json({ message: `Participant ${i + 1}: Phone is required.` });
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email)) {
        return res.status(400).json({ message: `Participant ${i + 1}: Invalid email address.` });
      }
    }

    // Step 1: Handle user or guest
    let userId;
    let userEmail = req.user?.email;
    let userName = req.user?.name || 'Traveler';
    
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (bookingData.participantDetails && bookingData.participantDetails.length > 0) {
      // GUEST: use first participant email and name
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

// @desc    Finalize booking (creates/updates ghost user, booking, and sends magic link)
// @route   POST /api/bookings/finalize
// @access  Public
export const finalizeBookingHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user: userData, booking: bookingPrefs } = req.body;
    // userData: { email, fullName, phone, country }
    // bookingPrefs: { tripId, guests, participants, addAccommodation, selectedPaymentType }

    if (!userData || !userData.email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    // 1. create or find ghost user
    const { createOrFindGhostUser } = await import('../services/user.service');
    const user = await createOrFindGhostUser(userData.email, userData.fullName, userData.phone, userData.country);
    if (!user) throw new Error('Failed to create/find user');

    // 2. create booking with RESERVED or PENDING status
    const { createBooking } = await import('../services/booking.service');
    const { createMagicLink } = await import('../services/magiclink.service');

    const bookingType = bookingPrefs?.selectedPaymentType === 'RESERVE' ? 'RESERVE' : 'PAY_NOW';
    const status = bookingType === 'RESERVE' ? 'RESERVED' : 'PENDING';
    const reservationExpiry = bookingType === 'RESERVE' ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null;

    const bookingInput: any = {
      tripId: bookingPrefs.tripId || bookingPrefs.trip,
      guests: bookingPrefs.guests || bookingPrefs.numberOfParticipants || 1,
      participantDetails: bookingPrefs.participants || bookingPrefs.participantDetails || [],
      addAccommodation: bookingPrefs.addAccommodation || false,
      status,
      reservationExpiry,
      paymentStatus: 'PENDING',
    };

    const createdBooking = await createBooking(bookingInput, String((user as any).id || (user as any)._id || 0));

    // 3. create magic link BEFORE sending response (so it's in inbox when UI loads)
    const magic = await createMagicLink(Number((user as any).id || (user as any)._id || 0));
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const magicLinkUrl = `${frontend}/auth/verify?token=${magic.token}&booking=${(createdBooking as any).id || (createdBooking as any)._id}`;

    // 4. Email the magic link asynchronously (don't block response)
    const { sendEmail } = await import('../services/email.service');
    sendEmail({
      to: userData.email,
      subject: 'Access your booking confirmation',
      html: `
        <p>Hello ${(userData.fullName || 'Traveler').split(' ')[0]},</p>
        <p>Your booking is confirmed! Access your dashboard anytime with this secure link:</p>
        <p><a href="${magicLinkUrl}" style="color: #2563eb; font-weight: bold;">${magicLinkUrl}</a></p>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours and works without a password.</p>
      `,
    }).catch((err) => console.error('Magic link email failed (non-blocking):', err));

    // 5. Return success with SuccessHub data
    res.status(201).json({
      success: true,
      booking: {
        id: (createdBooking as any).id || (createdBooking as any)._id,
        status: status,
      },
      user: {
        name: userData.fullName || 'Traveler',
      },
      bookingType,
      magicLink: magic.token,
      magicLinkUrl,
    });
  } catch (err) {
    next(err);
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

// @desc    Process booking with optional direct payment verification
// @route   POST /api/bookings/process
// @access  Private (expects auth or guest flow)
export const processBookingHandler = async (req: any, res: Response, next: NextFunction) => {
  const { userData, tourId, paymentIntentId, isDirectPayment } = req.body;
  // userData: { id?, email?, guests? }
  try {
    // Create booking as PENDING inside createBooking (which is transactional)
    const bookingInput = {
      trip: tourId || req.body.trip || req.body.tripId,
      numberOfParticipants: (userData && userData.guests) || req.body.numberOfParticipants || 1,
      participantDetails: req.body.participantDetails || [],
      specialRequests: req.body.specialRequests || null,
    };

    const userId = (req.user && req.user.id) || (userData && userData.id) || 0;
    const booking = await createBooking(bookingInput as any, userId || 0);

    if (!booking) return res.status(500).json({ success: false, message: 'Failed to create booking' });

    // If direct payment requested, verify payment and update booking statuses in service
    if (isDirectPayment) {
      const ok = await verifyPayment(paymentIntentId);
      if (!ok) {
        // mark payment as pending and return failure
        await updatePaymentStatus((booking as any).id || (booking as any)._id, 'pending');
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
      // mark as paid and confirmed
      await updatePaymentStatus((booking as any).id || (booking as any)._id, 'paid');
      await updateBookingStatus((booking as any).id || (booking as any)._id, 'confirmed');
    } else {
      // Reserve only
      await updateBookingStatus((booking as any).id || (booking as any)._id, 'pending');
      await updatePaymentStatus((booking as any).id || (booking as any)._id, 'pending');
    }

    return res.status(200).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}
