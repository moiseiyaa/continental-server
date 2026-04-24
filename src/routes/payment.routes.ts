import { Router } from 'express';
import { body } from 'express-validator';
import {
  createPaymentHandler,
  getPaymentsHandler,
  verifyPaymentHandler,
  verifyFlutterwavePaymentHandler,
  handleFlutterwaveWebhook,
  refundFlutterwavePaymentHandler,
} from '../controllers/payment.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ========================
// STRIPE PAYMENT ROUTES (legacy)
// ========================

// @route   GET /api/payments
// @desc    Get payments (stub)
// @access  Private
router.get('/', getPaymentsHandler);

// @route   POST /api/payments
// @desc    Create a payment intent
// @access  Private
router.post('/', createPaymentHandler);

// @route   GET /api/payments/:id
// @desc    Verify a payment intent
// @access  Private
router.get('/:id', verifyPaymentHandler);

// ========================
// FLUTTERWAVE PAYMENT ROUTES
// ========================

// @route   POST /api/payments/flutterwave/verify
// @desc    Verify a Flutterwave payment transaction
// @access  Public
router.post(
  '/flutterwave/verify',
  body('transactionId').notEmpty().trim(),
  body('bookingId').notEmpty().trim(),
  verifyFlutterwavePaymentHandler
);

// @route   POST /api/payments/flutterwave/callback
// @desc    Handle Flutterwave webhook callbacks
// @access  Public (with signature verification)
router.post('/flutterwave/callback', handleFlutterwaveWebhook);

// @route   POST /api/payments/flutterwave/refund
// @desc    Refund a Flutterwave payment
// @access  Private/Admin
router.post(
  '/flutterwave/refund',
  protect,
  authorize('admin'),
  body('bookingId').notEmpty(),
  body('transactionId').notEmpty(),
  refundFlutterwavePaymentHandler
);

export default router;