import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  createReview,
  getReviewsByTrip,
  getReviewById,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews,
  getAllReviews,
  getReviewStats,
} from '../services/review.service';
import { IReviewInput } from '../interfaces/review.interface';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReviewHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewData: IReviewInput = req.body;
    const review = await createReview(reviewData, req.user.id);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get reviews by trip
// @route   GET /api/reviews/trip/:tripId
// @access  Public
export const getReviewsByTripHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await getReviewsByTrip(req.params.tripId, page, limit);

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: page,
        limit,
      },
      averageRating: result.averageRating,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviewsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await getAllReviews(page, limit);

    res.status(200).json({
      success: true,
      data: result.reviews,
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

// @desc    Get user reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
export const getUserReviewsHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const reviews = await getUserReviews(req.user.id);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await updateReview(req.params.id, req.body);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await deleteReview(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Public
export const markReviewHelpfulHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await markHelpful(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review statistics for a trip
// @route   GET /api/reviews/stats/:tripId
// @access  Public
export const getReviewStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getReviewStats(req.params.tripId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
