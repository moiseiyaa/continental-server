import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  searchTrips,
  getTripsByDestination,
} from '../services/trip.service';
import { ITripInput } from '../interfaces/trip.interface';

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private/Admin
export const createTripHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tripData: ITripInput = req.body;
    const trip = await createTrip(tripData, req.user.id);

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips with pagination and filters
// @route   GET /api/trips
// @access  Public
export const getAllTripsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = {
      destination: req.query.destination,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      difficulty: req.query.difficulty,
      minDuration: req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined,
      maxDuration: req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined,
    };

    const result = await getAllTrips(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.trips,
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

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Public
export const getTripByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private/Admin
export const updateTripHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trip = await updateTrip(req.params.id, req.body);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private/Admin
export const deleteTripHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await deleteTrip(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search trips
// @route   GET /api/trips/search/:searchTerm
// @access  Public
export const searchTripsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trips = await searchTrips(req.params.searchTerm);

    res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trips by destination
// @route   GET /api/trips/destination/:destination
// @access  Public
export const getTripsByDestinationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trips = await getTripsByDestination(req.params.destination);

    res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};
