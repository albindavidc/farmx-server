import express from "express";
import AuthController from "../controllers/Auth.controller";
import OtpController from "../controllers/Otp.controller";
import { container } from "../container/Inversify.config";
import { TYPES } from "../container/Types";
import rateLimit from "express-rate-limit";

const router = express.Router();

/* Resolve controllers from the container */
const otpController: OtpController = container.get<OtpController>(TYPES.OtpController);
const authController: AuthController = container.get<AuthController>(TYPES.AuthController);

/* Refresh Rate limiter to prevent brute force attacks */
const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
});

/* Routes */
router.post("/signup", authController.signup.bind(authController));
router.post("/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post("/verify-otp", otpController.verifyOtpHandler.bind(otpController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh", refreshLimiter, authController.refreshToken.bind(authController));
router.post("/logout", authController.logout.bind(authController));

export default router;
