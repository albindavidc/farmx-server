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

export class OtpController {
  constructor(
    public generateOtp: GenerateOtpCommand,
    public verifyOtp: VerifyOtpCommand
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
}

export default OtpController;
