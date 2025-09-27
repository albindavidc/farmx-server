import express from "express";
import AuthController from "../controllers/auth.controller";
import OtpController from "../controllers/otp.controller";
import { container } from "../container/inversify.config";
import { TYPES } from "../container/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

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
  authMiddleware.rateLimitMiddleware.bind(authMiddleware),
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
