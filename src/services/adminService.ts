import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import User from "../entity/user";

export default class AdminService {
  private userRepository = AppDataSource.getRepository(User);

  // Get all non-deleted users
  async getAllUsers() {
    try {
      return await this.userRepository.find({ where: { deletedAt: IsNull() } });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  // Get a non-deleted user by ID
  async getUserById(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  }

  // Update a user by ID
  async updateUser(id: number, data: { username?: string; email?: string; role?: string }) {
    try {
      const user = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
      if (user) {
        user.username = data.username || user.username;
        user.email = data.email || user.email;
        user.role = data.role || user.role;
        await this.userRepository.save(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  // Soft delete a user by ID
  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
      if (user) {
        await this.userRepository.softRemove(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  // Get a user's profile by ID
  async getProfile(userId: number) {
    try {
      return await this.userRepository.findOne({ where: { id: userId, deletedAt: IsNull() } });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch profile");
    }
  }

  // Update a user's profile by ID
  async updateProfile(userId: number, data: { username?: string; email?: string }) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId, deletedAt: IsNull() } });
      if (user) {
        user.username = data.username || user.username;
        user.email = data.email || user.email;
        await this.userRepository.save(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  }
}