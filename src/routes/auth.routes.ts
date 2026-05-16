import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../utils/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));


export default router;
