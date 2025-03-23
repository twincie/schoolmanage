import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import Guardian from "../entity/guardian";

export default class GuardianService {
  private guardianRepository = AppDataSource.getRepository(Guardian);

  // Create a guardian
  async createGuardian(data: { name: string; contact: string; relationship?: string }) {
    const guardian = this.guardianRepository.create(data);
    return await this.guardianRepository.save(guardian);
  }

  // Get all guardians
  async getAllGuardians() {
    return await this.guardianRepository.find({ where: { deletedAt: IsNull() } });
  }

  // Get a guardian by ID
  async getGuardianById(id: number) {
    return await this.guardianRepository.findOne({ where: { id, deletedAt: IsNull() } });
  }

  // Update a guardian
  async updateGuardian(id: number, data: { name?: string; contact?: string; relationship?: string }) {
    const guardian = await this.guardianRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!guardian) {
      throw new Error("Guardian not found");
    }

    Object.assign(guardian, data);
    return await this.guardianRepository.save(guardian);
  }

  // Soft delete a guardian
  async deleteGuardian(id: number) {
    const guardian = await this.guardianRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!guardian) {
      throw new Error("Guardian not found");
    }

    await this.guardianRepository.softRemove(guardian);
    return { message: "Guardian deleted successfully" };
  }
}