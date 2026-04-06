import { prisma } from '../config/prisma';
import { userSchema } from '../config/swagger';

export class UserService {
  async createUser(data: any) {
    // Validate data using Zod
    const validatedData = userSchema.parse(data);

    // In a real app, hash the password here before saving
    
    return prisma.user.create({
      data: validatedData
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}
