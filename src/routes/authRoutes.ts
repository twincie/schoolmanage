import { Router } from "express";
import AuthController from "../controller/authController";

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.post('/validateToken', authController.validateToken);

export {router as authRoutes};