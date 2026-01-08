import { Router } from 'express';
import { createPaymentHandler, getPaymentsHandler, verifyPaymentHandler } from '../controllers/payment.controller';

const router = Router();

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

export default router;