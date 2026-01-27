import { Request, Response } from 'express'
import SeoMetadata from '../models/seoMetadata.model'

export const getAllMetadata = async (_req: Request, res: Response) => {
  const list = await SeoMetadata.findAll()
  res.json({ success: true, data: list })
}

export const getMetadataByPath = async (req: Request, res: Response) => {
  const path = req.query.path as string | undefined
  if (!path) return res.status(400).json({ success: false, message: 'path query is required' })
  const doc = await SeoMetadata.findByPath(path)
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, data: doc })
}

export const createOrUpdateMetadata = async (req: Request, res: Response) => {
  const data = req.body
  if (!data?.path) return res.status(400).json({ success: false, message: 'path is required' })
  const saved = await SeoMetadata.upsert(data)
  res.json({ success: true, data: saved })
}

export const deleteMetadata = async (req: Request, res: Response) => {
  const { id } = req.params
  await SeoMetadata.delete(id)
  res.json({ success: true })
}
