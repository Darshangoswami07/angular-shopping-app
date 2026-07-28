import { prisma } from '#/prisma/client.js';
import type { CreateContactMessageInput } from '#/validators/contact.validator.js';

export class ContactService {
  async createMessage(data: CreateContactMessageInput) {
    return prisma.contactMessage.create({ data });
  }
}
