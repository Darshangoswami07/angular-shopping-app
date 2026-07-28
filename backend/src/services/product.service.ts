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

  // Bridges common shopper vocabulary that doesn't literally appear anywhere in
  // the catalogue text (e.g. a shopper searching "perfume" should still find
  // the "Fragrances" category; "jewelry" should still find "Jewellery").
  private static readonly SEARCH_SYNONYMS: Record<string, string[]> = {
    perfume: ['fragrance', 'fragrances', 'cologne'],
    perfumes: ['fragrance', 'fragrances', 'cologne'],
    cologne: ['fragrance', 'fragrances'],
    scent: ['fragrance', 'fragrances'],
    jewelry: ['jewellery'],
    jewelries: ['jewellery'],
    tv: ['television'],
    television: ['tv'],
    makeup: ['beauty', 'cosmetics'],
    cosmetics: ['beauty', 'makeup'],
    mobile: ['smartphone', 'smartphones', 'phone'],
    cellphone: ['smartphone', 'smartphones', 'mobile'],
    sneaker: ['shoe', 'shoes'],
    sneakers: ['shoe', 'shoes'],
    handbag: ['bag', 'bags'],
    handbags: ['bag', 'bags'],
    tee: ['shirt', 'top'],
    tees: ['shirt', 'tops'],
  };

  // Splits a raw query into normalized, deduplicated word tokens for multi-field matching.
  private tokenize(search: string): string[] {
    return [...new Set(search.trim().toLowerCase().split(/\s+/).filter(Boolean))];
  }

  // A product matches a search only if EVERY token is found in at least one
  // searchable field (name, description, sku, category, brand) — this is what
  // lets "beauty" match products via their category and "rolex watch" match
  // via a combination of brand + category rather than requiring one field to
  // contain the whole phrase verbatim. Each token also expands to its known
  // synonyms so realistic shopper vocabulary (perfume/fragrance,
  // jewelry/jewellery) resolves to the same results.
  private buildSearchClause(tokens: string[]) {
    return tokens.map((token) => {
      const variants = [token, ...(ProductService.SEARCH_SYNONYMS[token] || [])];
      const fieldsPerVariant = variants.flatMap((term) => [
        { name: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
        { sku: { contains: term, mode: 'insensitive' as const } },
        { category: { name: { contains: term, mode: 'insensitive' as const } } },
        { category: { slug: { contains: term, mode: 'insensitive' as const } } },
        { brand: { name: { contains: term, mode: 'insensitive' as const } } },
        { brand: { slug: { contains: term, mode: 'insensitive' as const } } },
      ]);
      return { OR: fieldsPerVariant };
    });
  }

  // Higher score = more relevant. Exact/prefix matches on the product name rank
  // highest (the way a shopper expects their literal query to surface first),
  // then brand/category matches, then description matches as a last resort.
  private relevanceScore(
    product: { name: string; description: string | null; category: { name: string } | null; brand: { name: string } | null },
    searchLower: string,
    tokens: string[]
  ): number {
    const name = product.name.toLowerCase();
    const description = (product.description || '').toLowerCase();
    const categoryName = product.category?.name?.toLowerCase() || '';
    const brandName = product.brand?.name?.toLowerCase() || '';

    let score = 0;
    if (name === searchLower) score += 100;
    else if (name.startsWith(searchLower)) score += 60;
    else if (name.includes(searchLower)) score += 35;

    for (const token of tokens) {
      const variants = [token, ...(ProductService.SEARCH_SYNONYMS[token] || [])];
      for (const term of variants) {
        if (name.includes(term)) score += 12;
        if (brandName.includes(term)) score += 8;
        if (categoryName.includes(term)) score += 6;
        if (description.includes(term)) score += 2;
      }
    }

    return score;
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
    const tokens = search ? this.tokenize(search) : [];

    const where: {
      AND?: Array<Record<string, unknown>>;
      categoryId?: string;
      price?: { gte?: number; lte?: number };
      isActive?: boolean;
      isFeatured?: boolean;
    } = {};

    if (tokens.length) {
      where.AND = this.buildSearchClause(tokens);
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

    const includeClause = {
      images: { orderBy: { position: 'asc' as const } },
      category: true,
      brand: true,
    };

    if (tokens.length) {
      // A relevance-ranked search can't be expressed as a single SQL ORDER BY
      // without full-text search infrastructure, so we score and sort in
      // memory. The catalogue here is small enough (low thousands of rows at
      // most) that this stays fast; it also guarantees exact/prefix name
      // matches always outrank incidental description hits.
      const matches = await prisma.product.findMany({ where, include: includeClause });
      const searchLower = search!.trim().toLowerCase();
      const ranked = matches
        .map((product) => ({ product, score: this.relevanceScore(product, searchLower, tokens) }))
        .sort((a, b) => b.score - a.score);

      const total = ranked.length;
      const products = ranked.slice(skip, skip + limit).map((entry) => entry.product);

      return {
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: includeClause,
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

  async getRelatedProducts(id: string, limit: number = 8) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, categoryId: true, brandId: true },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const includeClause = {
      images: { orderBy: { position: 'asc' as const } },
      category: true,
      brand: true,
    };

    // Prefer products that share both category and brand, then fall back to
    // same-category, so a search for related items on a Rolex watch surfaces
    // other Rolex watches before unrelated products that merely share a category.
    const sameCategoryAndBrand = product.brandId
      ? await prisma.product.findMany({
          where: { id: { not: id }, categoryId: product.categoryId, brandId: product.brandId, isActive: true },
          take: limit,
          orderBy: { rating: 'desc' },
          include: includeClause,
        })
      : [];

    if (sameCategoryAndBrand.length >= limit) {
      return sameCategoryAndBrand.slice(0, limit);
    }

    const excludeIds = [id, ...sameCategoryAndBrand.map((p) => p.id)];
    const sameCategory = await prisma.product.findMany({
      where: { id: { notIn: excludeIds }, categoryId: product.categoryId, isActive: true },
      take: limit - sameCategoryAndBrand.length,
      orderBy: { rating: 'desc' },
      include: includeClause,
    });

    return [...sameCategoryAndBrand, ...sameCategory];
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