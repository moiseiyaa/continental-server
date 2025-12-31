import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/db';
import { JWT_SECRET, JWT_EXPIRE } from '../config/env';

interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  reset_password_token?: string;
  reset_password_expire?: Date;
  email_verified: boolean;
  email_verification_token?: string;
  email_verification_expire?: Date;
  refresh_token_hash?: string;
  refresh_token_expire?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export default class User {
  id?: number;
  name!: string;
  email!: string;
  password!: string;
  role!: string;
  emailVerified!: boolean;
  refreshTokenHash?: string;
  refreshTokenExpire?: Date;

  constructor(row?: Partial<UserRow>) {
    if (row) {
      this.id = row.id;
      this.name = row.name || '';
      this.email = row.email || '';
      this.password = row.password || '';
      this.role = row.role || 'user';
      this.emailVerified = row.email_verified || false;
      this.refreshTokenHash = row.refresh_token_hash;
      this.refreshTokenExpire = row.refresh_token_expire;
      // Store snake_case fields for save method
      (this as any).reset_password_token = row.reset_password_token;
      (this as any).reset_password_expire = row.reset_password_expire;
      (this as any).email_verification_token = row.email_verification_token;
      (this as any).email_verification_expire = row.email_verification_expire;
    }
  }

  // ---------- Static helpers (simulate Mongoose static methods) ----------
  static async findOne(filter: { email?: string }): Promise<User | null> {
    if (!filter.email) return null;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [filter.email]);
    return rows.length ? new User(rows[0] as UserRow) : null;
  }

  static async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return rows.length ? new User(rows[0] as UserRow) : null;
  }

  static async create(data: Partial<UserRow>): Promise<User> {
    const { name, email, password, role = 'user' } = data;
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password, role, email_verified) VALUES ($1,$2,$3,$4,false) RETURNING *',
      [name, email, password, role]
    );
    return new User(rows[0] as UserRow);
  }

  // ---------- Instance helpers (simulate schema methods) ----------
  get _id() {
    return this.id?.toString();
  }

  getSignedJwtToken(): string {
    return jwt.sign({ id: this.id?.toString() }, JWT_SECRET as string, { expiresIn: JWT_EXPIRE } as any);
  }

  async matchPassword(entered: string): Promise<boolean> {
    return bcrypt.compare(entered, this.password);
  }

  getResetPasswordToken(): string {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.updateFields({ reset_password_token: crypto.createHash('sha256').update(resetToken).digest('hex'), reset_password_expire: new Date(Date.now() + 10*60*1000) });
    return resetToken;
  }

  async save(): Promise<void> {
    if (!this.id) return;
    await pool.query(
      'UPDATE users SET name=$1, email=$2, password=$3, role=$4, email_verified=$5, refresh_token_hash=$6, refresh_token_expire=$7, reset_password_token=$8, reset_password_expire=$9, updated_at=NOW() WHERE id=$10',
      [
        this.name,
        this.email,
        this.password,
        this.role,
        this.emailVerified,
        this.refreshTokenHash,
        this.refreshTokenExpire,
        (this as any).reset_password_token,
        (this as any).reset_password_expire,
        this.id,
      ]
    );
  }

  private updateFields(fields: Record<string, any>) {
    Object.assign(this, fields);
  }
}
