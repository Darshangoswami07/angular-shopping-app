import { Router } from 'express';
import { WishlistController } from '#/controllers/wishlist.controller.js';
import { authenticate } from '#/middleware/auth.middleware.js';

const router = Router();
const wishlistController = new WishlistController();

// All routes require authentication
router.get('/', authenticate, wishlistController.getWishlist);
router.post('/items', authenticate, wishlistController.addToWishlist);
router.delete('/items/:itemId', authenticate, wishlistController.removeFromWishlist);
router.delete('/', authenticate, wishlistController.clearWishlist);

export default router;