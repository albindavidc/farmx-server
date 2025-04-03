import { User } from "../../domain/entities/user.entity";

export interface AuthTokenService {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
}
