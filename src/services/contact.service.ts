import { pool } from '../config/db';
import { IContact, IContactInput, IContactResponse } from '../interfaces/contact.interface';

export const createContact = async (data: IContactInput): Promise<IContact> => {
  const { name, email, phone, subject, message } = data;
  const { rows } = await pool.query(
    `INSERT INTO contacts (name, email, phone, subject, message, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'new', NOW(), NOW()) RETURNING *`,
    [name, email, phone || null, subject, message]
  );
  return rows[0] as IContact;
};

export const getContactById = async (id: string): Promise<IContact | null> => {
  const { rows } = await pool.query(
    `SELECT c.*, u.name as responded_by_name
     FROM contacts c
     LEFT JOIN users u ON c.responded_by = u.id
     WHERE c.id = $1`,
    [id]
  );
  return rows.length ? (rows[0] as IContact) : null;
};

export const getAllContacts = async (page=1, limit=10, filters: any = {}): Promise<{contacts: IContact[], total: number, pages: number}> => {
  const offset = (page - 1) * limit;
  let whereClause = '';
  const params: any[] = [];
  if (filters.status) {
    params.push(filters.status);
    whereClause = `WHERE c.status = $${params.length}`;
  }
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(*) OVER() as total_count
     FROM contacts c
     ${whereClause}
     ORDER BY c.created_at DESC
     LIMIT $${params.length+1} OFFSET $${params.length+2}`,
    [...params, limit, offset]
  );
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const contacts = rows.map(({ total_count, ...c }) => c as IContact);
  return {
    contacts,
    total,
    pages: Math.ceil(total / limit)
  };
};

export const updateContactStatus = async (
  id: string,
  status: 'new' | 'read' | 'responded' | 'closed',
  responseText?: string,
  respondedBy?: number
): Promise<IContact | null> => {
  const updates: string[] = ["status = $1", "updated_at = NOW()"];
  const values: any[] = [status];
  let count = 2;
  if (responseText) {
    updates.push(`response = $${count}`);
    values.push(responseText);
    count++;
    updates.push(`responded_at = NOW()`);
  }
  if (respondedBy) {
    updates.push(`responded_by = $${count}`);
    values.push(respondedBy);
    count++;
  }
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${count} RETURNING *`,
    values
  );
  return rows.length ? (rows[0] as IContact) : null;
};
