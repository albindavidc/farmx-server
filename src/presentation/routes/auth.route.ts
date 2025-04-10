import express from "express";
import AuthController from "../controllers/Auth.controller";
import OtpController from "../controllers/Otp.controller";
import { container } from "../container/Inversify.config";
import refreshToken from "../middlewares/RefreshAuth.middleware";
import { TYPES } from "../container/Types";

const router = express.Router();
//Resolve controllers from the container
const otpController: OtpController = container.get<OtpController>(TYPES.OtpController);
const authController: AuthController = container.get<AuthController>(TYPES.AuthController);

//Routes
router.post("/signup", authController.signup.bind(authController));
router.post("/send-otp", otpController.generateOtpHandler.bind(otpController));
router.post("/resend-otp", otpController.resendOtpHandler.bind(otpController));
router.post("/verify-otp", otpController.verifyOtpHandler.bind(otpController));
router.post("/refresh", refreshToken);

export default router;
