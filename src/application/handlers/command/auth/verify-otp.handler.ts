import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { OtpRequestDto, OtpResponseDto } from "@application/dtos/otp.dto.js";
import { InvalidOtpException } from "@application/exceptions/invalid-otp.exception.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { IOTPRepository } from "@domain/interfaces/otp-repository.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";

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
    const email = EmailVO.create(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.id) {
      throw new UserNotFoundException(dto.email);
    }

    const newEmail = email.toString();

    user.isVerified = true;
    if (user.role === "farmer") {
      user.isFarmer = true;
    }

    await this.userRepository.update(user.id, user);
    return { email: newEmail, isVerified: true };
  }
}
