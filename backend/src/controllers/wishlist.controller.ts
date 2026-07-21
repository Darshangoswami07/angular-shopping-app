import { Response } from 'express';
import { WishlistService } from '#/services/wishlist.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  getWishlist = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const wishlist = await this.wishlistService.getWishlist(req.user.id);

    res.status(200).json({
      status: 'success',
      data: wishlist,
    });
  };

  addToWishlist = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { productId } = req.body;
    const item = await this.wishlistService.addToWishlist(req.user.id, productId);

    res.status(201).json({
      status: 'success',
      message: 'Item added to wishlist',
      data: item,
    });
  };

  removeFromWishlist = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { itemId } = req.params;
    const result = await this.wishlistService.removeFromWishlist(req.user.id, itemId as string);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  clearWishlist = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const result = await this.wishlistService.clearWishlist(req.user.id);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };
}