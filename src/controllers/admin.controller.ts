import { Request, Response, NextFunction } from 'express';
import {
  getDashboardStats,
  getUserStats,
  getBookingStats,
  getTripStats,
  getRevenueReports,
} from '../services/admin.service';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/stats/users
// @access  Private/Admin
export const getUserStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.query.period as string || 'all';
    const stats = await getUserStats(period);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/admin/stats/bookings
// @access  Private/Admin
export const getBookingStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.query.period as string || 'all';
    const stats = await getBookingStats(period);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get trip statistics
// @route   GET /api/admin/stats/trips
// @access  Private/Admin
export const getTripStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.query.period as string || 'all';
    const stats = await getTripStats(period);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get revenue reports
// @route   GET /api/admin/revenue
// @access  Private/Admin
export const getRevenueReportsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.query.period as string || 'all';
    const reports = await getRevenueReports(period);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get overall system health
// @route   GET /api/admin/health
// @access  Private/Admin
export const getSystemHealthHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const uptime = process.uptime();
    
    const health = {
      status: 'healthy',
      timestamp: now,
      uptime: {
        seconds: uptime,
        human: formatUptime(uptime),
      },
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
    };

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error: any) {
    next(error);
  }
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
};
