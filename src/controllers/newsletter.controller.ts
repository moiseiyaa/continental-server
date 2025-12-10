import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscriber,
  getAllSubscribers,
  deleteSubscriber,
  getNewsletterStats,
  sendNewsletterEmail,
} from '../services/newsletter.service';
import { INewsletterInput } from '../interfaces/newsletter.interface';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data: INewsletterInput = req.body;
    const subscriber = await subscribeToNewsletter(data);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscriber,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const subscriber = await unsubscribeFromNewsletter(email);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter subscriber
// @route   GET /api/newsletter/subscriber/:email
// @access  Private/Admin
export const getSubscriberHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriber = await getNewsletterSubscriber(req.params.email);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all newsletter subscribers (Admin)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
export const getAllSubscribersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activeOnly = req.query.activeOnly !== 'false';

    const result = await getAllSubscribers(page, limit, activeOnly);

    res.status(200).json({
      success: true,
      data: result.subscribers,
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

// @desc    Delete newsletter subscriber (Admin)
// @route   DELETE /api/newsletter/subscriber/:email
// @access  Private/Admin
export const deleteSubscriberHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriber = await deleteSubscriber(req.params.email);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter statistics (Admin)
// @route   GET /api/newsletter/stats
// @access  Private/Admin
export const getStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getNewsletterStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send newsletter email (Admin)
// @route   POST /api/newsletter/send
// @access  Private/Admin
export const sendNewsletterHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message } = req.body;
    const result = await sendNewsletterEmail(subject, message);

    res.status(200).json({
      success: true,
      message: 'Newsletter sent successfully',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
