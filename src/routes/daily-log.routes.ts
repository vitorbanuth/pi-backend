import { Router } from 'express';
import { DailyLogController } from '../controllers/dailyLog.controller';

const router = Router();
const controller = new DailyLogController();

router.post('/sync', (req, res) => controller.syncDay(req, res));

export default router;