import { UserDto } from "./User.dto";

export interface RoleUpdateDto {
  userId: string;
  role: string;
}

export interface RoleResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}
