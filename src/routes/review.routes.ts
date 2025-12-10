import { Router } from 'express';
import { body } from 'express-validator';
import {
  createReviewHandler,
  getReviewsByTripHandler,
  getReviewByIdHandler,
  getAllReviewsHandler,
  getUserReviewsHandler,
  updateReviewHandler,
  deleteReviewHandler,
  markReviewHelpfulHandler,
  getReviewStatsHandler,
} from '../controllers/review.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post(
  '/',
  protect,
  [
    body('trip').notEmpty().withMessage('Trip ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  createReviewHandler
);

// @route   GET /api/reviews
// @desc    Get all reviews (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllReviewsHandler);

// @route   GET /api/reviews/user/my-reviews
// @desc    Get user's reviews
// @access  Private
router.get('/user/my-reviews', protect, getUserReviewsHandler);

// @route   GET /api/reviews/trip/:tripId
// @desc    Get reviews for a specific trip
// @access  Public
router.get('/trip/:tripId', getReviewsByTripHandler);

// @route   GET /api/reviews/stats/:tripId
// @desc    Get review statistics for a trip
// @access  Public
router.get('/stats/:tripId', getReviewStatsHandler);

// @route   GET /api/reviews/:id
// @desc    Get a single review
// @access  Public
router.get('/:id', getReviewByIdHandler);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put(
  '/:id',
  protect,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().notEmpty().withMessage('Comment cannot be empty'),
  ],
  updateReviewHandler
);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, deleteReviewHandler);

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
router.put('/:id/helpful', markReviewHelpfulHandler);

export default router;
