import { Response } from 'express';
import { CartService } from '#/services/cart.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const cart = await this.cartService.getCart(req.user.id);

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  };

  addToCart = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { productId, quantity } = req.body;
    const item = await this.cartService.addToCart(req.user.id, productId, quantity);

    res.status(201).json({
      status: 'success',
      message: 'Item added to cart',
      data: item,
    });
  };

  updateCartItem = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;
    const item = await this.cartService.updateCartItem(req.user.id, itemId as string, quantity);

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
      data: item,
    });
  };

  removeCartItem = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { itemId } = req.params;
    const result = await this.cartService.removeCartItem(req.user.id, itemId as string);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };

  clearCart = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const result = await this.cartService.clearCart(req.user.id);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  };
}