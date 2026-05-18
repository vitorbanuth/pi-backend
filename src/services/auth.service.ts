import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme_secret";
const JWT_EXPIRES_IN = "7d";

// ─── Schemas de validação ────────────────────────────────────────────────────

export const registerSchema = z.object({
  username: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});

// ─── Service ─────────────────────────────────────────────────────────────────

export class AuthService {
  async register(data: unknown) {
    const validated = registerSchema.parse(data);

    const existing = await User.findOne({ email: validated.email });
    if (existing) {
      throw new Error("E-mail já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await User.create({
      username: validated.username,
      email: validated.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        patientId: user.patientId,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        patientId: user.patientId,
      },
    };
  }

  async login(data: unknown) {
    const validated = loginSchema.parse(data);

    const user = await User.findOne({ username: validated.username }).select(
      "+password",
    );
    if (!user || !user.password) {
      throw new Error("Credenciais inválidas.");
    }

    const passwordMatch = await bcrypt.compare(
      validated.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
