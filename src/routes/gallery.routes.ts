import { Router } from 'express';
import { body } from 'express-validator';
import {
  uploadImageHandler,
  getGalleryByTripHandler,
  getAllGalleryHandler,
  getImageByIdHandler,
  updateImageHandler,
  deleteImageHandler,
} from '../controllers/gallery.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import upload from '../config/multer';

const router = Router();

// @route   POST /api/gallery/upload
// @desc    Upload image
// @access  Private/Admin
router.post(
  '/upload',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    body('trip', 'Trip ID is required').not().isEmpty(),
    body('title', 'Title is required').not().isEmpty(),
  ],
  uploadImageHandler
);

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', getAllGalleryHandler);

// @route   GET /api/gallery/trip/:tripId
// @desc    Get gallery by trip
// @access  Public
router.get('/trip/:tripId', getGalleryByTripHandler);

// @route   GET /api/gallery/:id
// @desc    Get single image
// @access  Public
router.get('/:id', getImageByIdHandler);

// @route   PUT /api/gallery/:id
// @desc    Update image details
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  [body('title').optional().not().isEmpty()],
  updateImageHandler
);

// @route   DELETE /api/gallery/:id
// @desc    Delete image
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteImageHandler);

export default router;
