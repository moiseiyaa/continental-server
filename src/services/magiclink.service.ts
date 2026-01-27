import crypto from 'crypto';
import { pool } from '../config/db';
import { MagicLinkToken } from '../interfaces/magiclink.interface';

const ensureMagicLinksTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS magic_links (
        token VARCHAR(128) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.log('Magic links table check:', (err as Error).message);
  }
};

export const createMagicLink = async (userId: number, ttlHours = 24): Promise<MagicLinkToken> => {
  await ensureMagicLinksTable();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO magic_links (token, user_id, expires_at, used) VALUES ($1, $2, $3, $4)`,
    [token, userId, expiresAt, false]
  );
  return { token, userId: String(userId), expiresAt, used: false };
};

export const findMagicLink = async (token: string) => {
  await ensureMagicLinksTable();
  const { rows } = await pool.query('SELECT * FROM magic_links WHERE token = $1 LIMIT 1', [token]);
  return rows.length ? rows[0] : null;
};

export const markMagicLinkUsed = async (token: string) => {
  await pool.query('UPDATE magic_links SET used = true WHERE token = $1', [token]);
};
