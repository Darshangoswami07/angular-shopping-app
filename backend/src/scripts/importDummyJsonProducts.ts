import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../utils/password.util';

const SOURCE_URL = 'https://dummyjson.com/products?limit=0';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[#%&?]/g, '')
    .replace(/[-\s]/g, '-')
    .replace(/[:;<=>@>~`]/g, '')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface DummyJsonReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  images: string[];
  thumbnail: string;
  reviews?: DummyJsonReview[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
}

async function fetchProducts(): Promise<DummyJsonProduct[]> {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch products from ${SOURCE_URL}: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as DummyJsonResponse;
  if (!Array.isArray(data.products) || data.products.length === 0) {
    throw new Error('DummyJSON returned no products; aborting import to avoid wiping/skewing data.');
  }
  return data.products;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  console.log(`Fetching products from ${SOURCE_URL} ...`);
  const products = await fetchProducts();
  console.log(`Fetched ${products.length} products.`);

  // Rank products within each category by rating so every category — not just
  // whichever happened to be imported last — gets representation in "Featured".
  const featuredIds = new Set<number>();
  const byCategory = new Map<string, DummyJsonProduct[]>();
  for (const product of products) {
    const list = byCategory.get(product.category) ?? [];
    list.push(product);
    byCategory.set(product.category, list);
  }
  for (const list of byCategory.values()) {
    const topRated = [...list].sort((a, b) => b.rating - a.rating).slice(0, 2);
    topRated.forEach((p) => featuredIds.add(p.id));
  }

  const categoryNames = [...new Set(products.map((p) => p.category))];
  const brandNames = [...new Set(products.map((p) => p.brand).filter((b): b is string => Boolean(b)))];
  const reviewerEmails = [
    ...new Set(
      products.flatMap((p) => p.reviews ?? []).map((r) => r.reviewerEmail)
    ),
  ];

  let categoryCount = 0;
  let brandCount = 0;
  let reviewerCount = 0;
  let productCount = 0;
  let imageCount = 0;
  let reviewCount = 0;

  // Categories and brands are upserted first, outside the big transaction, since
  // they are small independent lookup sets and re-running this is always safe
  // (unique on slug/name means repeated runs just resolve to the same rows).
  const categoryIdByName = new Map<string, string>();
  for (const name of categoryNames) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
    categoryIdByName.set(name, category.id);
    categoryCount += 1;
  }
  console.log(`Upserted ${categoryCount} categories.`);

  const brandIdByName = new Map<string, string>();
  for (const name of brandNames) {
    const slug = slugify(name);
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
    brandIdByName.set(name, brand.id);
    brandCount += 1;
  }
  console.log(`Upserted ${brandCount} brands.`);

  // Reviewer users: dummyjson reviews are attributed to reviewer emails without
  // real accounts. We upsert one lightweight CUSTOMER user per unique email so
  // the reviews.userId FK can be satisfied without inventing fake purchases.
  const reviewerIdByEmail = new Map<string, string>();
  const seedPassword = await hashPassword(`seed-${Date.now()}-not-a-real-login`);
  for (const email of reviewerEmails) {
    const reviewerName =
      products
        .flatMap((p) => p.reviews ?? [])
        .find((r) => r.reviewerEmail === email)?.reviewerName ?? 'Verified Buyer';
    const [firstName, ...rest] = reviewerName.split(' ');
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: seedPassword,
        firstName: firstName || 'Verified',
        lastName: rest.join(' ') || 'Buyer',
        role: 'CUSTOMER',
        emailVerified: true,
      },
    });
    reviewerIdByEmail.set(email, user.id);
    reviewerCount += 1;
  }
  console.log(`Upserted ${reviewerCount} reviewer accounts.`);

  // Products + images + reviews are written per-product inside a transaction each,
  // so a failure partway through the import never leaves a product half-written.
  for (const product of products) {
    const slug = slugify(`${product.title}-${product.id}`);
    const categoryId = categoryIdByName.get(product.category);
    if (!categoryId) {
      throw new Error(`Missing category mapping for product ${product.id} (${product.category})`);
    }
    const brandId = product.brand ? brandIdByName.get(product.brand) ?? null : null;
    const comparePrice =
      product.discountPercentage > 0
        ? Number((product.price / (1 - product.discountPercentage / 100)).toFixed(2))
        : null;
    const images = Array.from(new Set(product.images && product.images.length > 0 ? product.images : [product.thumbnail]));
    const isFeatured = featuredIds.has(product.id);

    await prisma.$transaction(async (tx) => {
      const savedProduct = await tx.product.upsert({
        where: { slug },
        update: {
          name: product.title,
          description: product.description,
          price: Number(product.price.toFixed(2)),
          comparePrice,
          sku: product.sku,
          stock: product.stock,
          isActive: true,
          isFeatured,
          categoryId,
          brandId,
          thumbnail: product.thumbnail,
          rating: Number(product.rating.toFixed(2)),
        },
        create: {
          name: product.title,
          slug,
          description: product.description,
          price: Number(product.price.toFixed(2)),
          comparePrice,
          sku: product.sku,
          stock: product.stock,
          isActive: true,
          isFeatured,
          categoryId,
          brandId,
          thumbnail: product.thumbnail,
          rating: Number(product.rating.toFixed(2)),
        },
      });

      // Re-importing should not duplicate images/reviews: clear and re-insert
      // this product's children inside the same transaction.
      await tx.productImage.deleteMany({ where: { productId: savedProduct.id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((url, position) => ({
            productId: savedProduct.id,
            url,
            alt: product.title,
            position,
          })),
        });
        imageCount += images.length;
      }

      if (product.reviews && product.reviews.length > 0) {
        await tx.review.deleteMany({ where: { productId: savedProduct.id } });
        for (const review of product.reviews) {
          const userId = reviewerIdByEmail.get(review.reviewerEmail);
          if (!userId) continue;
          await tx.review.upsert({
            where: { userId_productId: { userId, productId: savedProduct.id } },
            update: {
              rating: review.rating,
              comment: review.comment,
              isActive: true,
            },
            create: {
              userId,
              productId: savedProduct.id,
              rating: review.rating,
              comment: review.comment,
              isVerified: false,
              isActive: true,
            },
          });
          reviewCount += 1;
        }
      }
    });

    productCount += 1;
    if (productCount % 25 === 0) {
      console.log(`  ... imported ${productCount}/${products.length} products`);
    }
  }

  console.log('Import complete:');
  console.log({ categoryCount, brandCount, reviewerCount, productCount, imageCount, reviewCount });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
