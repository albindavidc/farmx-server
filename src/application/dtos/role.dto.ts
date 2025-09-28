import { UserDto } from "@application/dtos/user.dto.js";

export interface RoleUpdateDto {
  userId: string;
  role: string;
}

export interface RoleResponseDto {
  user: Partial<UserDto>;
  accessToken: string;
  refreshToken: string;
}
