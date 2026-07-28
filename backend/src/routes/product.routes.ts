import { Router } from 'express';
import { ProductController } from '#/controllers/product.controller.js';
import { authenticate, authorize } from '#/middleware/auth.middleware.js';
import { validate } from '#/middleware/validation.middleware.js';
import { createProductSchema, updateProductSchema } from '#/validators/product.validator.js';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/deals', productController.getDealProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), validate(createProductSchema), productController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), productController.deleteProduct);

export default router;