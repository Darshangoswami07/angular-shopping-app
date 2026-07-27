import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';

export class BrandService {
  async getBrands() {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return brands;
  }

  async getBrandBySlug(slug: string) {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    return brand;
  }
}
