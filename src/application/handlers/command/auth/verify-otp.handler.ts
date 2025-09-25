import { OtpRequestDto, OtpResponseDto } from "@application/dtos/otp.dto";
import { InvalidOtpException } from "@application/exceptions/invalid-otp.exception";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception";
import { IOTPRepository } from "@domain/interfaces/otp-repository.interface";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { Email } from "@domain/value-objects/user/email.vo";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class VerifyOtpHandler {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
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
