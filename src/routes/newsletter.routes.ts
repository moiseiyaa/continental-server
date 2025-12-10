import { Router } from 'express';
import { body } from 'express-validator';
import {
  subscribeHandler,
  unsubscribeHandler,
  getSubscriberHandler,
  getAllSubscribersHandler,
  deleteSubscriberHandler,
  getStatsHandler,
  sendNewsletterHandler,
} from '../controllers/newsletter.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post(
  '/subscribe',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').optional().trim(),
  ],
  subscribeHandler
);

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post(
  '/unsubscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  unsubscribeHandler
);

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin)
// @access  Private/Admin
router.get('/subscribers', protect, authorize('admin'), getAllSubscribersHandler);

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics (Admin)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getStatsHandler);

// @route   GET /api/newsletter/subscriber/:email
// @desc    Get newsletter subscriber (Admin)
// @access  Private/Admin
router.get('/subscriber/:email', protect, authorize('admin'), getSubscriberHandler);

// @route   DELETE /api/newsletter/subscriber/:email
// @desc    Delete newsletter subscriber (Admin)
// @access  Private/Admin
router.delete('/subscriber/:email', protect, authorize('admin'), deleteSubscriberHandler);

// @route   POST /api/newsletter/send
// @desc    Send newsletter email (Admin)
// @access  Private/Admin
router.post(
  '/send',
  protect,
  authorize('admin'),
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  sendNewsletterHandler
);

export default router;
