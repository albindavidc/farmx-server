import { inject, injectable } from "inversify";
import { InvalidOtpException } from "../../../exceptions/InvalidOtp.exception";
import { UserNotFoundException } from "../../../exceptions/UserNotFound.exception";
import { TYPES } from "../../../../presentation/container/types";
import { OTPRepository } from "../../../../domain/repositories/otp.repository";
import { UserRepository } from "../../../../domain/repositories/user.repository";
import { Email } from "../../../../domain/value-objects/Email.vo";
import { OtpRequestDto, OtpResponseDto } from "../../../dto/Otp.dto";

@injectable()
export class VerifyOtpHandler {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: OTPRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  public async execute(dto: OtpRequestDto): Promise<OtpResponseDto> {
    const record = await this.otpRepository.findByEmail(dto.email);
    if (!record) {
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
    if (user.role === "farmer") {
      user.isFarmer = true;
    }

    await this.userRepository.update(user._id, user);
    return { email: newEmail, isVerified: true };
  }
}
