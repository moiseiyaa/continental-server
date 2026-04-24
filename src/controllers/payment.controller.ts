import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { validationResult } from 'express-validator';
import { pool } from '../config/db';
import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
  getFlutterwavePaymentStatus,
  refundFlutterwavePayment,
  getFlutterwaveTransactionDetails,
} from '../services/payment.service';

/**
 * ========== STRIPE PAYMENT HANDLERS (Legacy) ==========
 */

// Initialize Stripe only if API key is available
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Please set it in your environment variables.');
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover' as any,
  });
};

// @desc    Get payments (stub)
// @route   GET /api/payments
// @access  Private
export const getPaymentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement payments logic
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a payment intent
// @route   POST /api/payments
// @access  Private
export const createPaymentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ success: false, message: 'Amount and currency are required.' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a payment intent
// @route   GET /api/payments/:id
// @access  Private
export const verifyPaymentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Payment intent ID is required.' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(String(id));

    res.status(200).json({
      success: true,
      status: paymentIntent.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ========== FLUTTERWAVE PAYMENT HANDLERS ==========
 * Primary payment processor for Continental Travels
 */

/**
 * Initialize a Flutterwave payment for a booking
 * @route POST /api/payments/flutterwave/initialize
 * @access Private
 */
export const initializeFlutterwavePaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { bookingId, amount, currency, fullName, email, phoneNumber } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Validate booking exists and belongs to user
    const bookingResult = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    const bookingReference = `BOOKING_${bookingId}_${Date.now()}`;

    try {
      const paymentResponse = await initializeFlutterwavePayment(
        amount,
        currency,
        userId,
        email,
        phoneNumber,
        bookingReference,
        fullName
      );

      // Store payment transaction record
      await pool.query(
        `INSERT INTO payment_transactions 
         (booking_id, user_id, reference, amount, currency, status, payment_method, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [bookingId, userId, bookingReference, amount, currency, 'pending', 'flutterwave']
      );

      res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          paymentLink: paymentResponse.data.link,
          reference: bookingReference,
          amount: amount,
          currency: currency,
        },
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Verify a Flutterwave payment transaction
 * @route POST /api/payments/flutterwave/verify
 * @access Private
 */
export const verifyFlutterwavePaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { transactionId, reference } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify payment with Flutterwave
    const verification = await verifyFlutterwavePayment(transactionId);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verification.error,
      });
    }

    // Update payment transaction status
    const updateResult = await pool.query(
      `UPDATE payment_transactions 
       SET status = 'completed', transaction_id = $1, updated_at = NOW() 
       WHERE reference = $2 AND user_id = $3 
       RETURNING *`,
      [verification.transactionId, reference, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment transaction not found' });
    }

    const transaction = updateResult.rows[0];

    // Update booking status to CONFIRMED
    await pool.query(
      `UPDATE bookings 
       SET status = 'CONFIRMED', payment_status = 'PAID', updated_at = NOW() 
       WHERE id = $1 AND user_id = $2`,
      [transaction.booking_id, userId]
    );

    console.log(`✅ Payment verified for booking #${transaction.booking_id}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        bookingId: transaction.booking_id,
        transactionId: verification.transactionId,
        amount: verification.amount,
        currency: verification.currency,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    next(error);
  }
};

/**
 * Get payment status
 * @route GET /api/payments/flutterwave/status/:reference
 * @access Private
 */
export const getFlutterwavePaymentStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reference } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Get transaction from database
    const result = await pool.query(
      'SELECT * FROM payment_transactions WHERE reference = $1 AND user_id = $2',
      [reference, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const transaction = result.rows[0];

    // Get latest status from Flutterwave if transaction ID exists
    try {
      if (transaction.transaction_id) {
        const details = await getFlutterwaveTransactionDetails(transaction.transaction_id);

        res.status(200).json({
          success: true,
          data: {
            reference: transaction.reference,
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency,
            flutterwaveStatus: details.status,
            createdAt: transaction.created_at,
            completedAt: transaction.updated_at,
          },
        });
      } else {
        res.status(200).json({
          success: true,
          data: {
            reference: transaction.reference,
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency,
            createdAt: transaction.created_at,
          },
        });
      }
    } catch (error) {
      // If Flutterwave fetch fails, return stored data
      res.status(200).json({
        success: true,
        data: {
          reference: transaction.reference,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
          createdAt: transaction.created_at,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Refund a payment (admin only)
 * @route POST /api/payments/flutterwave/refund
 * @access Private (Admin)
 */
export const refundFlutterwavePaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { transactionId, reason } = req.body;
    const userId = (req as any).user?.id;
    const userRoles = (req as any).user?.roles || [];

    // Check if user is admin
    if (!userRoles.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Find transaction
    const result = await pool.query(
      'SELECT * FROM payment_transactions WHERE transaction_id = $1',
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment transaction not found' });
    }

    const transaction = result.rows[0];

    // Process refund
    try {
      const refundResponse = await refundFlutterwavePayment(transactionId);

      if (refundResponse.success) {
        // Update transaction status
        await pool.query(
          `UPDATE payment_transactions 
           SET status = 'refunded', refund_id = $1, refund_reason = $2, updated_at = NOW() 
           WHERE transaction_id = $3`,
          [refundResponse.refundId, reason, transactionId]
        );

        // Update booking payment status
        await pool.query(
          `UPDATE bookings 
           SET payment_status = 'REFUNDED', updated_at = NOW() 
           WHERE id = $1`,
          [transaction.booking_id]
        );

        console.log(`♻️ Payment refunded for booking #${transaction.booking_id}`);

        res.status(200).json({
          success: true,
          message: 'Payment refunded successfully',
          data: {
            refundId: refundResponse.refundId,
            originalAmount: transaction.amount,
            status: 'refunded',
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Refund failed',
          error: refundResponse.message,
        });
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook handler for Flutterwave payment notifications
 * @route POST /api/payments/flutterwave/webhook
 * @access Public (signature verified)
 */
export const handleFlutterwaveWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hash = req.headers['verificationhash'] as string;
    const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

    // Verify webhook hash (recommended but optional)
    if (webhookSecret && hash !== webhookSecret) {
      console.warn('Invalid Flutterwave webhook signature');
      return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }

    const payload = req.body;

    // Handle different webhook events
    if (payload.event === 'charge.completed') {
      const { data } = payload;

      // Update transaction status
      await pool.query(
        `UPDATE payment_transactions 
         SET status = 'completed', transaction_id = $1, updated_at = NOW() 
         WHERE reference = $2`,
        [data.id, data.tx_ref]
      );

      // Update booking status
      const bookingResult = await pool.query(
        'SELECT booking_id FROM payment_transactions WHERE reference = $1',
        [data.tx_ref]
      );

      if (bookingResult.rows.length > 0) {
        await pool.query(
          `UPDATE bookings 
           SET status = 'CONFIRMED', payment_status = 'PAID', updated_at = NOW() 
           WHERE id = $1`,
          [bookingResult.rows[0].booking_id]
        );

        console.log(
          `✅ Webhook: Payment completed for booking #${bookingResult.rows[0].booking_id} | Amount: ${data.amount} ${data.currency}`
        );
      }
    } else if (payload.event === 'charge.failed') {
      const { data } = payload;

      // Update transaction status
      await pool.query(
        `UPDATE payment_transactions 
         SET status = 'failed', error_message = $1, updated_at = NOW() 
         WHERE reference = $2`,
        [data.failure_reason || 'Payment failed', data.tx_ref]
      );

      console.log(`❌ Webhook: Payment failed for ${data.tx_ref}`);
    } else if (payload.event === 'charge.refunded') {
      const { data } = payload;

      // Update transaction status
      await pool.query(
        `UPDATE payment_transactions 
         SET status = 'refunded', refund_id = $1, updated_at = NOW() 
         WHERE reference = $2`,
        [data.refund?.id || null, data.tx_ref]
      );

      console.log(`♻️ Webhook: Payment refunded for ${data.tx_ref}`);
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing Flutterwave webhook:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

export default {
  // Stripe
  getPaymentsHandler,
  createPaymentHandler,
  verifyPaymentHandler,
  // Flutterwave
  initializeFlutterwavePaymentHandler,
  verifyFlutterwavePaymentHandler,
  getFlutterwavePaymentStatusHandler,
  refundFlutterwavePaymentHandler,
  handleFlutterwaveWebhook,
};