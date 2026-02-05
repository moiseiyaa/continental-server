import { Router } from 'express';
import paymentRoutes from './payment.routes';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import bookingRoutes from './booking.routes';
import galleryRoutes from './gallery.routes';
import reviewRoutes from './review.routes';
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import userUpgradeRoutes from './user.upgrade.routes';
import newsletterRoutes from './newsletter.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';
import blogRoutes from './blog.routes';
import seoMetadataRoutes from './seoMetadata.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/users', userUpgradeRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/gallery', galleryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/notifications', notificationRoutes);
router.use('/blogs', blogRoutes);
// Admin routes
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/seo-metadata', seoMetadataRoutes);
router.use('/seo-robots', require('./robots.routes').default);
router.use('/vitals', require('./vitals.routes').default);

export default router;
