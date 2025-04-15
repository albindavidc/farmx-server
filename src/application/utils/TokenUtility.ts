import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id?: string;
  email?: string;
  role: "user" | "farmer" | "admin";
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

export function generateAcessToken(payload: TokenPayload): string {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "1h" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "30d" });
}

class TokenVerificationError extends Error {
  constructor(public reason: "invalid" | "expired" | "malformed", message?: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export function verifyAccessToken(token: string): TokenPayload | null {
  if (!token) {
    throw new TokenVerificationError("invalid", "Token not provided");
  }
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenVerificationError("expired", "Token verification failed");
    }
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  if (!token) {
    throw new TokenVerificationError("invalid", "Token not provided");
  }
  try {
    return jwt.verify(token, refreshTokenSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenVerificationError("expired", "Token verification failed");
    }
    return null;
  }
}

export function decodeToken(token: string): string | JwtPayload | null {
  if (!token) {
    return null;
  }
  return jwt.decode(token);
}
