import { Response } from 'express';
import { OrderService } from '#/services/order.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const data = req.body;
      const order = await this.orderService.createOrder(req.user.id, data);

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      throw error;
    }
  };

  getOrders = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const result = await this.orderService.getOrders(req.user.id, page, limit);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  };

  getOrderById = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const { orderId } = req.params;
      const order = await this.orderService.getOrderById(req.user.id, orderId as string);

      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      throw error;
    }
  };

  updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(orderId as string, status);

      res.status(200).json({
        status: 'success',
        message: 'Order status updated',
        data: order,
      });
    } catch (error) {
      throw error;
    }
  };

  getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const status = req.query.status as string | undefined;
      const result = await this.orderService.getAllOrders(page, limit, status);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  };
}