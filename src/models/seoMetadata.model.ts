import { pool } from '../config/db'

export interface SeoMetadataRow {
  id: number
  page_url: string
  title: string | null
  description: string | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  keywords: string[] | null
  include_in_sitemap: boolean
  schema_ld: any | null
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
  includeInSitemap?: boolean
  schemaLd?: any
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
  keywords?: string[] | null
  noindex: boolean = false
  includeInSitemap: boolean = true
  schemaLd?: any

  constructor(row: Partial<SeoMetadataRow>) {
    Object.assign(this, {
      id: row.id,
      path: row.page_url,
      title: row.title,
      description: row.description,
      canonical: row.canonical_url,
      ogTitle: row.og_title,
      ogDescription: row.og_description,
      ogImage: row.og_image,
      keywords: row.keywords,
      noindex: false, // Default since no noindex column exists
      includeInSitemap: row.include_in_sitemap ?? true,
      schemaLd: row.schema_ld,
    })
  }

  static async findByPath(path: string): Promise<SeoMetadata | null> {
    const { rows } = await pool.query('SELECT * FROM seo_metadata WHERE page_url = $1 LIMIT 1', [path])
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
      includeInSitemap = true,
      schemaLd,
    } = data

    const query = `INSERT INTO seo_metadata (page_url, title, description, canonical_url, og_title, og_description, og_image, include_in_sitemap, schema_ld)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (page_url)
      DO UPDATE SET title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    canonical_url = EXCLUDED.canonical_url,
                    og_title = EXCLUDED.og_title,
                    og_description = EXCLUDED.og_description,
                    og_image = EXCLUDED.og_image,
                    include_in_sitemap = EXCLUDED.include_in_sitemap,
                    schema_ld = EXCLUDED.schema_ld,
                    updated_at = NOW()
      RETURNING *`;

    const values = [path, title, description, canonical, ogTitle, ogDescription, ogImage, includeInSitemap, schemaLd]

    const { rows } = await pool.query(query, values)
    return new SeoMetadata(rows[0] as SeoMetadataRow)
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM seo_metadata WHERE id = $1', [id])
  }
}
