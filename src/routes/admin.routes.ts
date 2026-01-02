import { Router } from 'express';
import {
  getDashboardStatsHandler,
  getUserStatsHandler,
  getBookingStatsHandler,
  getTripStatsHandler,
  getRevenueReportsHandler,
  getSystemHealthHandler,
} from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Apply authentication and authorization to all admin routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', getDashboardStatsHandler);

// @route   GET /api/admin/stats/users
// @desc    Get user statistics
// @access  Private/Admin
router.get('/stats/users', getUserStatsHandler);

// @route   GET /api/admin/stats/bookings
// @desc    Get booking statistics
// @access  Private/Admin
router.get('/stats/bookings', getBookingStatsHandler);

// @route   GET /api/admin/stats/trips
// @desc    Get trip statistics
// @access  Private/Admin
router.get('/stats/trips', getTripStatsHandler);

// @route   GET /api/admin/revenue
// @desc    Get revenue reports
// @access  Private/Admin
router.get('/revenue', getRevenueReportsHandler);

// @route   GET /api/admin/health
// @desc    Get system health
// @access  Private/Admin
router.get('/health', getSystemHealthHandler);

export default router;
