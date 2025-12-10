import { model, Schema } from 'mongoose';
import { IReview } from '../interfaces/review.interface';

const ReviewSchema = new Schema<IReview>(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    } as any,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    title: {
      type: String,
      required: [true, 'Please add a review title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    helpful: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
ReviewSchema.index({ trip: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: 1 });

// Prevent duplicate reviews from same user for same trip
ReviewSchema.index({ trip: 1, user: 1 }, { unique: true });

export default model<IReview>('Review', ReviewSchema);
