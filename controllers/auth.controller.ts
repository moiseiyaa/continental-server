import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { register, login, getMe } from '../services/auth.service';
import { IUserInput } from '../interfaces';
import { sendTokenResponse } from '../utils/apiResponse';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role }: IUserInput = req.body;
    const { user, token } = await register({ name, email, password, role });
    
    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    
    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
