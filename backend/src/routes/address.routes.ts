import { Router } from 'express';
import { AddressController } from '#/controllers/address.controller.js';
import { authenticate } from '#/middleware/auth.middleware.js';
import { validate } from '#/middleware/validation.middleware.js';
import { createAddressSchema, updateAddressSchema } from '#/validators/address.validator.js';

const router = Router();
const addressController = new AddressController();

router.use(authenticate);
router.get('/', addressController.getAddresses);
router.post('/', validate(createAddressSchema), addressController.createAddress);
router.put('/:addressId', validate(updateAddressSchema), addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);

export default router;
