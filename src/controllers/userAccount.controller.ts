import { Request, Response } from "express";
import { UserAccountService } from "../services/userAccount.service";

const service = new UserAccountService();

export class UserAccountController {
  async list(_req: Request, res: Response) {
    try {
      const users = await service.list();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await service.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.issues ?? error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await service.update(req.params.id as string, req.body);
      res.status(200).json(user);
    } catch (error: any) {
      const status = error.message === "Usuário não encontrado." ? 404 : 400;
      res.status(status).json({ error: error.issues ?? error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message === "Usuário não encontrado." ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }
}
