import { Request, Response, NextFunction } from 'express';

// @desc    Get payments (stub)
// @route   GET /api/payments
// @access  Private
export const getPaymentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement payments logic
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};