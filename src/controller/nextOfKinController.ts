import { Request, Response } from "express";
import NextOfKinService from "../services/nextOfKinService";

export default class NextOfKinController {
  private nextOfKinService = new NextOfKinService();

  // Create a next of kin
  createNextOfKin = async (req: Request, res: Response) => {
    const { name, contact, relationship } = req.body;
    const response = await this.nextOfKinService.createNextOfKin({ name, contact, relationship });
    res.status(201).json(response);
  };

  // Get all next of kin
  getAllNextOfKin = async (req: Request, res: Response) => {
    const response = await this.nextOfKinService.getAllNextOfKin();
    res.status(200).json(response);
  };

  // Get a next of kin by ID
  getNextOfKinById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.nextOfKinService.getNextOfKinById(Number(id));
    res.status(200).json(response);
  };

  // Update a next of kin
  updateNextOfKin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, contact, relationship } = req.body;
    const response = await this.nextOfKinService.updateNextOfKin(Number(id), { name, contact, relationship });
    res.status(200).json(response);
  };

  // Soft delete a next of kin (admin-only)
  deleteNextOfKin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.nextOfKinService.deleteNextOfKin(Number(id));
    res.status(200).json(response);
  };
}