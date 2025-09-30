// @application/handlers/auth/login.handler.ts
import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { LoginResponse } from "@application/dtos/login.dto.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { PasswordVO } from "@domain/value-objects/user/password.vo.js";
import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
} from "@application/utils/token-utility.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { ILogin } from "@application/interfaces/command/auth/login.interface";
import { LoginUserCommand } from "@application/commands/auth/login-user.command.js";

@injectable()
export class LoginHandler implements ILogin {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(command: LoginUserCommand): Promise<LoginResponse> {
    const { dto } = command;

    const email = EmailVO.create(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await PasswordVO.compare(dto.password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new Error("Account not verified");
    }

    if (user.isBlocked) {
      throw new Error(`Account is blocked. Reason: ${user.reason || "Contact support"}`);
    }

    if (!user.id) {
      throw new Error("User ID not found");
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role as "user" | "farmer" | "admin",
    };

    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userDto = UserMapper.toDto(user);

    return {
      user: userDto as UserDto,
      accessToken,
      refreshToken,
    };
  }
}
