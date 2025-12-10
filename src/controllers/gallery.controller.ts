import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  uploadImage,
  getGalleryByTrip,
  getAllGallery,
  getImageById,
  updateImage,
  deleteImage,
} from '../services/gallery.service';
import { IGalleryInput } from '../interfaces/gallery.interface';

// @desc    Upload image
// @route   POST /api/gallery/upload
// @access  Private/Admin
export const uploadImageHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const galleryData: IGalleryInput = {
      trip: req.body.trip,
      title: req.body.title,
      description: req.body.description,
    };

    const gallery = await uploadImage(req.file, galleryData, req.user.id);

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get gallery by trip
// @route   GET /api/gallery/trip/:tripId
// @access  Public
export const getGalleryByTripHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gallery = await getGalleryByTrip(req.params.tripId);

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getAllGalleryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;

    const result = await getAllGallery(page, limit);

    res.status(200).json({
      success: true,
      data: result.gallery,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single image
// @route   GET /api/gallery/:id
// @access  Public
export const getImageByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await getImageById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image details
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const image = await updateImage(req.params.id, req.body);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await deleteImage(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
