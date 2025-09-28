import express from "express";

import { TYPES } from "@presentation/container/types.js";
import { container } from "@presentation/container/inversify.config.js";
import AuthController from "@presentation/controllers/auth.controller.js";
import OtpController from "@presentation/controllers/otp.controller.js";
import { UserController } from "@presentation/controllers/user.controller.js";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware.js";

const router = express.Router();

/* Resolve controllers from the container */
const otpController: OtpController = container.get<OtpController>(TYPES.OtpController);
const authController: AuthController = container.get<AuthController>(TYPES.AuthController);
const userController: UserController = container.get<UserController>(TYPES.UserController);
const authMiddleware: AuthMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

/* Auth Routes */
router.post("/signup", authController.signup.bind(authController));
router.post("/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post("/verify-otp", otpController.verifyOtpHandler.bind(otpController));
router.post(
  "/login",
  authMiddleware.rateLimit.bind(authMiddleware),
  authController.login.bind(authController)
);
router.post("/logout", authController.logout.bind(authController));

router.post("/refresh-access-token", authController.refreshToken.bind(authController));
router.get(
  "/user",
  authMiddleware.authenticate,
  authMiddleware.authorize(["user", "farmer", "admin"]),
  authController.getCurrentUser.bind(authController)
);

/* Forgot-Password Routes */
router.post("/forgot-password/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/forgot-password/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post(
  "/forgot-password/verify-otp",
  otpController.profileVerifyOtpHandler.bind(otpController)
);
router.post(
  "/forgot-password/change-password",
  userController.loginChangePassword.bind(userController)
);

export default router;
