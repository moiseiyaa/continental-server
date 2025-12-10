import { Request, Response, NextFunction } from 'express';
import {
  getUserStats,
  getTripStats,
  getBookingStats,
  getRevenueStats,
  getContactStats,
  getNewsletterStats,
  getDashboardOverview,
  getTopTrips,
  getRecentBookings,
  getRecentContacts,
} from '../services/admin.service';

// @desc    Get dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const overview = await getDashboardOverview();

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/stats/users
// @access  Private/Admin
export const getUserStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getUserStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trip statistics
// @route   GET /api/admin/stats/trips
// @access  Private/Admin
export const getTripStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getTripStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/admin/stats/bookings
// @access  Private/Admin
export const getBookingStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getBookingStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue statistics
// @route   GET /api/admin/stats/revenue
// @access  Private/Admin
export const getRevenueStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getRevenueStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact statistics
// @route   GET /api/admin/stats/contacts
// @access  Private/Admin
export const getContactStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getContactStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter statistics
// @route   GET /api/admin/stats/newsletter
// @access  Private/Admin
export const getNewsletterStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
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

// @desc    Get top rated trips
// @route   GET /api/admin/top-trips
// @access  Private/Admin
export const getTopTripsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const trips = await getTopTrips(limit);

    res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent bookings
// @route   GET /api/admin/recent-bookings
// @access  Private/Admin
export const getRecentBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const bookings = await getRecentBookings(limit);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent contacts
// @route   GET /api/admin/recent-contacts
// @access  Private/Admin
export const getRecentContactsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const contacts = await getRecentContacts(limit);

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};
