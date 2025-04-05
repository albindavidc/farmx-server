import { OTPRepository } from "../../../domain/interfaces/repositories/Otp.repository";
import { EmailService } from "../../../domain/interfaces/services/email.service";
import { GenerateNewOtp } from "../../../shared/utils/GenerateOtp";
import { OtpRequestDto, OtpResponseDto } from "../dto/Otp.dto";

export class GenerateOtpCommand {
  constructor(
    private otpRepository: OTPRepository,
    private emailService: EmailService
  ) {}

  public async execute(dto: OtpRequestDto): Promise<OtpResponseDto> {
    const newSecret = GenerateNewOtp.generateSecret();
    const otp = GenerateNewOtp.generateOtp(newSecret);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const email = dto.email;

    await this.otpRepository.create({
      email: dto.email,
      otp,
      expiresAt,
    });
    await this.emailService.sendOtpEmail(dto.email, otp);

    return { email, otp, isVerified: false };
  }
}
