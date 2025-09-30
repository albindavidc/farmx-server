import { UserDto } from "@application/dtos/user.dto.js";

export interface LoginRequest {
  email: string;
  password: string;
  verificationType: "email";
}

export interface LoginResponse {
  user: Partial<UserDto>;
  accessToken: string;
  refreshToken: string;
}
