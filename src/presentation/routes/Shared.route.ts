import express from "express";
import { container } from "../container/Inversify.config";
import { UserController } from "../controllers/User.controller";
import { TYPES } from "../container/Types";
import { uploadProfilePhoto } from "../middlewares/Multer";
import { authenticate, authorize } from "../middlewares/Auth.middleware";
import OtpController from "../controllers/Otp.controller";

const router = express.Router();

const userController: UserController = container.get<UserController>(TYPES.UserController);
const otpController: OtpController = container.get<OtpController>(TYPES.OtpController);

router.post(
  "/settings/profile-photo-upload",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  uploadProfilePhoto,
  userController.uploadProfilePhoto.bind(userController)
);
router.get(
  "/settings/get-profile-photo",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  userController.getProfilePhoto.bind(userController)
);
router.patch(
  "/settings/update-profile",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  userController.updateProfile.bind(userController)
);
router.post(
  "/settings/change-password",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  userController.changePassword.bind(userController)
);

router.post(
  "/settings/validate-old-password",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  userController.validateOldPassword.bind(userController)
);

router.post(
  "/settings/send-otp",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  otpController.generateOtpHandler.bind(otpController)
);

router.post(
  "/settings/verify-otp",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  otpController.profileVerifyOtpHandler.bind(otpController)
);

router.post(
  "/settings/resend-otp",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  otpController.resendOtpHandler.bind(otpController)
);

export default router;
