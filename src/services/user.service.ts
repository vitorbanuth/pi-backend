import User from '../models/User';
import DailyLog from '../models/DailyLog';
import { userSchema } from '../config/swagger';

export class UserService {
  async createUser(data: any) {
    const validatedData = userSchema.parse(data);
    const user = new User(validatedData);
    return user.save();
  }

  async getUserById(id: string) {
    return User.findById(id);
  }

  async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }

  async getAllUsers() {
    const users = await User.find().lean();

    const usersWithLog = await Promise.all(
      users.map(async (user) => {
        const latestLog = await DailyLog.findOne({ patient: user._id })
          .sort({ date: -1 })
          .lean();

        return {
          ...user,
          latestLog: latestLog ?? null,
        };
      })
    );

    return usersWithLog;
  }
}
