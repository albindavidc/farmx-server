import { StatusCodes } from "http-status-codes";
import { GenerateOtpCommand } from "../../application/use-cases/commands/GenerateOtp.command";
import { VerifyOtpCommand } from "../../application/use-cases/commands/VerifyOtp.command";
import sendResponseJson from "../../application/utils/Message";
import { Request, Response } from "express";
import OtpService from "../../application/services/OtpService";
import {
  OtpRequestDto,
  OtpResponseDto,
} from "../../application/use-cases/dto/Otp.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/Types";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.GenerateOtp) private generateOtp: GenerateOtpCommand,
    @inject(TYPES.VerifyOtp) private verifyOtp: VerifyOtpCommand
  ) {}

  public async generateOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body as OtpRequestDto;
    if (!email) {
      sendResponseJson(
        res,
        StatusCodes.BAD_REQUEST,
        "Email address is required",
        false
      );
      return;
    }

    try {
      const otpResponse: OtpResponseDto = await this.generateOtp.execute({
        email,
      });
      if (!otpResponse.otp) {
        throw new Error("OTP was not generated");
      }
      await OtpService.sendOtpEmail(email, otpResponse.otp);
      sendResponseJson(
        res,
        StatusCodes.OK,
        "OTP generated successfully.",
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error generating OTP";

      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        false
      );
    }
  }

  public async resendOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body as OtpRequestDto;
    if (!email) {
      sendResponseJson(
        res,
        StatusCodes.BAD_REQUEST,
        "Email is required",
        false
      );
      return;
    }

    try {
      const otpResponse: OtpResponseDto = await this.generateOtp.execute({
        email,
      });
      if (!otpResponse.otp) {
        throw new Error("Otp was not generated");
      }
      await OtpService.sendOtpEmail(email, otpResponse.otp);
      sendResponseJson(res, StatusCodes.OK, "OTP resend successfull", true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error resending Otp";
      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        false
      );
    }
  }

  public async verifyOtpHandler(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body as OtpRequestDto;
    if (!email || !otp) {
      sendResponseJson(
        res,
        StatusCodes.BAD_REQUEST,
        "Email and OTP are required",
        false
      );
    }

    try {
      const otpRequest: OtpRequestDto = { email, otp };
      const isValid = await this.verifyOtp.execute(otpRequest);
      if (isValid) {
        sendResponseJson(
          res,
          StatusCodes.OK,
          "OTP verified successfully.",
          true
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error verifying OTP";
      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        false
      );
    }
  }
}

export default OtpController;
