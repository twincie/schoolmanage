import { Request, Response } from "express";
import GuardianService from "../services/guardianService";

export default class GuardianController {
  private guardianService = new GuardianService();

  // Create a guardian
  createGuardian = async (req: Request, res: Response) => {
    const { name, contact, relationship } = req.body;
    const response = await this.guardianService.createGuardian({ name, contact, relationship });
    res.status(201).json(response);
  };

  // Get all guardians
  getAllGuardians = async (req: Request, res: Response) => {
    const response = await this.guardianService.getAllGuardians();
    res.status(200).json(response);
  };

  // Get a guardian by ID
  getGuardianById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.guardianService.getGuardianById(Number(id));
    res.status(200).json(response);
  };

  // Update a guardian
  updateGuardian = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, contact, relationship } = req.body;
    const response = await this.guardianService.updateGuardian(Number(id), { name, contact, relationship });
    res.status(200).json(response);
  };

  // Soft delete a guardian (admin-only)
  deleteGuardian = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.guardianService.deleteGuardian(Number(id));
    res.status(200).json(response);
  };
}