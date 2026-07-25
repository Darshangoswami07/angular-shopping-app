import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';
import type { OrderStatus } from '../../generated/prisma/enums.js';

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
    return order;
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
      orders,
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

    return order;
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
