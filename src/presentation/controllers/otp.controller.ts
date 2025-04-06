import { GenerateOtpCommand } from "../../application/use-cases/commands/GenerateOtp.command";
import { VerifyOtpCommand } from "../../application/use-cases/commands/VerifyOtp.command";

export class OtpController {
  constructor(
    public generateOtp: GenerateOtpCommand,
    public verifyOtp: VerifyOtpCommand
  ) {}
}
