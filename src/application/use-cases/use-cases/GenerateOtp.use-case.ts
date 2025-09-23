import { inject, injectable } from "inversify";
import { EmailService } from "../../../domain/interfaces/repositories/email.service";
import { OTPRepository } from "../../../domain/interfaces/repositories/otp.repository";
import { TYPES } from "../../../presentation/container/types";
import { GenerateNewOtp } from "../../utils/GenerateOtp";
import { OtpRequestDto, OtpResponseDto } from "../dto/Otp.dto";

@injectable()
export class GenerateOtpUseCase {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: OTPRepository,
    @inject(TYPES.EmailService) private emailService: EmailService
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
