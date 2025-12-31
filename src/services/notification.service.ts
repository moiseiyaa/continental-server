import { pool } from '../config/db';
import { INotification } from '../interfaces/notification.interface';

export const createNotification = async (userId: number, notification: Omit<INotification, 'id' | 'read' | 'created_at'>): Promise<INotification> => {
  const { type, title, message, link } = notification;
  const { rows } = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, link, read, created_at) VALUES ($1, $2, $3, $4, $5, false, NOW()) RETURNING *`,
    [userId, type, title, message, link || null]
  );
  return rows[0] as INotification;
};

export const getNotifications = async (userId: number, page = 1, limit = 15): Promise<{notifications: INotification[], total: number, pages: number}> => {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER() as total_count FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  const notifications = rows.map(({ total_count, ...n }) => n as INotification);
  return { notifications, total, pages: Math.ceil(total/limit) };
};

export const markAsRead = async (id: number): Promise<INotification | null> => {
  const { rows } = await pool.query('UPDATE notifications SET read = true WHERE id = $1 RETURNING *', [id]);
  return rows.length ? (rows[0] as INotification) : null;
};

export const markAllAsRead = async (userId: number): Promise<number> => {
  const { rowCount } = await pool.query('UPDATE notifications SET read = true WHERE user_id = $1', [userId]);
  return rowCount || 0;
};

export const deleteNotification = async (id: number): Promise<INotification | null> => {
  const { rows } = await pool.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);
  return rows.length ? (rows[0] as INotification) : null;
};

export const getUserUnreadNotifications = async (userId: number): Promise<INotification[]> => {
  const { rows } = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 AND read = false ORDER BY created_at DESC',
    [userId]
  );
  return rows as INotification[];
};

export const getUserNotifications = async (userId: number, page = 1, limit = 15): Promise<{notifications: INotification[], total: number, pages: number}> => {
  return getNotifications(userId, page, limit);
};

export const markNotificationAsRead = async (id: number): Promise<INotification | null> => {
  return markAsRead(id);
};

export const markAllNotificationsAsRead = async (userId: number): Promise<number> => {
  const result = await markAllAsRead(userId);
  return result || 0;
};

export const notifyBookingConfirmation = async (userId: number, tripTitle: string, bookingId: number): Promise<void> => {
  await createNotification(userId, {
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: `Your booking for ${tripTitle} has been confirmed.`,
    link: `/bookings/${bookingId}`
  });
};

export const notifyBookingCancellation = async (userId: number, tripTitle: string): Promise<void> => {
  await createNotification(userId, {
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `Your booking for ${tripTitle} has been cancelled.`,
    link: null
  });
};
