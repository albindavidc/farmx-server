import { StatusCodes } from "http-status-codes";
import { GenerateOtpCommand } from "../../application/use-cases/commands-handler/GenerateOtp.command";
import { VerifyOtpCommand } from "../../application/use-cases/commands-handler/VerifyOtp.command";
import sendResponseJson from "../../application/utils/Message";
import { Request, Response } from "express";
import { OtpRequestDto, OtpResponseDto } from "../../application/use-cases/dto/Otp.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/Types";
import { EmailService } from "../../domain/interfaces/services/Email.service";
import { AuthService } from "../../application/services/Auth.service";
import { Email } from "../../domain/value-objects/Email.vo";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.GenerateOtpCommand) private generateOtp: GenerateOtpCommand,
    @inject(TYPES.VerifyOtpCommand) private verifyOtp: VerifyOtpCommand,
    @inject(TYPES.EmailService) private emailService: EmailService,
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
      await this.emailService.sendOtpEmail(email, otpResponse.otp);
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
      await this.emailService.sendOtpEmail(email, otpResponse.otp);
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
        secure: process.env.NOCE_ENV === "production",
        sameSite: "strict",
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
}

export default OtpController;
