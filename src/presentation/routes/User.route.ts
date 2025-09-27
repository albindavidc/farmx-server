import express from "express";
import { container } from "../container/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../container/types";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware";

const router = express.Router();
const userController: UserController = container.get<UserController>(TYPES.UserController);
const { authenticate, authorize, rateLimit } = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

router.get(
  "/admin/get-users",
  authenticate,
  authorize(["admin"]),
  userController.getUsers.bind(userController)
);
router.put(
  "/admin/:id",
  authenticate,
  authorize(["admin"]),
  userController.updateUser.bind(userController)
);
router.post(
  "/admin/create-user",
  authenticate,
  authorize(["admin"]),
  rateLimit,
  userController.createUser.bind(userController)
);
router.put(
  "/admin/block-user/:id",
  authenticate,
  authorize(["admin"]),
  userController.blockUser.bind(userController)
);

export default router;
