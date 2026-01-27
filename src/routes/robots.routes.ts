import { Router } from 'express'
import { getRobots, putRobots } from '../controllers/robots.controller'
import { protect, authorize } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', getRobots)
router.put('/', protect, authorize('admin'), putRobots)

export default router
