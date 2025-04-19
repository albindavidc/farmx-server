import express from "express";
import { container } from "../container/Inversify.config";
import { UserController } from "../controllers/User.controller";
import { TYPES } from "../container/Types";
import { uploadProfilePhoto } from "../middlewares/Multer";
import { authenticate, authorize } from "../middlewares/Auth.middleware";

const router = express.Router();

const userController: UserController = container.get<UserController>(TYPES.UserController);

router.post(
  "/settings/profile-photo-upload",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  uploadProfilePhoto,
  userController.uploadProfilePhoto.bind(userController)
);
router.post(
  "/settings/get-profile-photo",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  userController.getProfilePhoto.bind(userController)
);

export default router;
