import { Router } from 'express';
import { ReviewController } from '#/controllers/review.controller.js';

const router = Router();
const reviewController = new ReviewController();

router.get('/featured', reviewController.getFeaturedReviews);

export default router;
