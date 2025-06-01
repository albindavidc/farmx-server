import express from "express";
import { container } from "../container/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../container/types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
const userController: UserController = container.get<UserController>(TYPES.UserController);

router.get("/admin/get-users", authenticate, userController.getUsers.bind(userController));
router.put("/admin/:id", authenticate, userController.updateUser.bind(userController));
router.post("/admin/create-user", authenticate, userController.createUser.bind(userController));
router.put("/admin/block-user/:id", authenticate, userController.blockUser.bind(userController));

export default router;
