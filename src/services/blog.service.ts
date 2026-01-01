// Blog service – PostgreSQL implementation
import { pool } from '../config/db';
import { IBlogInput } from '../interfaces/blog.interface';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[] | null;
  featured_image: string | null;
  published: boolean;
  published_at: Date | null;
  views: number;
  created_at: Date;
  updated_at: Date;
}

// Helper to map PostgreSQL row to API object
const mapBlog = (row: BlogRow): Blog => ({
  _id: row.id.toString(),
  title: row.title,
  slug: row.slug,
  content: row.content,
  excerpt: row.excerpt,
  author: row.author,
  category: row.category,
  tags: row.tags || [],
  featuredImage: row.featured_image || undefined,
  published: row.published,
  publishedAt: row.published_at || undefined,
  views: row.views,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Get all published blogs with pagination
export const getAllBlogs = async (
  page = 1,
  limit = 10,
  filters: any = {}
): Promise<{ blogs: Blog[]; total: number; pages: number }> => {
  const offset = (page - 1) * limit;

  // Build dynamic WHERE clause
  const clauses: string[] = ["published = true"];
  const params: any[] = [];

  if (filters.category) {
    params.push(filters.category);
    clauses.push(`category = $${params.length}`);
  }
  if (filters.author) {
    params.push(`%${filters.author}%`);
    clauses.push(`author ILIKE $${params.length}`);
  }
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    const paramNum = params.length - 2;
    clauses.push(`(title ILIKE $${paramNum} OR content ILIKE $${paramNum + 1} OR excerpt ILIKE $${paramNum + 2})`);
  }

  const whereSQL = clauses.length > 1 ? `WHERE ${clauses.join(' AND ')}` : '';

  // Use single query with window function for better performance
  const queryText = `
    SELECT 
      *,
      COUNT(*) OVER() as total_count
    FROM blogs 
    ${whereSQL} 
    ORDER BY published_at DESC, created_at DESC
    LIMIT $${params.length + 1} 
    OFFSET $${params.length + 2}
  `;

  const queryParams = [...params, limit, offset];
  const { rows } = await pool.query(queryText, queryParams);

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const blogs = rows.map((row: any) => {
    const { total_count, ...blogData } = row;
    return mapBlog(blogData as BlogRow);
  });

  return {
    blogs,
    total,
    pages: Math.ceil(total / limit),
  };
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<Blog | null> => {
  const { rows } = await pool.query('SELECT * FROM blogs WHERE id = $1 AND published = true', [id]);
  return rows.length ? mapBlog(rows[0] as BlogRow) : null;
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const { rows } = await pool.query('SELECT * FROM blogs WHERE slug = $1 AND published = true', [slug]);
  if (rows.length) {
    // Increment views
    await pool.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [rows[0].id]);
    return mapBlog(rows[0] as BlogRow);
  }
  return null;
};

// Create a new blog
export const createBlog = async (blogData: IBlogInput, userId: string): Promise<Blog> => {
  const {
    title,
    slug,
    content,
    excerpt,
    author,
    category,
    tags = [],
    featuredImage,
    published = false,
    publishedAt,
  } = blogData;

  // Generate slug from title if not provided
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const queryText = `
    INSERT INTO blogs (
      title, slug, content, excerpt, author, category, tags, featured_image, published, published_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING *
  `;

  const values = [
    title,
    finalSlug,
    content,
    excerpt,
    author,
    category,
    tags,
    featuredImage || null,
    published,
    publishedAt || (published ? new Date() : null),
  ];

  const { rows } = await pool.query(queryText, values);
  return mapBlog(rows[0] as BlogRow);
};

// Update blog
export const updateBlog = async (blogId: string, blogData: Partial<IBlogInput>): Promise<Blog | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const allowedFields = [
    'title', 'slug', 'content', 'excerpt', 'author', 'category', 'tags',
    'featuredImage', 'published', 'publishedAt'
  ];

  for (const [key, value] of Object.entries(blogData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      const dbKey = key === 'featuredImage' ? 'featured_image' :
                   key === 'publishedAt' ? 'published_at' : key;
      updates.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (updates.length === 0) {
    return getBlogById(blogId);
  }

  values.push(blogId);
  const queryText = `
    UPDATE blogs 
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const { rows } = await pool.query(queryText, values);
  return rows.length ? mapBlog(rows[0] as BlogRow) : null;
};

// Delete blog (soft delete by setting published to false)
export const deleteBlog = async (blogId: string): Promise<Blog | null> => {
  const { rows } = await pool.query(
    `UPDATE blogs SET published = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [blogId]
  );
  return rows.length ? mapBlog(rows[0] as BlogRow) : null;
};

