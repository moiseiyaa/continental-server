import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'

const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')

export async function getRobots(req: Request, res: Response) {
  try {
    const text = await fs.readFile(robotsPath, 'utf8').catch(()=>'User-agent: *\nDisallow:')
    res.json({ text })
  } catch (err) {
    res.status(500).json({ message: 'Failed to read robots.txt' })
  }
}

export async function putRobots(req: Request, res: Response) {
  try {
    const text = typeof req.body === 'string' ? req.body : req.body.text
    if (typeof text !== 'string') return res.status(400).json({ message: 'Expected raw text body' })
    await fs.mkdir(path.dirname(robotsPath), { recursive: true })
    await fs.writeFile(robotsPath, text, 'utf8')
    res.json({ message: 'Saved' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save robots.txt' })
  }
}
