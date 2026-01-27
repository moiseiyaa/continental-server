import { pool } from '../config/db'

export interface SeoMetadataRow {
  id: number
  path: string
  title_tag: string | null
  meta_description: string | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  noindex: boolean
  created_at: Date
  updated_at: Date
}

export interface SeoMetadataInput {
  path: string
  title?: string
  description?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  noindex?: boolean
}

export default class SeoMetadata {
  id?: number
  path!: string
  title?: string | null
  description?: string | null
  canonical?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  noindex: boolean = false

  constructor(row: Partial<SeoMetadataRow>) {
    Object.assign(this, {
      id: row.id,
      path: row.path,
      title: row.title_tag,
      description: row.meta_description,
      canonical: row.canonical_url,
      ogTitle: row.og_title,
      ogDescription: row.og_description,
      ogImage: row.og_image,
      noindex: row.noindex ?? false,
    })
  }

  static async findByPath(path: string): Promise<SeoMetadata | null> {
    const { rows } = await pool.query('SELECT * FROM seo_metadata WHERE path = $1 LIMIT 1', [path])
    return rows.length ? new SeoMetadata(rows[0] as SeoMetadataRow) : null
  }

  static async findById(id: string): Promise<SeoMetadata | null> {
    const { rows } = await pool.query('SELECT * FROM seo_metadata WHERE id = $1 LIMIT 1', [id])
    return rows.length ? new SeoMetadata(rows[0] as SeoMetadataRow) : null
  }

  static async findAll(): Promise<SeoMetadata[]> {
    const { rows } = await pool.query('SELECT * FROM seo_metadata ORDER BY updated_at DESC')
    return rows.map(r => new SeoMetadata(r as SeoMetadataRow))
  }

  static async upsert(data: SeoMetadataInput): Promise<SeoMetadata> {
    const {
      path,
      title,
      description,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      noindex = false,
    } = data

    const query = `INSERT INTO seo_metadata (path, title_tag, meta_description, canonical_url, og_title, og_description, og_image, noindex)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (path)
      DO UPDATE SET title_tag = EXCLUDED.title_tag,
                    meta_description = EXCLUDED.meta_description,
                    canonical_url = EXCLUDED.canonical_url,
                    og_title = EXCLUDED.og_title,
                    og_description = EXCLUDED.og_description,
                    og_image = EXCLUDED.og_image,
                    noindex = EXCLUDED.noindex,
                    updated_at = NOW()
      RETURNING *`;

    const values = [path, title, description, canonical, ogTitle, ogDescription, ogImage, noindex]

    const { rows } = await pool.query(query, values)
    return new SeoMetadata(rows[0] as SeoMetadataRow)
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM seo_metadata WHERE id = $1', [id])
  }
}
