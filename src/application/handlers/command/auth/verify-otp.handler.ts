import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types.js";
import { OtpResponseDto } from "@application/dtos/otp.dto.js";
import { InvalidOtpException } from "@application/exceptions/invalid-otp.exception.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { IOTPRepository } from "@domain/interfaces/otp-repository.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
} from "@application/utils/token-utility.js";
import { VerifyOtpCommand } from "@application/commands/auth/verify-otp.command.js";
import { IVerifyOtp } from "@application/interfaces/command/auth/verify-otp.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";

@injectable()
export class VerifyOtpHandler implements IVerifyOtp {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  public async execute(command: VerifyOtpCommand): Promise<OtpResponseDto> {
    const { dto } = command;

    if (!dto.email) throw new InvalidOtpException();

    const record = await this.otpRepository.findByEmail(dto.email);
    if (!record) throw new InvalidOtpException();
    await this.otpRepository.deleteByEmail(dto.email);

    const email = EmailVO.create(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.id) throw new UserNotFoundException(dto.email);

    user.isVerified = true;
    if (user.role === "farmer") user.isFarmer = true;

    const updatedUser = await this.userRepository.update(user.id, user);

    const userDto = UserMapper.toDto(updatedUser);
    const payload: TokenPayload = {
      id: updatedUser.id || "",
      email: updatedUser.email,
      role: updatedUser.role as "user" | "farmer" | "admin",
    };
    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      email: email.toString(),
      isVerified: true,
      user: userDto,
      accessToken,
      refreshToken,
    };
  }
}
