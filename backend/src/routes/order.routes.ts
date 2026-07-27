import { Router } from 'express';
import { OrderController } from '#/controllers/order.controller.js';
import { authenticate, authorize } from '#/middleware/auth.middleware.js';

const router = Router();
const orderController = new OrderController();

// Customer routes
router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getOrders);
router.get('/:orderId', authenticate, orderController.getOrderById);
router.patch('/:orderId/cancel', authenticate, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN'), orderController.getAllOrders);
router.patch('/:orderId/status', authenticate, authorize('ADMIN'), orderController.updateOrderStatus);

export default router;