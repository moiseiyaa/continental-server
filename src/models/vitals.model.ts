import { pool } from '../config/db'

export interface VitalsRow {
  id: number
  date: Date
  lcp: number | null
  fid: number | null
  cls: number | null
}

export interface VitalsInput {
  lcp?: number
  fid?: number
  cls?: number
  date?: Date
}

export default class Vitals {
  id?: number
  date!: Date
  lcp?: number | null
  fid?: number | null
  cls?: number | null

  constructor(row: Partial<VitalsRow>) {
    Object.assign(this, row)
  }

  static async insert(data: VitalsInput): Promise<Vitals> {
    const { lcp, fid, cls, date } = data
    const { rows } = await pool.query(
      'INSERT INTO vitals(date,lcp,fid,cls) VALUES($1,$2,$3,$4) RETURNING *',
      [date || new Date(), lcp ?? null, fid ?? null, cls ?? null]
    )
    return new Vitals(rows[0])
  }

  static async getLastNDays(days = 30): Promise<Vitals[]> {
    const { rows } = await pool.query(
      'SELECT date::date as date, AVG(lcp) as lcp, AVG(fid) as fid, AVG(cls) as cls FROM vitals WHERE date >= NOW() - INTERVAL $1 DAY GROUP BY date::date ORDER BY date',
      [days]
    )
    return rows.map(r=>new Vitals(r))
  }
}
