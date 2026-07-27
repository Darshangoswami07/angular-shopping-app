import { Response } from 'express';
import { BrandService } from '#/services/brand.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  getBrands = async (req: AuthRequest, res: Response) => {
    const brands = await this.brandService.getBrands();

    res.status(200).json({
      status: 'success',
      data: brands,
    });
  };

  getBrandBySlug = async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;
    const brand = await this.brandService.getBrandBySlug(slug as string);

    res.status(200).json({
      status: 'success',
      data: brand,
    });
  };
}
