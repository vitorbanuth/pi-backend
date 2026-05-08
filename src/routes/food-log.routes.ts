import { Router } from 'express';
import { FoodLogController } from '../controllers/foodLog.controller';

const router = Router();
const controller = new FoodLogController();

router.post('/sync', (req, res) => controller.syncEntries(req, res));
router.get('/', (req, res) => controller.getEntries(req, res));

export default router;
