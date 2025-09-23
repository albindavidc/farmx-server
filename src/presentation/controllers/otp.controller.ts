import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { OtpRequestDto, OtpResponseDto } from "@application/dto/otp.dto";
import { EmailRepository } from "@domain/repositories/email.repository";
import { GenerateOtpHandler } from "@application/handlers/command/auth/generate-otp.handler";
import { VerifyOtpHandler } from "@application/handlers/command/auth/verify-otp.handler";
import sendResponseJson from "@application/utils/message";
import { Email } from "@domain/value-objects/email.vo";
import { AuthService } from "@infrastructure/services/auth.service";
import { TYPES } from "@presentation/container/types";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.GenerateOtpHandler) private generateOtp: GenerateOtpHandler,
    @inject(TYPES.VerifyOtpHandler) private verifyOtp: VerifyOtpHandler,
    @inject(TYPES.EmailRepository) private EmailRepository: EmailRepository,
    @inject(TYPES.AuthService) private authService: AuthService
  ) {}

  public async generateOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body as OtpRequestDto;
    if (!email) {
      sendResponseJson(res, StatusCodes.BAD_REQUEST, "Email address is required", false);
      return;
    }

    try {
      const otpResponse: OtpResponseDto = await this.generateOtp.execute({
        email,
      });
      if (!otpResponse.otp) {
        throw new Error("OTP was not generated");
      }
      await this.EmailRepository.sendOtpEmail(email, otpResponse.otp);
      sendResponseJson(res, StatusCodes.OK, "OTP generated successfully.", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error generating OTP";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  public async resendOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body as OtpRequestDto;
    if (!email) {
      sendResponseJson(res, StatusCodes.BAD_REQUEST, "Email is required", false);
      return;
    }

    try {
      const otpResponse: OtpResponseDto = await this.generateOtp.execute({
        email,
      });
      if (!otpResponse.otp) {
        throw new Error("Otp was not generated");
      }
      await this.EmailRepository.sendOtpEmail(email, otpResponse.otp);
      sendResponseJson(res, StatusCodes.OK, "OTP resend successfull", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error resending Otp";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  public async verifyOtpHandler(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body as OtpRequestDto;
    if (!email || !otp) {
      sendResponseJson(res, StatusCodes.BAD_REQUEST, "Email and OTP are required", false);
    }

    try {
      const otpRequest: OtpRequestDto = { email, otp };
      const isValid = await this.verifyOtp.execute(otpRequest);

      // Issue tokens upon signup
      const newEmail = Email.create(email);
      const { user, accessToken, refreshToken } = await this.authService.verifyOtp(newEmail);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });

      res.setHeader("Authorization", `Bearer ${accessToken}`);

      if (isValid) {
        res.status(200).json({ user, accessToken, refreshToken });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error verifying OTP";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  public async profileVerifyOtpHandler(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body as OtpRequestDto;
    if (!email || !otp) {
      sendResponseJson(res, StatusCodes.BAD_REQUEST, "Email or Otp is invalid", false);
    }
    try {
      const otpRequest: OtpRequestDto = { email, otp };
      const isValid = await this.verifyOtp.execute(otpRequest);

      if (!isValid) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "Entered a wrong otp", false);
      }

      sendResponseJson(res, StatusCodes.OK, "Email verification successful", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error verifying OTP";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}

export default OtpController;
