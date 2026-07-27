import { Response } from 'express';
import { ProductService } from '#/services/product.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from '#/validators/product.validator.js';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: AuthRequest, res: Response) => {
    const data = createProductSchema.parse(req.body);
    const product = await this.productService.createProduct(data);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  };

  getProducts = async (req: AuthRequest, res: Response) => {
    const query = productQuerySchema.parse(req.query);
    const result = await this.productService.getProducts(query);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  };

  getProductById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id as string);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  };

  getProductBySlug = async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;
    const product = await this.productService.getProductBySlug(slug as string);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  };

  updateProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    const product = await this.productService.updateProduct(id as string, data);

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    });
  };

  deleteProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await this.productService.deleteProduct(id as string);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  getFeaturedProducts = async (req: AuthRequest, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await this.productService.getFeaturedProducts(limit);

    res.status(200).json({
      status: 'success',
      data: products,
    });
  };

  getDealProducts = async (req: AuthRequest, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await this.productService.getDealProducts(limit);

    res.status(200).json({
      status: 'success',
      data: products,
    });
  };
}