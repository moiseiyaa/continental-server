import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-15.clover',
});

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

    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    res.status(200).json({
      success: true,
      status: paymentIntent.status,
    });
  } catch (error) {
    next(error);
  }
};