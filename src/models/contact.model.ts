import { model, Schema } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
      maxlength: [100, 'Subject cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'closed'],
      default: 'new',
    },
    response: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    } as any,
  },
  { timestamps: true }
);

export default model<IContact>('Contact', ContactSchema);
