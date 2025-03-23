import { Router } from "express";
import TeacherController from "../controller/teachersController";
import {roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const teacherController = new TeacherController();

// Teacher-only routes
router.get("/profile", roleCheckMiddleware([Role.TEACHER]), teacherController.getProfile);
router.put("/profile", roleCheckMiddleware([Role.TEACHER]), teacherController.updateProfile);
router.put("/next-of-kin", teacherController.addOrUpdateNextOfKin);
router.get("/next-of-kin", teacherController.getNextOfKin);
router.get("/current-class-and-subjects", teacherController.getCurrentClassAndSubjects);
export { router as teacherRoutes };