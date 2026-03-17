import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../services/blog.service';
import { IBlogInput } from '../interfaces/blog.interface';

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlogHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogData: IBlogInput = req.body;
    const blog = await createBlog(blogData, req.user.id);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs with pagination and filters
// @route   GET /api/blogs
// @access  Public
export const getAllBlogsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = {
      category: req.query.category as string,
      author: req.query.author as string,
      search: req.query.search as string,
    };

    const result = await getAllBlogs(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.blogs,
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

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await getBlogById(String(req.params.id));

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
export const getBlogBySlugHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await getBlogBySlug(String(req.params.slug));

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlogHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await updateBlog(req.params.id, req.body);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlogHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await deleteBlog(String(req.params.id));

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

