import { VerifyOtpCommand } from "@application/commands/auth/verify-otp.command.js";
import { OtpResponseDto } from "@application/dtos/otp.dto.js";

export interface IVerifyOtp {
  execute(command: VerifyOtpCommand): Promise<OtpResponseDto>;
}
