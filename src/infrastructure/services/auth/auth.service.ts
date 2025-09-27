import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "@application/utils/token-utility";
import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { EmailVO } from "@domain/value-objects/user/email.vo";
import { inject, injectable } from "inversify";
import {TYPES} from "@presentation/container/types";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async verifyOtp(
    email: EmailVO
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.id) throw new Error("Invalid or already verified user");

    user.verifyUser();
    const updatedUser = await this.userRepository.update(user.id, user);

    if (!updatedUser || !updatedUser.id) {
      throw new Error("User not found");
    }
    const payload: TokenPayload = {
      id: updatedUser?.id,
      email: updatedUser?.email,
      role: updatedUser?.role[0] as "user" | "farmer" | "admin",
    };

    if (!updatedUser) {
      throw new Error("Failed to update user verification status");
    }

    const accessToken = generateAcessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user: updatedUser, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string): Promise<string> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) throw new Error("Invalid refresh token");

    const newPayload: TokenPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    const newAccessToken = generateAcessToken(newPayload);

    return newAccessToken;
  }
}
