import { model, Schema } from 'mongoose';
import { IBooking } from '../interfaces/booking.interface';

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    } as any,
    numberOfParticipants: {
      type: Number,
      required: [true, 'Please add number of participants'],
      min: [1, 'Number of participants must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please add total price'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    participantDetails: [
      {
        name: {
          type: String,
          required: [true, 'Participant name is required'],
        },
        email: {
          type: String,
          required: [true, 'Participant email is required'],
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
          ],
        },
        phone: {
          type: String,
          required: [true, 'Participant phone is required'],
        },
        age: {
          type: Number,
          min: [0, 'Age cannot be negative'],
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
BookingSchema.index({ user: 1 });
BookingSchema.index({ trip: 1 });
BookingSchema.index({ status: 1 });

export default model<IBooking>('Booking', BookingSchema);
