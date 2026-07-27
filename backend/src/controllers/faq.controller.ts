import { Response } from 'express';
import { FaqService } from '#/services/faq.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class FaqController {
  private faqService: FaqService;

  constructor() {
    this.faqService = new FaqService();
  }

  getFaqs = async (req: AuthRequest, res: Response) => {
    const faqs = await this.faqService.getFaqs();

    res.status(200).json({
      status: 'success',
      data: faqs,
    });
  };
}
