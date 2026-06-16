import { Router } from 'express';
import { MealSuggestionController } from '../controllers/mealSuggestion.controller';

const router = Router();
const controller = new MealSuggestionController();

// GET  /api/suggestions/patient/:patientId          — todas as sugestões do paciente
// PUT  /api/suggestions/patient/:patientId/:mealType — criar/substituir uma refeição
// DELETE /api/suggestions/patient/:patientId/:mealType — remover uma refeição

router.get('/patient/:patientId',                (req, res) => controller.getAllForPatient(req, res));
router.put('/patient/:patientId/:mealType',      (req, res) => controller.upsert(req, res));
router.delete('/patient/:patientId/:mealType',   (req, res) => controller.delete(req, res));

export default router;
