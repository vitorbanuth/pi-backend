import bcrypt from "bcryptjs";
import { z } from "zod";
import mongoose from "mongoose";
import User from "../models/User";
import { Patient } from "../models/Patient";

const createSchema = z.object({
  username: z.string().min(2, "Usuário deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  patientId: z.string().min(1, "Paciente é obrigatório"),
});

const updateSchema = z.object({
  username: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  patientId: z.string().min(1).optional(),
});

export class UserAccountService {
  async list() {
    return User.find().select("-password").sort({ createdAt: -1 });
  }

  async create(data: unknown) {
    const validated = createSchema.parse(data);

    if (!mongoose.isValidObjectId(validated.patientId)) {
      throw new Error("patientId inválido.");
    }

    const patient = await Patient.findById(validated.patientId);
    if (!patient) {
      throw new Error("Paciente não encontrado.");
    }

    const existingEmail = await User.findOne({ email: validated.email });
    if (existingEmail) {
      throw new Error("E-mail já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await User.create({
      username: validated.username,
      email: validated.email,
      password: hashedPassword,
      patientId: validated.patientId,
    });

    const { password, ...rest } = user.toObject();
    return rest;
  }

  async delete(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Id inválido.");
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Usuário não encontrado.");
    }
  }

  async update(id: string, data: unknown) {
    const validated = updateSchema.parse(data);

    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Id inválido.");
    }

    if (validated.patientId) {
      if (!mongoose.isValidObjectId(validated.patientId)) {
        throw new Error("patientId inválido.");
      }
      const patient = await Patient.findById(validated.patientId);
      if (!patient) {
        throw new Error("Paciente não encontrado.");
      }
    }

    const payload: Record<string, unknown> = { ...validated };
    if (validated.password) {
      payload.password = await bcrypt.hash(validated.password, 12);
    }

    const updated = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) {
      throw new Error("Usuário não encontrado.");
    }

    return updated;
  }
}
