import { User } from "../../../domain/entities/User.entity";

export interface AuthResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthResponseDto {
  user: User;
  isNewUser: boolean;
  accessToken?: string;
  refreshToken?: string;
}
