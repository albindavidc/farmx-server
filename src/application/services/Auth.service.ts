import { inject, injectable } from "inversify";
import { User } from "../../domain/entities/User.entity";
import { UserRepository } from "../../domain/interfaces/repositories/User.repository";
import { Email } from "../../domain/value-objects/Email.vo";
import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../utils/TokenUtility";
import { TYPES } from "../../presentation/container/Types";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async verifyOtp(
    email: Email
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user._id) throw new Error("Invalid or already verified user");

    user.isVerified = true;
    const updatedUser = await this.userRepository.update(user._id, user);

    if (!updatedUser || !updatedUser._id) {
      throw new Error("User not found");
    }
    const payload: TokenPayload = {
      id: updatedUser?._id,
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
