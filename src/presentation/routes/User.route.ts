// user.admin.routes.ts
import express from "express";
import { TYPES } from "@presentation/container/types.js";
import { container } from "@presentation/container/inversify.config.js";
import { UserController } from "@presentation/controllers/user.controller.js";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware.js";

const router = express.Router();

const userController = container.get<UserController>(TYPES.UserController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

/* Common admin middleware */
const adminAuth = [authMiddleware.authenticate, authMiddleware.authorize(["admin"])];

/* Routes */
router.get("/admin/get-users", ...adminAuth, userController.getUsers.bind(userController));
router.put("/admin/:id", ...adminAuth, userController.updateUser.bind(userController));
router.post(
  "/admin/create-user",
  ...adminAuth,
  authMiddleware.rateLimit,
  userController.createUser.bind(userController)
);

router.put("/admin/block-user/:id", ...adminAuth, userController.blockUser.bind(userController));

export default router;
