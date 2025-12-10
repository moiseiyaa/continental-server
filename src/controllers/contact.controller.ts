import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  createContact,
  getContactById,
  getAllContacts,
  updateContactStatus,
  respondToContact,
  deleteContact,
  getContactStats,
} from '../services/contact.service';
import { IContactInput, IContactResponse } from '../interfaces/contact.interface';

// @desc    Create a new contact inquiry
// @route   POST /api/contacts
// @access  Public
export const createContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactData: IContactInput = req.body;
    const contact = await createContact(contactData);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: contact,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await getContactById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/contacts
// @access  Private/Admin
export const getAllContactsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const status = req.query.status as string | undefined;

    const result = await getAllContacts(page, limit, { status });

    res.status(200).json({
      success: true,
      data: result.contacts,
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

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
export const updateContactStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'responded', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const contact = await updateContactStatus(req.params.id, status);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Respond to contact inquiry
// @route   PUT /api/contacts/:id/respond
// @access  Private/Admin
export const respondToContactHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const responseData: IContactResponse = req.body;
    const contact = await respondToContact(req.params.id, responseData, req.user.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Response sent successfully',
      data: contact,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await deleteContact(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact statistics
// @route   GET /api/contacts/stats/overview
// @access  Private/Admin
export const getContactStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getContactStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
