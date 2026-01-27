import { pool } from '../config/db';
import { IGallery, IGalleryInput } from '../interfaces/gallery.interface';

// CREATE gallery image
export const createGallery = async (userId: number, data: IGalleryInput & { imageUrl: string; publicId: string; trip: number }): Promise<IGallery> => {
  const { trip, title, description, imageUrl, publicId } = data;
  const { rows } = await pool.query(
    `INSERT INTO gallery (trip_id, title, description, image_url, public_id, uploaded_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
    [trip, title, description || null, imageUrl, publicId, userId]
  );
  return rows[0] as IGallery;
};

// GET all gallery images for a trip
export const getGalleryByTrip = async (tripId: number): Promise<IGallery[]> => {
  const { rows } = await pool.query(
    `SELECT g.*, u.name as uploaded_by_name FROM gallery g
     JOIN users u ON g.uploaded_by = u.id WHERE g.trip_id = $1
     ORDER BY g.created_at DESC`,
    [tripId]
  );
  return rows as IGallery[];
};

// GET all gallery items (paginated)
export const getAllGallery = async (page=1, limit=20): Promise<{gallery: IGallery[], total: number, pages: number}> => {
  const offset = (page-1)*limit;
  const { rows } = await pool.query(
    `SELECT g.*, t.title as trip_title, u.name as uploaded_by_name, COUNT(*) OVER() as total_count FROM gallery g JOIN trips t ON g.trip_id = t.id JOIN users u ON g.uploaded_by = u.id ORDER BY g.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  const gallery = rows.map(({ total_count, ...g }) => g as IGallery);
  return { gallery, total, pages: Math.ceil(total/limit) };
};

// GET gallery image by ID
export const getImageById = async (id: number): Promise<IGallery | null> => {
  const { rows } = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
  return rows.length ? (rows[0] as IGallery) : null;
};

// DELETE image
export const deleteGalleryImage = async (id: number): Promise<IGallery | null> => {
  const { rows } = await pool.query('DELETE FROM gallery WHERE id=$1 RETURNING *', [id]);
  return rows.length ? (rows[0] as IGallery) : null;
};

// UPLOAD image (alias for createGallery)
export const uploadImage = async (file: any, data: IGalleryInput & { imageUrl: string; publicId: string; trip: number }, userId: number): Promise<IGallery> => {
  return createGallery(userId, data);
};

// UPDATE image
export const updateImage = async (id: string, data: Partial<IGalleryInput>): Promise<IGallery | null> => {
  const updates: string[] = ["updated_at = NOW()"];
  const values: any[] = [];
  let count = 1;
  
  if (data.title) {
    updates.push(`title = $${count}`);
    values.push(data.title);
    count++;
  }
  if (data.description) {
    updates.push(`description = $${count}`);
    values.push(data.description);
    count++;
  }
  
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE gallery SET ${updates.join(', ')} WHERE id = $${count} RETURNING *`,
    values
  );
  return rows.length ? (rows[0] as IGallery) : null;
};

// DELETE image (alias for deleteGalleryImage)
export const deleteImage = async (id: string): Promise<IGallery | null> => {
  return deleteGalleryImage(parseInt(id));
};
