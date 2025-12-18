import { Router } from 'express';
import {
  getUnreadNotifications,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotificationHandler,
} from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(protect);

// @route   GET /api/notifications/unread
// @desc    Get unread notifications for current user
// @access  Private
router.get('/unread', getUnreadNotifications);

// @route   GET /api/notifications
// @desc    Get all notifications with pagination
// @access  Private
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', deleteNotificationHandler);

export default router;
