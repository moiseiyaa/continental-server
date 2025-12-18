import User from '../models/user.model';
import Trip from '../models/trip.model';
import Booking from '../models/booking.model';
import Review from '../models/review.model';
import Contact from '../models/contact.model';
import Newsletter from '../models/newsletter.model';

export const getDashboardStats = async (): Promise<any> => {
  const [
    totalUsers,
    activeUsers,
    totalTrips,
    activeTrips,
    totalBookings,
    confirmedBookings,
    totalReviews,
    totalContacts,
    totalSubscribers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'active' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Review.countDocuments(),
    Contact.countDocuments(),
    Newsletter.countDocuments({ isActive: true }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
    },
    trips: {
      total: totalTrips,
      active: activeTrips,
      inactive: totalTrips - activeTrips,
    },
    bookings: {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: totalBookings - confirmedBookings,
    },
    reviews: {
      total: totalReviews,
    },
    contacts: {
      total: totalContacts,
    },
    newsletter: {
      total: totalSubscribers,
    },
  };
};

export const getUserStats = async (period: string = 'all'): Promise<any> => {
  const dateFilter = getDateFilter(period);
  
  const [totalUsers, newUsers, activeUsers] = await Promise.all([
    User.countDocuments(dateFilter ? { createdAt: dateFilter } : {}),
    User.countDocuments(dateFilter ? { createdAt: dateFilter } : {}),
    User.countDocuments({ 
      ...dateFilter, 
      isActive: true 
    }),
  ]);

  const userGrowth = await User.aggregate([
    {
      $match: dateFilter ? { createdAt: dateFilter } : {},
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return {
    total: totalUsers,
    new: newUsers,
    active: activeUsers,
    growth: userGrowth,
  };
};

export const getBookingStats = async (period: string = 'all'): Promise<any> => {
  const dateFilter = getDateFilter(period);
  
  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    completedBookings,
  ] = await Promise.all([
    Booking.countDocuments(dateFilter ? { createdAt: dateFilter } : {}),
    Booking.countDocuments({ 
      ...dateFilter, 
      status: 'confirmed' 
    }),
    Booking.countDocuments({ 
      ...dateFilter, 
      status: 'pending' 
    }),
    Booking.countDocuments({ 
      ...dateFilter, 
      status: 'cancelled' 
    }),
    Booking.countDocuments({ 
      ...dateFilter, 
      status: 'completed' 
    }),
  ]);

  const revenueData = await Booking.aggregate([
    {
      $match: { 
        ...dateFilter,
        status: 'confirmed',
      },
    },
    {
      $lookup: {
        from: 'trips',
        localField: 'trip',
        foreignField: '_id',
        as: 'tripInfo',
      },
    },
    { $unwind: '$tripInfo' },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$tripInfo.price' },
        averageBookingValue: { $avg: '$tripInfo.price' },
      },
    },
  ]);

  const bookingTrends = await Booking.aggregate([
    {
      $match: dateFilter ? { createdAt: dateFilter } : {},
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return {
    total: totalBookings,
    confirmed: confirmedBookings,
    pending: pendingBookings,
    cancelled: cancelledBookings,
    completed: completedBookings,
    revenue: revenueData[0] || { totalRevenue: 0, averageBookingValue: 0 },
    trends: bookingTrends,
  };
};

export const getTripStats = async (period: string = 'all'): Promise<any> => {
  const dateFilter = getDateFilter(period);
  
  const [
    totalTrips,
    activeTrips,
    popularTrips,
  ] = await Promise.all([
    Trip.countDocuments(dateFilter ? { createdAt: dateFilter } : {}),
    Trip.countDocuments({ 
      ...dateFilter, 
      status: 'active' 
    }),
    Trip.find(dateFilter ? { createdAt: dateFilter } : {})
      .sort({ rating: -1, reviews: -1 })
      .limit(5)
      .select('title destination rating reviews price'),
  ]);

  const tripsByDestination = await Trip.aggregate([
    {
      $match: dateFilter ? { createdAt: dateFilter } : {},
    },
    {
      $group: {
        _id: '$destination',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    total: totalTrips,
    active: activeTrips,
    popular: popularTrips,
    byDestination: tripsByDestination,
  };
};

export const getRevenueReports = async (period: string = 'all'): Promise<any> => {
  const dateFilter = getDateFilter(period);
  
  const revenueData = await Booking.aggregate([
    {
      $match: { 
        ...dateFilter,
        status: 'confirmed',
      },
    },
    {
      $lookup: {
        from: 'trips',
        localField: 'trip',
        foreignField: '_id',
        as: 'tripInfo',
      },
    },
    { $unwind: '$tripInfo' },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$tripInfo.price' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const topRevenueTrips = await Booking.aggregate([
    {
      $match: { 
        ...dateFilter,
        status: 'confirmed',
      },
    },
    {
      $lookup: {
        from: 'trips',
        localField: 'trip',
        foreignField: '_id',
        as: 'tripInfo',
      },
    },
    { $unwind: '$tripInfo' },
    {
      $group: {
        _id: '$tripInfo._id',
        title: { $first: '$tripInfo.title' },
        destination: { $first: '$tripInfo.destination' },
        revenue: { $sum: '$tripInfo.price' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  return {
    monthlyRevenue: revenueData,
    topRevenueTrips,
    totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
    totalBookings: revenueData.reduce((sum, item) => sum + item.bookings, 0),
  };
};

const getDateFilter = (period: string): any => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    default:
      return null;
  }

  return { $gte: startDate };
};
