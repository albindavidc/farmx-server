import { User } from "../../domain/entities/User.entity";

export interface AuthTokenService {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
}
