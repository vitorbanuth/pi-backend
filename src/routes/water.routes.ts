import { Router } from 'express';
import { WaterController } from '../controllers/water.controller';

const router = Router();
const waterController = new WaterController();

router.post('/sync', (req, res) => waterController.syncDay(req, res));

export default router;