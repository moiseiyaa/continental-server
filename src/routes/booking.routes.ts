import { Router } from 'express';
import { body } from 'express-validator';
import {
  createBookingHandler,
  getUserBookingsHandler,
  getBookingByIdHandler,
  getAllBookingsHandler,
  updateBookingStatusHandler,
  updatePaymentStatusHandler,
  cancelBookingHandler,
  deleteBookingHandler,
} from '../controllers/booking.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post(
  '/',
  protect,
  [
    body('trip', 'Trip ID is required').not().isEmpty(),
    body('numberOfParticipants', 'Number of participants must be a number').isNumeric(),
    body('participantDetails', 'Participant details are required').isArray(),
  ],
  createBookingHandler
);

// @route   GET /api/bookings/user/my-bookings
// @desc    Get user bookings
// @access  Private
router.get('/user/my-bookings', protect, getUserBookingsHandler);

// @route   GET /api/bookings
// @desc    Get all bookings (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllBookingsHandler);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, getBookingByIdHandler);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [body('status', 'Status is required').not().isEmpty()],
  updateBookingStatusHandler
);

// @route   PUT /api/bookings/:id/payment-status
// @desc    Update payment status
// @access  Private/Admin
router.put(
  '/:id/payment-status',
  protect,
  authorize('admin'),
  [body('paymentStatus', 'Payment status is required').not().isEmpty()],
  updatePaymentStatusHandler
);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, cancelBookingHandler);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteBookingHandler);

export default router;
