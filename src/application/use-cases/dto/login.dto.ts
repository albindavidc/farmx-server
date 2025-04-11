import { User } from "../../../domain/entities/User.entity";

export interface LoginRequest {
  email: string;
  password: string;
  verificationType: "email";
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
