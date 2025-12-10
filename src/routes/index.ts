import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import bookingRoutes from './booking.routes';
import galleryRoutes from './gallery.routes';
import reviewRoutes from './review.routes';
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import newsletterRoutes from './newsletter.routes';
import adminRoutes from './admin.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/gallery', galleryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/admin', adminRoutes);

export default router;
