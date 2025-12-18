import { Router } from 'express';
import { body } from 'express-validator';
import {
  createTripHandler,
  getAllTripsHandler,
  getTripByIdHandler,
  updateTripHandler,
  deleteTripHandler,
  searchTripsHandler,
  getTripsByDestinationHandler,
} from '../controllers/trip.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/ownership.middleware';

const router = Router();

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private/Admin
router.post(
  '/',
  protect,
  requireRole('admin'),
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('destination', 'Destination is required').not().isEmpty(),
    body('duration', 'Duration must be a number').isNumeric(),
    body('price', 'Price must be a number').isNumeric(),
    body('maxParticipants', 'Max participants must be a number').isNumeric(),
    body('startDate', 'Start date is required').isISO8601(),
    body('endDate', 'End date is required').isISO8601(),
  ],
  createTripHandler
);

// @route   GET /api/trips
// @desc    Get all trips with pagination and filters
// @access  Public
router.get('/', getAllTripsHandler);

// @route   GET /api/trips/search/:searchTerm
// @desc    Search trips
// @access  Public
router.get('/search/:searchTerm', searchTripsHandler);

// @route   GET /api/trips/destination/:destination
// @desc    Get trips by destination
// @access  Public
router.get('/destination/:destination', getTripsByDestinationHandler);

// @route   GET /api/trips/:id
// @desc    Get single trip by ID
// @access  Public
router.get('/:id', getTripByIdHandler);

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  requireRole('admin'),
  [
    body('title').optional().not().isEmpty(),
    body('description').optional().not().isEmpty(),
    body('destination').optional().not().isEmpty(),
    body('duration').optional().isNumeric(),
    body('price').optional().isNumeric(),
    body('maxParticipants').optional().isNumeric(),
  ],
  updateTripHandler
);

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private/Admin
router.delete('/:id', protect, requireRole('admin'), deleteTripHandler);

export default router;
