import { UserDto } from "@application/dtos/user.dto.js";

export interface OtpRequestDto {
  email: string;
  otp?: string;
}

export interface OtpResponseDto {
  email: string;
  otp?: string;
  isVerified: boolean;
  expiresAt?: Date;
  user: Partial<UserDto>;
  accessToken: string;
  refreshToken: string;
}
