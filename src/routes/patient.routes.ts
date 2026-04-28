// import { Router } from 'express';
// import { UserController } from '../controllers/patient.controller';

// const router = Router();
// const userController = new UserController();

// // router.post('/', (req, res) => userController.createUser(req, res));
// // router.get('/:id', (req, res) => userController.getUser(req, res));

// import { Patient } from '../models/Patient';

// // GET all patients
// router.get('/', async (req, res) => {
//   try {
//     const patients = await Patient.find().sort({ createdAt: -1 });
//     res.json(patients);
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar pacientes' });
//   }
// });

// // CREATE patient
// router.post('/', async (req, res) => {
//   try {
//     const patient = await Patient.create(req.body);
//     res.status(201).json(patient);
//   } catch (err) {
//     res.status(400).json({ error: 'Erro ao criar paciente' });
//   }
// });

// // DELETE patient
// router.delete('/:id', async (req, res) => {
//   try {
//     await Patient.findByIdAndDelete(req.params.id);
//     res.status(204).send();
//   } catch (err) {
//     res.status(400).json({ error: 'Erro ao deletar paciente' });
//   }
// });

import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";

const router = Router();
const controller = new PatientController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
// router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
