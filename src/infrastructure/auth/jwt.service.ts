import * as jwt from "jsonwebtoken";

import { AuthTokenService } from "../../application/interfaces/crypto.service";

export class JwtService implements AuthTokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: number
  ) {}

  generateToken(payload: {
    userId: string;
    roles: string[];
  }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token: string): {
    userId: string;
    roles: string[];
  } {
    return jwt.verify(token, this.secret) as {
      userId: string;
      roles: string[];
    };
  }
}
