import { prisma } from '#/prisma/client.js';

export class FaqService {
  async getFaqs() {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return faqs;
  }
}
