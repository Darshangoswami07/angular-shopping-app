import { Router } from 'express';
import { StatsController } from '#/controllers/stats.controller.js';

const router = Router();
const statsController = new StatsController();

router.get('/overview', statsController.getOverview);

export default router;
