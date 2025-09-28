// user.settings.routes.ts
import express from "express";
import { TYPES } from "@presentation/container/types.js";
import { container } from "@presentation/container/inversify.config.js";
import OtpController from "@presentation/controllers/otp.controller.js";
import { UserController } from "@presentation/controllers/user.controller.js";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware.js";
import { uploadProfilePhoto } from "@presentation/middlewares/multer.js";

const router = express.Router();

const userController = container.get<UserController>(TYPES.UserController);
const otpController = container.get<OtpController>(TYPES.OtpController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

// Common middleware chain for all settings routes
const settingsAuth = [
  authMiddleware.authenticate,
  authMiddleware.authorize(["user", "farmer", "admin"])
];

router.post(
  "/settings/profile-photo-upload",
  ...settingsAuth,
  uploadProfilePhoto,
  userController.uploadProfilePhoto.bind(userController)
);

router.get(
  "/settings/get-profile-photo",
  ...settingsAuth,
  userController.getProfilePhoto.bind(userController)
);

router.patch(
  "/settings/update-profile",
  ...settingsAuth,
  userController.updateProfile.bind(userController)
);

router.post(
  "/settings/change-password",
  ...settingsAuth,
  userController.changePassword.bind(userController)
);

router.post(
  "/settings/validate-old-password",
  ...settingsAuth,
  userController.validateOldPassword.bind(userController)
);

router.post(
  "/settings/send-otp",
  ...settingsAuth,
  otpController.generateOtpHandler.bind(otpController)
);

router.post(
  "/settings/verify-otp",
  ...settingsAuth,
  otpController.profileVerifyOtpHandler.bind(otpController)
);

router.post(
  "/settings/resend-otp",
  ...settingsAuth,
  otpController.resendOtpHandler.bind(otpController)
);

export default router;