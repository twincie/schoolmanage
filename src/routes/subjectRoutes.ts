import { Router } from "express";
import SubjectController from "../controller/subjectController";
import { roleCheckMiddleware } from "../middleware/authMiddleware";
import Role from "../enum/role";

const router = Router();
const subjectController = new SubjectController();

router.post("/single", roleCheckMiddleware([Role.ADMIN, Role.TEACHER]), subjectController.createSubject);
router.post("/bulk", roleCheckMiddleware([Role.ADMIN, Role.TEACHER]), subjectController.createSubjects);
router.post("/:subjectId/teachers", roleCheckMiddleware([Role.ADMIN]), subjectController.assignTeachers);
router.delete("/:subjectId", roleCheckMiddleware([Role.ADMIN]), subjectController.deleteSubject);
export {router as subjectRoutes};