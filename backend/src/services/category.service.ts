import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';

export class CategoryService {
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    order?: number;
  }) {
    const category = await prisma.category.create({
      data,
      include: {
        parent: true,
      },
    });

    return category;
  }

  async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return categories;
  }

  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
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

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
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

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async updateCategory(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    order?: number;
  }) {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new AppError('Category not found', 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
      },
    });

    return category;
  }

  async deleteCategory(id: string) {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingCategory) {
      throw new AppError('Category not found', 404);
    }

    if (existingCategory._count.products > 0) {
      throw new AppError('Cannot delete category with products', 400);
    }

    await prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}