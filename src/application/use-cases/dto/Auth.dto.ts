import { User } from "../../../domain/entities/User.entity";
import { UserDto } from "./User.dto";

export interface AuthResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthResponseDto {
  user: UserDto;
  isNewUser: boolean;
  accessToken?: string;
  refreshToken?: string;
}
