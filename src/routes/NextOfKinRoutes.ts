import { Router } from "express";
import NextOfKinController from "../controller/nextOfKinController";
import { roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const nextOfKinController = new NextOfKinController();

// Create a next of kin
router.post("/next-of-kin", nextOfKinController.createNextOfKin);

// Get all next of kin
router.get("/next-of-kin", nextOfKinController.getAllNextOfKin);

// Get a next of kin by ID
router.get("/next-of-kin/:id", nextOfKinController.getNextOfKinById);

// Update a next of kin
router.put("/next-of-kin/:id", nextOfKinController.updateNextOfKin);

// Soft delete a next of kin (admin-only)
router.delete("/next-of-kin/:id", roleCheckMiddleware([Role.ADMIN]), nextOfKinController.deleteNextOfKin);

export { router as nextOfKinRoutes };