import { model, Schema } from 'mongoose';
import { ITrip } from '../interfaces/trip.interface';

const TripSchema = new Schema<ITrip>(
  {
    title: {
      type: String,
      required: [true, 'Please add a trip title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Please add duration in days'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please add max participants'],
      min: [1, 'Max participants must be at least 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    itinerary: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    included: {
      type: [String],
      default: [],
    },
    notIncluded: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'moderate',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
  },
  { timestamps: true }
);

export default model<ITrip>('Trip', TripSchema);
