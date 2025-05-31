import express from "express";
import { container } from "../container/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../container/types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
const userController: UserController = container.get<UserController>(TYPES.UserController);

router.get("/admin/get-users", authenticate, userController.getUsers.bind(userController));
router.put("/admin/:id", userController.updateUser.bind(userController));
router.put("/admin/block-user/:id", userController.blockUser.bind(userController));

export default router;
