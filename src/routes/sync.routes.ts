import { Router } from 'express';
import { DailyLogController } from '../controllers/dailyLog.controller';

const router = Router();
const dailyLogController = new DailyLogController();

router.post('/sync', (req, res) => dailyLogController.syncDay(req, res));
router.get('/patient/:id', (req, res) => dailyLogController.getLatestForPatient(req, res));

export default router;
