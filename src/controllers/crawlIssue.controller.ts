import { Request, Response } from 'express'
import CrawlIssue from '../models/crawlIssue.model'
import scan from '../utils/crawlHealth'

export async function getIssues(req: Request, res: Response) {
  try {
    const issues = await CrawlIssue.recent(200)
    res.json({ issues })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issues' })
  }
}

export async function runCrawlNow(_req: Request, res: Response) {
  try {
    await scan()
    res.json({ message: 'crawl started' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to start crawl' })
  }
}
