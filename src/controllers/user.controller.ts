import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Prisma } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(409).json({ error: 'Um usuário com este e-mail já está cadastrado.' });
        }
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id as string);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
