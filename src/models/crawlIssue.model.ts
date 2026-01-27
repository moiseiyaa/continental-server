import { pool } from '../config/db'

export interface CrawlIssueRow {
  id: number
  path: string
  type: 'BROKEN_LINK' | 'MISSING_H1'
  detail: string
  created_at: Date
}

export default class CrawlIssue {
  id?: number
  path!: string
  type!: 'BROKEN_LINK' | 'MISSING_H1'
  detail!: string
  created_at!: Date

  constructor(row: Partial<CrawlIssueRow>) {
    Object.assign(this, row)
  }

  static async insert(path: string, type: 'BROKEN_LINK' | 'MISSING_H1', detail: string) {
    await pool.query('INSERT INTO crawl_issues(path,type,detail) VALUES($1,$2,$3)', [path, type, detail])
  }

  static async recent(limit=100) {
    const { rows } = await pool.query('SELECT * FROM crawl_issues ORDER BY created_at DESC LIMIT $1',[limit])
    return rows as CrawlIssueRow[]
  }
}
