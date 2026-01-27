import { Router } from 'express'
import { postVitals, getVitals } from '../controllers/vitals.controller'

const router = Router()

router.get('/', getVitals)
router.post('/', postVitals)

export default router
