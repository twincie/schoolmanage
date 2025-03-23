import { Router } from "express";
import ClassController from "../controller/classController";
import { roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const classController = new ClassController();

router.post("/single", roleCheckMiddleware([Role.ADMIN]), classController.createClass);
router.post("/bulk", roleCheckMiddleware([Role.ADMIN]), classController.createClasses);
router.post("/:classId/subjects", roleCheckMiddleware([Role.ADMIN]), classController.assignSubjects);
router.post("/:classId/students", roleCheckMiddleware([Role.ADMIN]), classController.assignStudents);
router.put("/:classId/teachers", roleCheckMiddleware([Role.ADMIN]), classController.updateClassTeachers);
router.get("/:classId", roleCheckMiddleware([Role.ADMIN,Role.STUDENT,Role.TEACHER]), classController.getClassDetails);
router.delete("/:classId", roleCheckMiddleware([Role.ADMIN]), classController.deleteClass);

export {router as classRoutes};