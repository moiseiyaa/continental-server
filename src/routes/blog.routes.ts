import express from 'express';
import {
  createBlogHandler,
  getAllBlogsHandler,
  getBlogByIdHandler,
  getBlogBySlugHandler,
  updateBlogHandler,
  deleteBlogHandler,
} from '../controllers/blog.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, authorize('admin'), createBlogHandler);

// @route   GET /api/blogs
// @access  Public
router.get('/', getAllBlogsHandler);

// @route   GET /api/blogs/slug/:slug
// @access  Public
router.get('/slug/:slug', getBlogBySlugHandler);

// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', getBlogByIdHandler);

// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateBlogHandler);

// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteBlogHandler);

export default router;

