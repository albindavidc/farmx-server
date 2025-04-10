import { User } from "../../domain/entities/User.entity";
import { UserRepository } from "../../domain/interfaces/repositories/User.repository";
import {
  generateAcessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../utils/TokenUtility";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async verifyOtp(
    tempUserId: string,
    otp: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findById(tempUserId);
    if (!user || user.isVerified || !otp) throw new Error("Invalid or already verified user");

    user.isVerified = true;
    const updatedUser = await this.userRepository.update(tempUserId, user);

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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) throw new Error("Invalid refresh token");

    const newAccessToken = generateAcessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
