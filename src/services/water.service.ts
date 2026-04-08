import WaterLog from '../models/WaterLog';
import { waterLogSchema } from '../config/swagger';

export class WaterService {
  async logWater(data: any) {
    // Valida o payload usando o Zod
    const validatedData = waterLogSchema.parse(data);

    // Salva no banco
    const waterLog = new WaterLog({
      userId: validatedData.userId,
      amountMl: validatedData.amountMl,
      loggedAt: validatedData.loggedAt ? new Date(validatedData.loggedAt) : new Date(),
    });
    return waterLog.save();
  }
}
