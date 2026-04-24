import { Router } from 'express';
import { body, param } from 'express-validator';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  // Stripe handlers (legacy)
  getPaymentsHandler,
  createPaymentHandler,
  verifyPaymentHandler,
  // Flutterwave handlers
  initializeFlutterwavePaymentHandler,
  verifyFlutterwavePaymentHandler,
  getFlutterwavePaymentStatusHandler,
  refundFlutterwavePaymentHandler,
  handleFlutterwaveWebhook,
} from '../controllers/payment.controller';

const router = Router();

/**
 * ========== STRIPE PAYMENT ROUTES (Legacy) ==========
 */

// Get all payments
router.get('/', protect, getPaymentsHandler);

// Create payment intent
router.post(
  '/',
  protect,
  body('amount').isInt({ min: 1 }).toInt(),
  body('currency').isString().trim(),
  createPaymentHandler
);

// Verify payment intent
router.get('/:id', protect, param('id').isString(), verifyPaymentHandler);

/**
 * ========== FLUTTERWAVE PAYMENT ROUTES (Primary) ==========
 */

/**
 * Initialize Flutterwave payment
 * POST /api/payments/flutterwave/initialize
 * Body: { bookingId, amount, currency, fullName, email, phoneNumber }
 */
router.post(
  '/flutterwave/initialize',
  protect,
  body('bookingId').isInt({ min: 1 }).toInt(),
  body('amount').isFloat({ min: 0.1 }).toFloat(),
  body('currency').isString().trim(),
  body('fullName').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('phoneNumber').isString().trim().notEmpty(),
  initializeFlutterwavePaymentHandler
);

/**
 * Verify Flutterwave payment after completion
 * POST /api/payments/flutterwave/verify
 * Body: { transactionId, reference }
 */
router.post(
  '/flutterwave/verify',
  protect,
  body('transactionId').isInt({ min: 1 }).toInt(),
  body('reference').isString().trim(),
  verifyFlutterwavePaymentHandler
);

/**
 * Get payment status by reference
 * GET /api/payments/flutterwave/status/:reference
 */
router.get(
  '/flutterwave/status/:reference',
  protect,
  param('reference').isString(),
  getFlutterwavePaymentStatusHandler
);

/**
 * Refund a payment (Admin only)
 * POST /api/payments/flutterwave/refund
 * Body: { transactionId, reason }
 */
router.post(
  '/flutterwave/refund',
  protect,
  authorize('admin'),
  body('transactionId').isInt({ min: 1 }).toInt(),
  body('reason').isString().trim(),
  refundFlutterwavePaymentHandler
);

/**
 * Webhook endpoint for Flutterwave notifications
 * POST /api/payments/flutterwave/webhook
 * No authentication required (signature verified in handler)
 * 
 * Events handled:
 * - charge.completed: Payment successful
 * - charge.failed: Payment failed
 * - charge.refunded: Payment refunded
 */
router.post('/flutterwave/webhook', handleFlutterwaveWebhook);

export default router;
