import { OTPRepository } from "../../../domain/interfaces/repositories/Otp.repository";
import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { Email } from "../../../domain/value-objects/Email.vo";
import { OtpRequestDto, OtpResponseDto } from "../dto/Otp.dto";
import { InvalidOtpException } from "../exceptions/InvalidOtp.exception";
import { UserNotFoundException } from "../exceptions/UserNotFound.exception";

export class VerifyOtpCommand {
  constructor(
    private otpRepository: OTPRepository,
    private userRepository: UserRepository
  ) {}

  public async execute(dto: OtpRequestDto): Promise<OtpResponseDto> {
    const record = await this.otpRepository.findByEmail(dto.email);
    if (!record || record.otp !== dto.otp || record.expiresAt < new Date()) {
      throw new InvalidOtpException();
    }
    await this.otpRepository.deleteByEmail(dto.email);
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user._id) {
      throw new UserNotFoundException(dto.email);
    }

    const newEmail = email.toString();

    user.isVerified = true;
    await this.userRepository.update(user._id, user);
    return { email: newEmail, isVerified: true };
  }
}
