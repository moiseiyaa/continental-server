import { model, Schema } from 'mongoose';
import { IGallery } from '../interfaces/gallery.interface';

const GallerySchema = new Schema<IGallery>(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    } as any,
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
  },
  { timestamps: true }
);

// Index for faster queries
GallerySchema.index({ trip: 1 });
GallerySchema.index({ uploadedBy: 1 });

export default model<IGallery>('Gallery', GallerySchema);
