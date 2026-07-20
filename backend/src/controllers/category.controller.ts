import { Response } from 'express';
import { CategoryService } from '#/services/category.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;
      const category = await this.categoryService.createCategory(data);

      res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      throw error;
    }
  };

  getCategories = async (req: AuthRequest, res: Response) => {
    try {
      const categories = await this.categoryService.getCategories();

      res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      throw error;
    }
  };

  getCategoryById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id as string);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      throw error;
    }
  };

  getCategoryBySlug = async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.getCategoryBySlug(slug as string);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      throw error;
    }
  };

  updateCategory = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const category = await this.categoryService.updateCategory(id as string, data);

      res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.categoryService.deleteCategory(id as string);

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      throw error;
    }
  };
}