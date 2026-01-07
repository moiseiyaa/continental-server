import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

export const upgradeUserHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Hash and save password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Account upgraded successfully' });
  } catch (err) {
    next(err);
  }
};
