import User from '../models/user.model';
import Trip from '../models/trip.model';
import Booking from '../models/booking.model';
import Review from '../models/review.model';
import Contact from '../models/contact.model';
import Newsletter from '../models/newsletter.model';

export const getUserStats = async (): Promise<any> => {
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const regularUsers = await User.countDocuments({ role: 'user' });
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });

  const usersThisMonth = await User.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });

  return {
    totalUsers,
    adminUsers,
    regularUsers,
    activeUsers,
    inactiveUsers,
    usersThisMonth,
  };
};

export const getTripStats = async (): Promise<any> => {
  const totalTrips = await Trip.countDocuments();
  const activeTrips = await Trip.countDocuments({ status: 'active' });
  const inactiveTrips = await Trip.countDocuments({ status: 'inactive' });
  const cancelledTrips = await Trip.countDocuments({ status: 'cancelled' });

  const tripStats = await Trip.aggregate([
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: '$reviews' },
      },
    },
  ]);

  const stats = tripStats.length > 0 ? tripStats[0] : {};

  return {
    totalTrips,
    activeTrips,
    inactiveTrips,
    cancelledTrips,
    avgPrice: Math.round(stats.avgPrice || 0),
    minPrice: stats.minPrice || 0,
    maxPrice: stats.maxPrice || 0,
    avgRating: Math.round((stats.avgRating || 0) * 10) / 10,
    totalReviews: stats.totalReviews || 0,
  };
};

export const getBookingStats = async (): Promise<any> => {
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });

  const paymentStats = await Booking.countDocuments({ paymentStatus: 'paid' });
  const unpaidBookings = await Booking.countDocuments({ paymentStatus: 'pending' });

  const bookingsThisMonth = await Booking.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    paidBookings: paymentStats,
    unpaidBookings,
    bookingsThisMonth,
  };
};

export const getRevenueStats = async (): Promise<any> => {
  const paidBookings = await Booking.find({ paymentStatus: 'paid' }).populate('trip');

  let totalRevenue = 0;
  let bookingCount = 0;

  paidBookings.forEach((booking: any) => {
    if (booking.trip && booking.trip.price) {
      totalRevenue += booking.trip.price * (booking.numberOfParticipants || 1);
      bookingCount++;
    }
  });

  const avgRevenuePerBooking = bookingCount > 0 ? Math.round(totalRevenue / bookingCount) : 0;

  // Revenue this month
  const thisMonthBookings = await Booking.find({
    paymentStatus: 'paid',
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  }).populate('trip');

  let monthlyRevenue = 0;
  thisMonthBookings.forEach((booking: any) => {
    if (booking.trip && booking.trip.price) {
      monthlyRevenue += booking.trip.price * (booking.numberOfParticipants || 1);
    }
  });

  return {
    totalRevenue,
    bookingCount,
    avgRevenuePerBooking,
    monthlyRevenue,
  };
};

export const getContactStats = async (): Promise<any> => {
  const totalContacts = await Contact.countDocuments();
  const newContacts = await Contact.countDocuments({ status: 'new' });
  const readContacts = await Contact.countDocuments({ status: 'read' });
  const respondedContacts = await Contact.countDocuments({ status: 'responded' });
  const closedContacts = await Contact.countDocuments({ status: 'closed' });

  return {
    totalContacts,
    newContacts,
    readContacts,
    respondedContacts,
    closedContacts,
  };
};

export const getNewsletterStats = async (): Promise<any> => {
  const totalSubscribers = await Newsletter.countDocuments();
  const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
  const unsubscribed = await Newsletter.countDocuments({ isActive: false });

  return {
    totalSubscribers,
    activeSubscribers,
    unsubscribed,
    unsubscribeRate: totalSubscribers > 0 ? ((unsubscribed / totalSubscribers) * 100).toFixed(2) : 0,
  };
};

export const getDashboardOverview = async (): Promise<any> => {
  const [userStats, tripStats, bookingStats, revenueStats, contactStats, newsletterStats] =
    await Promise.all([
      getUserStats(),
      getTripStats(),
      getBookingStats(),
      getRevenueStats(),
      getContactStats(),
      getNewsletterStats(),
    ]);

  return {
    users: userStats,
    trips: tripStats,
    bookings: bookingStats,
    revenue: revenueStats,
    contacts: contactStats,
    newsletter: newsletterStats,
    timestamp: new Date(),
  };
};

export const getTopTrips = async (limit: number = 5): Promise<any[]> => {
  return await Trip.find()
    .sort({ rating: -1, reviews: -1 })
    .limit(limit)
    .select('title destination price rating reviews');
};

export const getRecentBookings = async (limit: number = 10): Promise<any[]> => {
  return await Booking.find()
    .populate('user', 'name email')
    .populate('trip', 'title destination price')
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getRecentContacts = async (limit: number = 10): Promise<any[]> => {
  return await Contact.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email subject status createdAt');
};
