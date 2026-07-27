import { Router } from 'express';
import { BrandController } from '#/controllers/brand.controller.js';

const router = Router();
const brandController = new BrandController();

router.get('/', brandController.getBrands);
router.get('/slug/:slug', brandController.getBrandBySlug);

export default router;
