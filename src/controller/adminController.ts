import { Request, Response } from "express";
import AdminService from "../services/adminService";
import { extractUserIdFromToken } from "../utils/jwtUtils";

export default class AdminController {
  private adminService = new AdminService();

  // Get all users (admin-only)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const response = await this.adminService.getAllUsers();
    res.status(200).json(response);
  }

  // Get a user by ID (admin-only)
    getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this.adminService.getUserById(Number(id));
    res.status(200).json(response);
  }

  // Update a user by ID (admin-only)
  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const response = await this.adminService.updateUser(Number(id), { username, email, role });
    res.status(200).json(response);
  }

  // Soft delete a user by ID (admin-only)
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this.adminService.deleteUser(Number(id));
    res.status(200).json(response);
  }

  // Get admin's profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ status: "99", message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ status: "99", message: "Unauthorized" });
      return;
    }

    const response = await this.adminService.getProfile(Number(userId));
    res.status(200).json(response);
  }

  // Update admin's profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ status: "99", message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ status: "99", message: "Unauthorized" });
      return;
    }

    const { username, email } = req.body;
    const response = await this.adminService.updateProfile(Number(userId), { username, email });
    res.status(200).json(response);
  }
}