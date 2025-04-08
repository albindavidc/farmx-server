import express from "express";
import AuthController from "../controllers/Auth.controller";
import OtpController from "../controllers/Otp.controller";
import { container } from "../container/Inversify.config";
import refresh from "../middlewares/RefreshAuth.middleware";

export function createAuthRoutes(): express.Router {
  const router = express.Router();
  //Resolve controllers from the container
  const otpController: OtpController =
    container.get<OtpController>("OtpController");
  const authController: AuthController =
    container.get<AuthController>("AuthController");

  //Routes
  router.post("/signup", authController.signup.bind(authController));
  router.post(
    "/send-otp",
    otpController.generateOtpHandler.bind(otpController)
  );
  router.post(
    "/resend-otp",
    otpController.resendOtpHandler.bind(otpController)
  );
  router.post(
    "/verify-otp",
    otpController.verifyOtpHandler.bind(otpController)
  );
  router.post("/refresh", refresh);

  return router;
}
