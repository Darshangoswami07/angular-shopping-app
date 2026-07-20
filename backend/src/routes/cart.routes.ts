import { Router } from 'express';
import { CartController } from '#/controllers/cart.controller.js';
import { authenticate } from '#/middleware/auth.middleware.js';

const router = Router();
const cartController = new CartController();

// All routes require authentication
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, cartController.addToCart);
router.put('/items/:itemId', authenticate, cartController.updateCartItem);
router.delete('/items/:itemId', authenticate, cartController.removeCartItem);
router.delete('/', authenticate, cartController.clearCart);

export default router;