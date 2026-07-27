import { prisma } from '#/prisma/client.js';
import { AppError } from '#/middleware/error.middleware.js';
import type { CreateAddressInput, UpdateAddressInput } from '#/validators/address.validator.js';

export class AddressService {
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, data: CreateAddressInput) {
    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    } else {
      const existing = await prisma.address.count({ where: { userId } });
      if (existing === 0) data.isDefault = true;
    }

    return prisma.address.create({ data: { ...data, userId } });
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressInput) {
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) throw new AppError('Address not found', 404);

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    return prisma.address.update({ where: { id: addressId }, data });
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) throw new AppError('Address not found', 404);

    await prisma.address.delete({ where: { id: addressId } });

    if (existing.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    return { message: 'Address deleted successfully' };
  }
}
