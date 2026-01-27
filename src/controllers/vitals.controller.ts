import { Request, Response } from 'express'
import Vitals from '../models/vitals.model'

export async function postVitals(req: Request, res: Response) {
  try {
    const { lcp, fid, cls, date } = req.body
    await Vitals.insert({ lcp, fid, cls, date: date ? new Date(date) : undefined })
    res.json({ message: 'stored' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to store vitals' })
  }
}

export async function getVitals(req: Request, res: Response) {
  try {
    const days = parseInt(req.query.days as string) || 30
    const vitals = await Vitals.getLastNDays(days)
    res.json({ vitals })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vitals' })
  }
}
