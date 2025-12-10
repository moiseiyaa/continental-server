import { IReview, IReviewInput } from '../interfaces/review.interface';
import Review from '../models/review.model';
import Trip from '../models/trip.model';
import Booking from '../models/booking.model';

export const createReview = async (reviewData: IReviewInput, userId: string): Promise<IReview> => {
  // Check if user has booked this trip
  const booking = await Booking.findOne({
    user: userId,
    trip: reviewData.trip,
    status: 'completed',
  });

  if (!booking) {
    throw new Error('You can only review trips you have completed');
  }

  // Check if user already reviewed this trip
  const existingReview = await Review.findOne({
    trip: reviewData.trip,
    user: userId,
  });

  if (existingReview) {
    throw new Error('You have already reviewed this trip');
  }

  // Create review
  const review = await Review.create({
    ...reviewData,
    user: userId,
    verified: true,
  });

  // Update trip rating
  await updateTripRating(reviewData.trip);

  return review.populate('user trip');
};

export const getReviewsByTrip = async (
  tripId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: IReview[]; total: number; pages: number; averageRating: number }> => {
  const skip = (page - 1) * limit;
  const total = await Review.countDocuments({ trip: tripId });
  const reviews = await Review.find({ trip: tripId })
    .populate('user', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Calculate average rating
  const ratingData = await Review.aggregate([
    { $match: { trip: require('mongoose').Types.ObjectId(tripId) } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } },
  ]);

  const averageRating = ratingData.length > 0 ? ratingData[0].averageRating : 0;

  return {
    reviews,
    total,
    pages: Math.ceil(total / limit),
    averageRating: Math.round(averageRating * 10) / 10,
  };
};

export const getReviewById = async (reviewId: string): Promise<IReview | null> => {
  return await Review.findById(reviewId).populate('user trip');
};

export const updateReview = async (
  reviewId: string,
  updateData: Partial<IReviewInput>
): Promise<IReview | null> => {
  const review = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  }).populate('user trip');

  // Update trip rating if rating was changed
  if (updateData.rating && review) {
    await updateTripRating(review.trip.toString());
  }

  return review;
};

export const deleteReview = async (reviewId: string): Promise<IReview | null> => {
  const review = await Review.findByIdAndDelete(reviewId);

  if (review) {
    // Update trip rating
    await updateTripRating(review.trip.toString());
  }

  return review;
};

export const markHelpful = async (reviewId: string): Promise<IReview | null> => {
  return await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  ).populate('user trip');
};

export const getUserReviews = async (userId: string): Promise<IReview[]> => {
  return await Review.find({ user: userId })
    .populate('trip', 'title destination')
    .sort({ createdAt: -1 });
};

export const getAllReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: IReview[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const total = await Review.countDocuments();
  const reviews = await Review.find()
    .populate('user', 'name')
    .populate('trip', 'title destination')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    reviews,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getReviewStats = async (tripId: string): Promise<any> => {
  const stats = await Review.aggregate([
    { $match: { trip: require('mongoose').Types.ObjectId(tripId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const stat = stats[0];
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  stat.ratingDistribution.forEach((rating: number) => {
    ratingBreakdown[rating as keyof typeof ratingBreakdown]++;
  });

  return {
    averageRating: Math.round(stat.averageRating * 10) / 10,
    totalReviews: stat.totalReviews,
    ratingBreakdown,
  };
};

const updateTripRating = async (tripId: string): Promise<void> => {
  const stats = await getReviewStats(tripId);
  await Trip.findByIdAndUpdate(tripId, {
    rating: stats.averageRating,
    reviews: stats.totalReviews,
  });
};
