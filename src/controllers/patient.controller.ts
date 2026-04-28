// import { Request, Response } from 'express';
// import { UserService } from '../services/patient.service';

// const userService = new UserService();

// export class UserController {
//   async createUser(req: Request, res: Response) {
//     try {
//       const user = await userService.createUser(req.body);
//       res.status(201).json(user);
//     } catch (error: any) {
//       if (error.code === 11000) {
//         return res.status(409).json({ error: 'Um usuário com este e-mail já está cadastrado.' });
//       }
//       res.status(400).json({ error: error.message });
//     }
//   }

//   async getUser(req: Request, res: Response) {
//     try {
//       const user = await userService.getUserById(req.params.id as string);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.status(200).json(user);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// }

import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';

const patientService = new PatientService();

export class PatientController {
  async getAll(req: Request, res: Response) {
    try {
      const patients = await patientService.getAllPatients();
      res.status(200).json(patients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const patient = await patientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // async delete(req: Request, res: Response) {
  //   try {
  //     await patientService.deletePatient(req.params.id);
  //     res.status(204).send();
  //   } catch (error: any) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }
}