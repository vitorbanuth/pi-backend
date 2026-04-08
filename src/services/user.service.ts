import User from '../models/User';
import { userSchema } from '../config/swagger';

export class UserService {
  async createUser(data: any) {
    // Validate data using Zod
    const validatedData = userSchema.parse(data);

    // In a real app, hash the password here before saving
    
    const user = new User(validatedData);
    return user.save();
  }

  async getUserById(id: string) {
    return User.findById(id);
  }
}
