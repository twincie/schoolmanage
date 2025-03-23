import { Request, Response } from "express";
import TeacherService from "../services/teacherService";
import { extractUserIdFromToken } from "../utils/jwtUtils";

export default class TeacherController {
  private teacherService = new TeacherService();

  // Get teacher's profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    try {
      const user = await this.teacherService.getProfile(Number(userId));
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Update teacher's profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    const { username, email } = req.body;

    try {
      const user = await this.teacherService.updateProfile(Number(userId), { username, email });
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Add/Update Next of Kin for a Teacher
  addOrUpdateNextOfKin = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    const { name, contact, relationship } = req.body;

    try {
      const nextOfKin = await this.teacherService.addOrUpdateNextOfKin(Number(userId), { name, contact, relationship });
      res.status(200).json(nextOfKin);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Get Next of Kin for a Teacher
  getNextOfKin = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    try {
      const nextOfKin = await this.teacherService.getNextOfKin(Number(userId));
      res.status(200).json(nextOfKin);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  getCurrentClassAndSubjects = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    // Extract userId from the token
    const userId = extractUserIdFromToken(token);
    if (!userId) {
        res.status(401).json({ message: "Invalid or expired token." });
        return;
    }

    try {
        const result = await this.teacherService.getCurrentClassAndSubjects(Number(userId));
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : "An error occurred" });
    }
};
}