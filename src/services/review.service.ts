import { pool } from '../config/db';
import { IReview, IReviewInput } from '../interfaces/review.interface';

// CREATE review
export const createReview = async (data: IReviewInput, userId: number): Promise<IReview> => {
  const { trip, rating, title, comment } = data;
  const { rows } = await pool.query(
    `INSERT INTO reviews (trip_id, user_id, rating, title, comment, helpful, verified, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, 0, false, NOW(), NOW()) RETURNING *`,
    [trip, userId, rating, title, comment]
  );
  return rows[0] as IReview;
};

// GET all reviews for a trip (with user info and pagination)
export const getReviewsByTrip = async (tripId: number, page = 1, limit = 10): Promise<{reviews: IReview[], total: number, pages: number, averageRating: number}> => {
  const offset = (page - 1) * limit;
  const { rows: reviewRows } = await pool.query(
    `SELECT r.*, u.name as user_name, u.email as user_email, COUNT(*) OVER() as total_count FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.trip_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [tripId, limit, offset]
  );
  
  const { rows: statsRows } = await pool.query(
    'SELECT AVG(rating)::float as avg_rating FROM reviews WHERE trip_id = $1',
    [tripId]
  );
  
  const total = reviewRows.length ? Number(reviewRows[0].total_count) : 0;
  const reviews = reviewRows.map(({ total_count, ...r }) => r as IReview);
  const averageRating = statsRows.length ? Number(statsRows[0].avg_rating || 0) : 0;
  
  return {
    reviews,
    total,
    pages: Math.ceil(total / limit),
    averageRating
  };
};

// GET review stats for trip (average rating & count)
export const getReviewStats = async (tripId: number): Promise<{ avg: number, count: number }> => {
  const { rows } = await pool.query(
    'SELECT AVG(rating)::float AS avg, COUNT(*) as count FROM reviews WHERE trip_id = $1',
    [tripId]
  );
  return {
    avg: Number(rows[0].avg || 0),
    count: Number(rows[0].count || 0)
  };
};

// GET all reviews by user
export const getUserReviews = async (userId: number): Promise<IReview[]> => {
  const { rows } = await pool.query(
    `SELECT r.*, t.title as trip_title, t.destination FROM reviews r
     JOIN trips t ON r.trip_id = t.id WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );
  return rows as IReview[];
};

// MARK review as helpful
export const markReviewHelpful = async (reviewId: number): Promise<IReview | null> => {
  const { rows } = await pool.query(
    'UPDATE reviews SET helpful = helpful + 1, updated_at = NOW() WHERE id = $1 RETURNING *',
    [reviewId]
  );
  return rows.length ? (rows[0] as IReview) : null;
};

// GET review by ID
export const getReviewById = async (id: number): Promise<IReview | null> => {
  const { rows } = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
  return rows.length ? (rows[0] as IReview) : null;
};

// ADMIN: Get all reviews paginated
export const getAllReviews = async (page=1, limit=10): Promise<{reviews: IReview[], total: number, pages: number}> => {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT r.*, t.title as trip_title, u.name as user_name, u.email as user_email, COUNT(*) OVER() as total_count FROM reviews r JOIN trips t ON r.trip_id = t.id JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const reviews = rows.map(({ total_count, ...r }) => r as IReview);
  return { reviews, total, pages: Math.ceil(total/limit) };
};

// UPDATE review
export const updateReview = async (id: number, data: Partial<IReviewInput>): Promise<IReview | null> => {
  const updates: string[] = ["updated_at = NOW()"];
  const values: any[] = [];
  let count = 1;
  
  if (data.rating) {
    updates.push(`rating = $${count}`);
    values.push(data.rating);
    count++;
  }
  if (data.title) {
    updates.push(`title = $${count}`);
    values.push(data.title);
    count++;
  }
  if (data.comment) {
    updates.push(`comment = $${count}`);
    values.push(data.comment);
    count++;
  }
  
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${count} RETURNING *`,
    values
  );
  return rows.length ? (rows[0] as IReview) : null;
};

// DELETE review
export const deleteReview = async (id: number): Promise<IReview | null> => {
  const review = await getReviewById(id);
  if (!review) return null;
  
  await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
  return review;
};

// Mark as helpful
export const markHelpful = async (id: number): Promise<IReview | null> => {
  return markReviewHelpful(id);
};
