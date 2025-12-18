import Notification, { INotification } from '../models/notification.model';
import { logInfo } from '../utils/logger';

export interface NotificationPayload {
  userId: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'trip_updated' | 'payment_received' | 'system';
  title: string;
  message: string;
  data?: any;
}

/**
 * Create a notification for a user
 */
export const createNotification = async (payload: NotificationPayload): Promise<INotification> => {
  try {
    const notification = await Notification.create({
      user: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      data: payload.data,
    });

    logInfo(`Notification created for user ${payload.userId}: ${payload.title}`);
    return notification;
  } catch (error: any) {
    logInfo(`Error creating notification: ${error.message}`);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 */
export const getUserUnreadNotifications = async (userId: string): Promise<INotification[]> => {
  return await Notification.find({ user: userId, read: false }).sort({ createdAt: -1 });
};

/**
 * Get all notifications for a user with pagination
 */
export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ notifications: INotification[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  
  const total = await Notification.countDocuments({ user: userId });
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    notifications,
    total,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<INotification | null> => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    {
      read: true,
      readAt: new Date(),
    },
    { new: true }
  );
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<any> => {
  return await Notification.updateMany(
    { user: userId, read: false },
    {
      read: true,
      readAt: new Date(),
    }
  );
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<INotification | null> => {
  return await Notification.findByIdAndDelete(notificationId);
};

/**
 * Delete all notifications for a user
 */
export const deleteUserNotifications = async (userId: string): Promise<any> => {
  return await Notification.deleteMany({ user: userId });
};

/**
 * Send booking confirmation notification
 */
export const notifyBookingConfirmation = async (userId: string, tripTitle: string, bookingId: string) => {
  return await createNotification({
    userId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: `Your booking for ${tripTitle} has been confirmed`,
    data: { bookingId, tripTitle },
  });
};

/**
 * Send booking cancellation notification
 */
export const notifyBookingCancellation = async (userId: string, tripTitle: string) => {
  return await createNotification({
    userId,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `Your booking for ${tripTitle} has been cancelled`,
    data: { tripTitle },
  });
};

/**
 * Send trip update notification
 */
export const notifyTripUpdate = async (userId: string, tripTitle: string, updateDetails: string) => {
  return await createNotification({
    userId,
    type: 'trip_updated',
    title: 'Trip Updated',
    message: `${tripTitle} has been updated: ${updateDetails}`,
    data: { tripTitle, updateDetails },
  });
};

/**
 * Send payment received notification
 */
export const notifyPaymentReceived = async (userId: string, amount: number, bookingId: string) => {
  return await createNotification({
    userId,
    type: 'payment_received',
    title: 'Payment Received',
    message: `Payment of $${amount} has been received for your booking`,
    data: { amount, bookingId },
  });
};
