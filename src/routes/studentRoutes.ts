import { Router } from "express";
import StudentController from "../controller/studentController";
import { roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const studentController = new StudentController();

// Student-only routes
router.get("/profile", roleCheckMiddleware([Role.STUDENT]), studentController.getProfile);
router.put("/profile", roleCheckMiddleware([Role.STUDENT]), studentController.updateProfile);
router.put("/guardian", studentController.addOrUpdateGuardian);
router.get("/guardian", studentController.getGuardian);
router.get("/current-class-and-subjects", studentController.getCurrentClassAndSubjects)
export { router as studentRoutes };