import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Um usuário com este e-mail já está cadastrado.' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id as string);
      if (!user) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await userService.deleteUser(req.params.id as string);
      if (!user) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }
      res.status(200).json({ message: 'Paciente removido com sucesso.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
