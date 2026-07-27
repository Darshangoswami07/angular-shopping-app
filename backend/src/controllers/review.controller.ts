import { Response } from 'express';
import { ReviewService } from '#/services/review.service.js';
import { AuthRequest } from '#/middleware/auth.middleware.js';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  getFeaturedReviews = async (req: AuthRequest, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const reviews = await this.reviewService.getFeaturedReviews(limit);

    res.status(200).json({
      status: 'success',
      data: reviews,
    });
  };
}
