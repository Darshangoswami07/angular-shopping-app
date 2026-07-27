import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';
import type { OrderStatus } from '../../generated/prisma/enums.js';

const TRACKING_STAGES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const STAGE_LABELS: Record<string, string> = {
  PENDING: 'Order Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

function generateTrackingNumber(): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TRK-${random}`;
}

// Builds a status-driven delivery timeline from the order's real status/timestamps —
// no external courier integration exists, so this reflects actual DB state rather
// than fabricating live courier events.
function withTracking<T extends { status: string; createdAt: Date; updatedAt: Date; shipping: unknown }>(order: T) {
  const isTerminalException = order.status === 'CANCELLED' || order.status === 'REFUNDED';
  const currentIndex = TRACKING_STAGES.indexOf(order.status as OrderStatus);

  const trackingSteps = TRACKING_STAGES.map((stage, index) => ({
    key: stage,
    label: STAGE_LABELS[stage],
    state: isTerminalException
      ? 'skipped'
      : index < currentIndex
        ? 'done'
        : index === currentIndex
          ? 'current'
          : 'upcoming',
    date: index === 0 ? order.createdAt : index <= currentIndex && !isTerminalException ? order.updatedAt : null,
  }));

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + (Number(order.shipping) === 0 ? 3 : 5));

  return {
    ...order,
    trackingSteps,
    estimatedDelivery: isTerminalException ? null : estimatedDelivery,
    isCancellable: order.status === 'PENDING' || order.status === 'PROCESSING',
  };
}

export class OrderService {
  async createOrder(userId: string, data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone?: string;
    };
    notes?: string;
  }) {
    const { items, shippingAddress, notes } = data;

    // Validate products and calculate totals
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found', 404);
    }

    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new AppError('Product not found', 404);
      
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order, decrement inventory and clear the cart atomically.
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new AppError('A product is no longer available in the requested quantity', 409);
      }
      const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'COD',
        trackingNumber: generateTrackingNumber(),
        subtotal,
        tax,
        shipping,
        total,
        notes,
        shippingFirstName: shippingAddress.firstName,
        shippingLastName: shippingAddress.lastName,
        shippingStreet: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZipCode: shippingAddress.zipCode,
        shippingCountry: shippingAddress.country,
        shippingPhone: shippingAddress.phone,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      });
      const cart = await tx.cart.findUnique({
      where: { userId },
      });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });
    return withTracking(order);
  }

  async getOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders: orders.map(withTracking),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return withTracking(order);
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new AppError(`Order cannot be cancelled once it is ${order.status.toLowerCase()}`, 400);
    }

    const updated = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: {
          items: {
            include: {
              product: { include: { images: { orderBy: { position: 'asc' } } } },
            },
          },
        },
      });
    });

    return withTracking(updated);
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where: { status?: OrderStatus } = {};
    if (status) {
      where.status = status as OrderStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
