import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import NextOfKin from "../entity/nextOfKin";

export default class NextOfKinService {
  private nextOfKinRepository = AppDataSource.getRepository(NextOfKin);

  // Create a next of kin
  async createNextOfKin(data: { name: string; contact: string; relationship?: string }) {
    const nextOfKin = this.nextOfKinRepository.create(data);
    return await this.nextOfKinRepository.save(nextOfKin);
  }

  // Get all next of kin
  async getAllNextOfKin() {
    return await this.nextOfKinRepository.find({ where: { deletedAt: IsNull() } });
  }

  // Get a next of kin by ID
  async getNextOfKinById(id: number) {
    return await this.nextOfKinRepository.findOne({ where: { id, deletedAt: IsNull() } });
  }

  // Update a next of kin
  async updateNextOfKin(id: number, data: { name?: string; contact?: string; relationship?: string }) {
    const nextOfKin = await this.nextOfKinRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!nextOfKin) {
      throw new Error("Next of kin not found");
    }

    Object.assign(nextOfKin, data);
    return await this.nextOfKinRepository.save(nextOfKin);
  }

  // Soft delete a next of kin
  async deleteNextOfKin(id: number) {
    const nextOfKin = await this.nextOfKinRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!nextOfKin) {
      throw new Error("Next of kin not found");
    }

    await this.nextOfKinRepository.softRemove(nextOfKin);
    return { message: "Next of kin deleted successfully" };
  }
}