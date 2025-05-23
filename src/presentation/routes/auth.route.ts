import express from "express";
import AuthController from "../controllers/auth.controller";
import OtpController from "../controllers/otp.controller";
import { container } from "../container/inversify.config";
import { TYPES } from "../container/types";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

/* Resolve controllers from the container */
const otpController: OtpController = container.get<OtpController>(TYPES.OtpController);
const authController: AuthController = container.get<AuthController>(TYPES.AuthController);
const userController: UserController = container.get<UserController>(TYPES.UserController);

// /* Refresh Rate limiter to prevent brute force attacks */
// const refreshLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 3,
// });

/* Routes */
router.post("/signup", authController.signup.bind(authController));
router.post("/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post("/verify-otp", otpController.verifyOtpHandler.bind(otpController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));

router.post(
  "/refresh-access-token",
  // refreshLimiter,
  // authenticate,
  authController.refreshToken.bind(authController)
);
router.get(
  "/user",
  authenticate,
  authorize(["user", "farmer", "admin"]),
  authController.getCurrentUser.bind(authController)
);

/* Forgot-Password */
router.post("/auth/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/auth/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post("/auth/verify-otp", otpController.profileVerifyOtpHandler.bind(otpController));
router.post("/auth/change-password", userController.changePassword.bind(userController));

export default router;
