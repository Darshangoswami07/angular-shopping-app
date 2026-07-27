import { prisma } from '#/prisma/client.js';

export class ReviewService {
  async getFeaturedReviews(limit: number = 6) {
    const reviews = await prisma.review.findMany({
      where: { isActive: true, rating: { gte: 4 }, comment: { not: null } },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return reviews;
  }
}
