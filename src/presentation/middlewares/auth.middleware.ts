import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import sendResponseJson from "@application/utils/message.js";
import {
    generateAcessToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "@application/utils/token-utility.js";
import UserSchema, { IUserDocument } from "@infrastructure/database/schemas/user.schema.js";
import { RedisAuthService } from "@infrastructure/services/auth/redis-auth.service.js";

interface AuthRequest extends Request {
  user?: IUserDocument;
}

@injectable()
export class AuthMiddleware {
  constructor(@inject(TYPES.RedisAuthService) private redisAuthService: RedisAuthService) {}

  async authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    console.log("Cookies recieved", req.cookies);

    let accessToken = req.cookies.accessToken;
    if (!accessToken) {
      const authHeader = req.headers.authorization;
      accessToken = authHeader && authHeader.startsWith("Bearer") ? authHeader.split(" ")[1] : null;
    }

    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      const user = await UserSchema.findById(decoded?.id);

      //* ========== Validate Session ========== *//
      const sessionData = await this.redisAuthService.getSession(decoded?.id);
      if (!sessionData) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Session expired or invalid", false);
        return;
      }
      await this.redisAuthService.extendSession(decoded?.id);

      if (!user) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
        return;
      }
      req.user = user;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      sendResponseJson(
        res,
        StatusCodes.UNAUTHORIZED,
        "Authentication required - refresh token is unavailable",
        false
      );
      return;
    }

    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      if (!decodedRefresh) {
        throw new Error("Invalid or expired refresh token");
      }

      const newAccessToken = generateAcessToken({
        id: decodedRefresh.id,
        email: decodedRefresh.email,
        role: decodedRefresh.role,
      });

      console.log("New access Token generated", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });

      res.setHeader("X-Access-Token", newAccessToken);

      const user = await UserSchema.findById(decodedRefresh.id);
      if (!user) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "User not found", false);
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid refresh token";
      sendResponseJson(res, StatusCodes.FORBIDDEN, errorMessage, false);
      return;
    }
  }

  authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log("printing roles", req.user, req.user?.role);

      if (!req.user || !req.user.role) {
        sendResponseJson(res, StatusCodes.FORBIDDEN, "User not found", false);
        return;
      }

      if (!roles.includes(req.user.role)) {
        sendResponseJson(res, StatusCodes.FORBIDDEN, "Forbidden to enter here", false);
        return;
      }

      next();
    };
  }

  async rateLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || "unknown"; // Get the client's IP address from the request object
      const loginAttempts = await this.redisAuthService.checkLoginAttempts(clientIP);

      if (loginAttempts.isBlocked) {
        sendResponseJson(res, StatusCodes.TOO_MANY_REQUESTS, "Too many login attempts", false);
        return;
      }

      req.loginAttempts = loginAttempts;
      next();
    } catch (error) {
      console.log("Rate limiting error", error);
      next();
    }
  }
}
