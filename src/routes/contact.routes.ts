import { Router } from 'express';
import { body } from 'express-validator';
import {
  createContactHandler,
  getContactByIdHandler,
  getAllContactsHandler,
  updateContactStatusHandler,
  respondToContactHandler,
  deleteContactHandler,
  getContactStatsHandler,
} from '../controllers/contact.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/contacts
// @desc    Create a new contact inquiry
// @access  Public
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required').trim(),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters'),
    body('phone').optional().trim(),
  ],
  createContactHandler
);

// @route   GET /api/contacts
// @desc    Get all contacts (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllContactsHandler);

// @route   GET /api/contacts/stats/overview
// @desc    Get contact statistics
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), getContactStatsHandler);

// @route   GET /api/contacts/:id
// @desc    Get a single contact
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getContactByIdHandler);

// @route   PUT /api/contacts/:id/status
// @desc    Update contact status
// @access  Private/Admin
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [body('status').notEmpty().withMessage('Status is required')],
  updateContactStatusHandler
);

// @route   PUT /api/contacts/:id/respond
// @desc    Respond to contact inquiry
// @access  Private/Admin
router.put(
  '/:id/respond',
  protect,
  authorize('admin'),
  [body('response').notEmpty().withMessage('Response is required')],
  respondToContactHandler
);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteContactHandler);

export default router;
