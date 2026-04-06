import { Router } from 'express';
import { WaterController } from '../controllers/water.controller';

const router = Router();
const waterController = new WaterController();

// A rota atende ao que o frontend pediu: /api/water/intake
router.post('/intake', (req, res) => waterController.logWater(req, res));

export default router;
