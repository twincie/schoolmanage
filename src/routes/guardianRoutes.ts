import { Router } from "express";
import GuardianController from "../controller/guardianController";
import { roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const guardianController = new GuardianController();

// Create a guardian
router.post("/guardians", guardianController.createGuardian);

// Get all guardians
router.get("/guardians", guardianController.getAllGuardians);

// Get a guardian by ID
router.get("/guardians/:id", guardianController.getGuardianById);

// Update a guardian
router.put("/guardians/:id", guardianController.updateGuardian);

// Soft delete a guardian (admin-only)
router.delete("/guardians/:id", roleCheckMiddleware([Role.ADMIN]), guardianController.deleteGuardian);

export { router as guardianRoutes };