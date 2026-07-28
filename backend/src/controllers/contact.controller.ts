import { Response } from 'express';
import { ContactService } from '#/services/contact.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';
import type { CreateContactMessageInput } from '#/validators/contact.validator.js';

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  createMessage = async (req: AuthRequest, res: Response) => {
    const data: CreateContactMessageInput = req.body;
    await this.contactService.createMessage(data);

    res.status(201).json({
      status: 'success',
      message: "Thanks for reaching out — we've received your message and will reply soon.",
    });
  };
}
