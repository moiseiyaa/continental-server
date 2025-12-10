import { Router } from 'express';
import {
  getDashboardHandler,
  getUserStatsHandler,
  getTripStatsHandler,
  getBookingStatsHandler,
  getRevenueStatsHandler,
  getContactStatsHandler,
  getNewsletterStatsHandler,
  getTopTripsHandler,
  getRecentBookingsHandler,
  getRecentContactsHandler,
} from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard overview with all statistics
// @access  Private/Admin
router.get('/dashboard', getDashboardHandler);

// @route   GET /api/admin/stats/users
// @desc    Get user statistics
// @access  Private/Admin
router.get('/stats/users', getUserStatsHandler);

// @route   GET /api/admin/stats/trips
// @desc    Get trip statistics
// @access  Private/Admin
router.get('/stats/trips', getTripStatsHandler);

// @route   GET /api/admin/stats/bookings
// @desc    Get booking statistics
// @access  Private/Admin
router.get('/stats/bookings', getBookingStatsHandler);

// @route   GET /api/admin/stats/revenue
// @desc    Get revenue statistics
// @access  Private/Admin
router.get('/stats/revenue', getRevenueStatsHandler);

// @route   GET /api/admin/stats/contacts
// @desc    Get contact statistics
// @access  Private/Admin
router.get('/stats/contacts', getContactStatsHandler);

// @route   GET /api/admin/stats/newsletter
// @desc    Get newsletter statistics
// @access  Private/Admin
router.get('/stats/newsletter', getNewsletterStatsHandler);

// @route   GET /api/admin/top-trips
// @desc    Get top rated trips
// @access  Private/Admin
router.get('/top-trips', getTopTripsHandler);

// @route   GET /api/admin/recent-bookings
// @desc    Get recent bookings
// @access  Private/Admin
router.get('/recent-bookings', getRecentBookingsHandler);

// @route   GET /api/admin/recent-contacts
// @desc    Get recent contacts
// @access  Private/Admin
router.get('/recent-contacts', getRecentContactsHandler);

export default router;
