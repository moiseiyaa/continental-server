import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { upgradeUserHandler } from '../controllers/user.upgrade.controller';

const router = Router();

// @route PATCH /api/users/upgrade
router.patch('/upgrade', protect, upgradeUserHandler);

export default router;
