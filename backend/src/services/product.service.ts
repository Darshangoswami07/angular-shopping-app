import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';
import type { CreateProductInput, UpdateProductInput, ProductQuery } from '#/validators/product.validator.js';

export class ProductService {
  async createProduct(data: CreateProductInput) {
    const { images, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images,
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return product;
  }

  async getProducts(query: ProductQuery) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive,
      isFeatured,
    } = query;

    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{ name: { contains: string; mode: 'insensitive' } } | { description: { contains: string; mode: 'insensitive' } }>;
      categoryId?: string;
      price?: { gte?: number; lte?: number };
      isActive?: boolean;
      isFeatured?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: {
            orderBy: { position: 'asc' },
          },
          category: true,
          brand: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
        brand: true,
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const { images, ...productData } = data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
      include: {
        images: true,
        category: true,
      },
    });

    return product;
  }

  async deleteProduct(id: string) {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // Caps how many results from the same category can appear consecutively so a
  // single category (e.g. whichever was imported last) can't dominate a rail.
  private diversifyByCategory<T extends { categoryId: string }>(items: T[], limit: number, perCategoryCap = 2): T[] {
    const perCategoryCount = new Map<string, number>();
    const picked: T[] = [];
    for (const item of items) {
      const count = perCategoryCount.get(item.categoryId) ?? 0;
      if (count >= perCategoryCap) continue;
      picked.push(item);
      perCategoryCount.set(item.categoryId, count + 1);
      if (picked.length >= limit) break;
    }
    return picked;
  }

  async getFeaturedProducts(limit: number = 8) {
    const candidates = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      take: limit * 4,
      orderBy: { rating: 'desc' },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
        brand: true,
      },
    });

    return this.diversifyByCategory(candidates, limit);
  }

  async getDealProducts(limit: number = 8) {
    const candidates = await prisma.product.findMany({
      where: {
        isActive: true,
        comparePrice: { not: null },
      },
      take: limit * 6,
      orderBy: { rating: 'desc' },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
        brand: true,
      },
    });

    const withDiscount = candidates
      .map((product) => ({
        product,
        discount: product.comparePrice
          ? (Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)
          : 0,
      }))
      .sort((a, b) => b.discount - a.discount)
      .map((entry) => entry.product);

    return this.diversifyByCategory(withDiscount, limit);
  }
}