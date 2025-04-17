import express from "express";
import { authenticate, authorize } from "../middlewares/Auth.middleware";
import AuthController from "../controllers/Auth.controller";
import { container } from "../container/Inversify.config";
import { TYPES } from "../container/Types";

const router = express.Router();

const authController: AuthController = container.get<AuthController>(TYPES.AuthController);

router.get(
  "/",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  authController.getCurrentUser.bind(authController)
);

export default router;
