import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";

export const createAuthRoutes = (
  authController: AuthController
) => {
  const router = express.Router();

  router.post(
    "/register",
    [
      body("name")
        .notEmpty()
        .withMessage("Name is required"),
      body("email").isEmail().withMessage("Invalid email"),
      body("phone")
        .notEmpty()
        .withMessage("Phone is required"),
      body("password")
        .isLength({ min: 6 })
        .withMessage(
          "Password must be at least 6 characters"
        ),
    ],
    validateRequest,
    authController.register.bind(authController)
  );

  router.post(
    "/verify-otp",
    [
      body("userId")
        .notEmpty()
        .withMessage("User ID is required"),
      body("code")
        .notEmpty()
        .withMessage("OTP code is required"),
    ],
    validateRequest,
    authController.verifyOtp.bind(authController)
  );
};
