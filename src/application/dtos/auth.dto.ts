import { UserDto } from "@application/dtos/user.dto.js";
import { User } from "@domain/entities/user.entity.js";

export interface AuthResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthResponseDto {
  user: Partial<UserDto>;
  isNewUser: boolean;
  accessToken?: string;
  refreshToken?: string;
}
