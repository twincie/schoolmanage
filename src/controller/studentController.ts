import { Request, Response } from "express";
import StudentService from "../services/studentService";
import { extractUserIdFromToken } from "../utils/jwtUtils";

export default class StudentController {
  private studentService = new StudentService();

  // Get student's profile
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
      const user = await this.studentService.getProfile(Number(userId));
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Update student's profile
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
      const user = await this.studentService.updateProfile(Number(userId), { username, email });
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Add/Update Guardian for a Student
  addOrUpdateGuardian = async (req: Request, res: Response): Promise<void> => {
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
      const guardian = await this.studentService.addOrUpdateGuardian(Number(userId), { name, contact, relationship });
      res.status(200).json(guardian);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // Get Guardian for a Student
  getGuardian = async (req: Request, res: Response): Promise<void> => {
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
      const guardian = await this.studentService.getGuardian(Number(userId));
      res.status(200).json(guardian);
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
        const result = await this.studentService.getCurrentClassAndSubjects(Number(userId));
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : "An error occurred" });
    }
};
}