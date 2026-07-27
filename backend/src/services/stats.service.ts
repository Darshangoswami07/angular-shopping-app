import { prisma } from '#/prisma/client.js';

export class StatsService {
  async getOverview() {
    const [productCount, categoryCount, brandCount, orderCount, customerCount, ratingAgg] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.category.count({ where: { isActive: true } }),
        prisma.brand.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.product.aggregate({
          where: { isActive: true, rating: { not: null } },
          _avg: { rating: true },
        }),
      ]);

    return {
      productCount,
      categoryCount,
      brandCount,
      orderCount,
      customerCount,
      averageRating: ratingAgg._avg.rating ? Number(ratingAgg._avg.rating.toFixed(2)) : null,
    };
  }
}
