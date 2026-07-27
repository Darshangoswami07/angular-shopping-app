import { Response } from 'express';
import { AddressService } from '#/services/address.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';
import type { CreateAddressInput, UpdateAddressInput } from '#/validators/address.validator.js';

export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  getAddresses = async (req: AuthRequest, res: Response) => {
    const addresses = await this.addressService.getAddresses(req.user!.id);
    res.status(200).json({ status: 'success', data: addresses });
  };

  createAddress = async (req: AuthRequest, res: Response) => {
    const data: CreateAddressInput = req.body;
    const address = await this.addressService.createAddress(req.user!.id, data);
    res.status(201).json({ status: 'success', message: 'Address added successfully', data: address });
  };

  updateAddress = async (req: AuthRequest, res: Response) => {
    const { addressId } = req.params;
    const data: UpdateAddressInput = req.body;
    const address = await this.addressService.updateAddress(req.user!.id, addressId as string, data);
    res.status(200).json({ status: 'success', message: 'Address updated successfully', data: address });
  };

  deleteAddress = async (req: AuthRequest, res: Response) => {
    const { addressId } = req.params;
    const result = await this.addressService.deleteAddress(req.user!.id, addressId as string);
    res.status(200).json({ status: 'success', message: result.message });
  };
}
