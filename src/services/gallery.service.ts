import { IGallery, IGalleryInput } from '../interfaces/gallery.interface';
import Gallery from '../models/gallery.model';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadImage = async (
  file: Express.Multer.File,
  galleryData: IGalleryInput,
  userId: string
): Promise<IGallery> => {
  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `continental-travel/trips/${galleryData.trip}`,
          resource_type: 'auto',
          quality: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      Readable.from(file.buffer).pipe(uploadStream);
    });

    const uploadResult = result as any;

    // Save to database
    const gallery = await Gallery.create({
      ...galleryData,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedBy: userId,
    });

    return gallery.populate('trip uploadedBy');
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const getGalleryByTrip = async (tripId: string): Promise<IGallery[]> => {
  return await Gallery.find({ trip: tripId })
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });
};

export const getAllGallery = async (
  page: number = 1,
  limit: number = 12
): Promise<{ gallery: IGallery[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const total = await Gallery.countDocuments();
  const gallery = await Gallery.find()
    .populate('trip', 'title destination')
    .populate('uploadedBy', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    gallery,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getImageById = async (imageId: string): Promise<IGallery | null> => {
  return await Gallery.findById(imageId)
    .populate('trip')
    .populate('uploadedBy', 'name email');
};

export const updateImage = async (
  imageId: string,
  updateData: Partial<IGalleryInput>
): Promise<IGallery | null> => {
  return await Gallery.findByIdAndUpdate(imageId, updateData, {
    new: true,
    runValidators: true,
  }).populate('trip uploadedBy');
};

export const deleteImage = async (imageId: string): Promise<IGallery | null> => {
  const image = await Gallery.findById(imageId);

  if (!image) {
    throw new Error('Image not found');
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error.message);
  }

  // Delete from database
  return await Gallery.findByIdAndDelete(imageId);
};

export const deleteGalleryByTrip = async (tripId: string): Promise<void> => {
  const images = await Gallery.find({ trip: tripId });

  // Delete all images from Cloudinary
  for (const image of images) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (error: any) {
      console.error('Error deleting from Cloudinary:', error.message);
    }
  }

  // Delete all images from database
  await Gallery.deleteMany({ trip: tripId });
};
