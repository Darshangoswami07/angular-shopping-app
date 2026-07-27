import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard orders are delivered within 3-5 business days. Express shipping options are available at checkout for faster delivery.',
    category: 'shipping',
    order: 1,
  },
  {
    question: 'What is your return policy?',
    answer: 'Most items can be returned within 7-30 days of delivery, depending on the product. Check the product page for its specific return window.',
    category: 'returns',
    order: 2,
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept major credit/debit cards and Cash on Delivery (COD) on eligible orders.',
    category: 'payment',
    order: 3,
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you can view its status anytime from the Orders section of your account.',
    category: 'orders',
    order: 4,
  },
  {
    question: 'Do you offer a warranty on products?',
    answer: 'Warranty coverage varies by product and is listed on each product page under warranty information.',
    category: 'warranty',
    order: 5,
  },
  {
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" in the navigation bar and fill in your details. You can start shopping and tracking orders right away.',
    category: 'account',
    order: 6,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.faq.create({ data: faq });
    }
  }

  const count = await prisma.faq.count();
  console.log(`FAQs seeded. Total active FAQ rows: ${count}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('FAQ seed failed:', error);
  process.exit(1);
});
