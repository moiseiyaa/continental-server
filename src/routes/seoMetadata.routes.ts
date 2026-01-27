import { Router } from 'express'
import {
  getAllMetadata,
  getMetadataByPath,
  createOrUpdateMetadata,
  deleteMetadata,
} from '../controllers/seoMetadata.controller'

const router = Router()

router.get('/', getAllMetadata)
router.get('/by-path', getMetadataByPath) // /api/seo-metadata/by-path?path=/about
router.post('/', createOrUpdateMetadata)
router.patch('/:id', createOrUpdateMetadata)
router.delete('/:id', deleteMetadata)

export default router
