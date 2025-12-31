import { pool } from '../config/db';
import { INewsletter, INewsletterInput } from '../interfaces/newsletter.interface';
import { sendEmail } from './email.service';

export const subscribe = async (data: INewsletterInput): Promise<INewsletter> => {
  const { email, name } = data;
  const { rows } = await pool.query(
    `INSERT INTO newsletter (email, name, is_active, created_at, updated_at) VALUES ($1, $2, true, NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET is_active = true, updated_at = NOW(), unsubscribed_at = NULL RETURNING *`,
    [email.toLowerCase(), name || null]
  );
  return rows[0] as INewsletter;
};

export const unsubscribe = async (email: string): Promise<INewsletter | null> => {
  const { rows } = await pool.query(
    `UPDATE newsletter SET is_active = false, unsubscribed_at = NOW(), updated_at = NOW() WHERE email = $1 RETURNING *`,
    [email.toLowerCase()]
  );
  return rows.length ? (rows[0] as INewsletter) : null;
};

export const getSubscriber = async (email: string): Promise<INewsletter | null> => {
  const { rows } = await pool.query('SELECT * FROM newsletter WHERE email = $1', [email.toLowerCase()]);
  return rows.length ? (rows[0] as INewsletter) : null;
};

export const getAllSubscribers = async (page = 1, limit = 20, activeOnly = false): Promise<{ subscribers: INewsletter[], total: number, pages: number }> => {
  const offset = (page - 1) * limit;
  const whereClause = activeOnly ? 'WHERE is_active = true' : '';
  const { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER() as total_count FROM newsletter ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  const subscribers = rows.map(({ total_count, ...n }) => n as INewsletter);
  return { subscribers, total, pages: Math.ceil(total / limit) };
};

export const subscribeToNewsletter = async (data: INewsletterInput): Promise<INewsletter> => {
  return subscribe(data);
};

export const unsubscribeFromNewsletter = async (email: string): Promise<INewsletter | null> => {
  return unsubscribe(email);
};

export const getNewsletterSubscriber = async (email: string): Promise<INewsletter | null> => {
  return getSubscriber(email);
};

export const deleteSubscriber = async (email: string): Promise<INewsletter | null> => {
  const subscriber = await getSubscriber(email);
  if (!subscriber) return null;
  
  await pool.query('DELETE FROM newsletter WHERE email = $1', [email.toLowerCase()]);
  return subscriber;
};

export const getNewsletterStats = async (): Promise<any> => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) as total, COUNT(CASE WHEN is_active = true THEN 1 END) as active, COUNT(CASE WHEN is_active = false THEN 1 END) as inactive FROM newsletter`
  );
  return {
    total: Number(rows[0].total),
    active: Number(rows[0].active),
    inactive: Number(rows[0].inactive)
  };
};

export const sendNewsletterEmail = async (subject: string, message: string): Promise<any> => {
  const { rows } = await pool.query('SELECT email FROM newsletter WHERE is_active = true');
  const emails = rows.map((row: any) => row.email);
  
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email, subject, message))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  return {
    total: emails.length,
    successful,
    failed,
    message: `Newsletter sent to ${successful} out of ${emails.length} subscribers`
  };
};
