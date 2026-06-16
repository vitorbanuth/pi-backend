import { Patient } from "../models/Patient";

export class PatientService {
  async getAllPatients() {
    return Patient.find().sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return Patient.findById(id);
  }

  async createPatient(data: any) {
    return Patient.create(data);
  }

  async updatePatient(id: string, data: any) {
    return Patient.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deletePatient(id: string) {
    return Patient.findByIdAndDelete(id);
  }
}
