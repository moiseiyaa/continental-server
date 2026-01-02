import { Router } from 'express';
import { getPaymentsHandler } from '../controllers/payment.controller';

const router = Router();

// @route   GET /api/payments
// @desc    Get payments (stub)
// @access  Private
router.get('/', getPaymentsHandler);

export default router;