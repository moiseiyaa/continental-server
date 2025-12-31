import { pool } from '../config/db';
import { INewsletter, INewsletterInput } from '../interfaces/newsletter.interface';

export const subscribe = async (data: INewsletterInput): Promise<INewsletter> => {
  const { email, name } = data;
  const { rows } = await pool.query(
    `INSERT INTO newsletter (email, name, is_active, created_at, updated_at)
     VALUES ($1, $2, true, NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET is_active = true, updated_at = NOW(), unsubscribed_at = NULL
     RETURNING *`,
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

export const getAllSubscribers = async (page = 1, limit = 20): Promise<{ subscribers: INewsletter[], total: number, pages: number }> => {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER() as total_count FROM newsletter ORDER BY created_at DESC LIMIT $1 OFFSET $2`, 
    [limit, offset]
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  const subscribers = rows.map(({ total_count, ...n }) => n as INewsletter);
  return { subscribers, total, pages: Math.ceil(total / limit) };
};
