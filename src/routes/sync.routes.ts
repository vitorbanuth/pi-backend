import { Router } from 'express';
import { DailyLogController } from '../controllers/dailyLog.controller';

const router = Router();
const dailyLogController = new DailyLogController();

router.post('/sync', (req, res) => dailyLogController.syncDay(req, res));

export default router;