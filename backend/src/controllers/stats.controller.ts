import { Response } from 'express';
import { StatsService } from '#/services/stats.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class StatsController {
  private statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  getOverview = async (req: AuthRequest, res: Response) => {
    const overview = await this.statsService.getOverview();

    res.status(200).json({
      status: 'success',
      data: overview,
    });
  };
}
