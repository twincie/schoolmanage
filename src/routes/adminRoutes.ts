import { Router } from "express";
import AdminController from "../controller/adminController";
import { roleCheckMiddleware } from "../middleware/authMiddleware"; // Use roleCheckMiddleware
import Role from "../enum/role";

const router = Router();
const adminController = new AdminController();

// Admin-only routes
router.get("/users", roleCheckMiddleware([Role.ADMIN]), adminController.getAllUsers); // Get all users
router.get("/users/:id", roleCheckMiddleware([Role.ADMIN]), adminController.getUserById); // Get user by ID
router.put("/users/:id", roleCheckMiddleware([Role.ADMIN]), adminController.updateUser); // Update user by ID
router.delete("/users/:id", roleCheckMiddleware([Role.ADMIN]), adminController.deleteUser); // Delete user by ID
router.get("/profile", roleCheckMiddleware([Role.ADMIN]), adminController.getProfile); // Get admin's profile
router.put("/profile", roleCheckMiddleware([Role.ADMIN]), adminController.updateProfile); // Update admin's profile

export { router as adminRoutes };