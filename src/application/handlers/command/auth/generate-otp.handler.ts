import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { OtpRequestDto, OtpResponseDto } from "@application/dtos/otp.dto.js";
import { IGenerateOtp } from "@application/interfaces/command/auth/generate-otp.interface.js";
import { GenerateNewOtp } from "@application/utils/generate-otp.js";
import { IEmailRepository } from "@domain/interfaces/email-repository.interface.js";
import { IOTPRepository } from "@domain/interfaces/otp-repository.interface.js";

@injectable()
export class GenerateOtpHandler implements IGenerateOtp {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.EmailRepository) private emailService: IEmailRepository
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
