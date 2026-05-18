import { Router } from 'express';
import { DailyLogController } from '../controllers/dailyLog.controller';
import { authMiddleware } from '../utils/auth.middleware';

const router = Router();
const controller = new DailyLogController();

router.post('/sync', authMiddleware, (req, res) => controller.syncDay(req, res));

export default router;
