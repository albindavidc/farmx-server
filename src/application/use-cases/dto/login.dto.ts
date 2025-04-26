import { User } from "../../../domain/entities/user.entity";

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
