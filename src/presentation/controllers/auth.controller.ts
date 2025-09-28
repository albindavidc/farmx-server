import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

import { TYPES } from "@presentation/container/types.js";
import { CreateUserCommand } from "@application/commands/user/create-user.command.js";
import { LoginRequest, LoginResponse } from "@application/dtos/login.dto.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { CreateUserHandler } from "@application/handlers/command/user/create-user.handler.js";
import sendResponseJson from "@application/utils/message.js";
import { AuthService } from "@infrastructure/services/auth/auth.service.js";
import { RedisAuthService } from "@infrastructure/services/auth/redis-auth.service.js";
import { LoginService } from "@infrastructure/services/login.service.js";

@injectable()
export default class AuthController {
  constructor(
    @inject(TYPES.CreateUserHandler) private createUserHander: CreateUserHandler,
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.LoginService) private loginService: LoginService,
    @inject(TYPES.RedisAuthService) private redisAuthService: RedisAuthService
  ) {}

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, password } = req.body;

      if (!name || !email || !password || !phone) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "All fields are required", false);
        return;
      }

      const dto: Partial<UserDto> = { name, email, password, role, phone };

      const command = new CreateUserCommand(dto);

      if (command.dto.role === "farmer") {
        command.dto.isFarmer = true;
      }

      console.log(command, "this is from the backend - to validate");

      const response: UserDto = await this.createUserHander.execute(command);

      console.log(response, "this is from the backend - to validate");

      const successMessage =
        role === "user"
          ? "User created successfully. Please verify your account"
          : role === "farmer"
          ? "Farmer created successfully. Please verify your account."
          : "Guest created successfully";

      sendResponseJson(res, StatusCodes.CREATED, successMessage, true, response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error creating user";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || "unknown";

      const loginAttempts = await this.redisAuthService.checkLoginAttempts(clientIP);
      if (loginAttempts.isBlocked) {
        sendResponseJson(res, StatusCodes.TOO_MANY_REQUESTS, "Too many login attempts", false);
        return;
      }

      const request: LoginRequest = req.body;
      const response: LoginResponse = await this.loginService.login(request);

      await this.redisAuthService.resetLoginAttempts(clientIP);

      /* Create session */
      const sessionData = {
        userId: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        isVerified: response.user.isVerified,

        userAgent: req.headers["user-agent"] as string,
        ipAddress: clientIP,
        createdAt: Date.now().toString(),
        lastActivity: Date.now().toString(),
      };

      if (response.user.id) {
        await this.redisAuthService.createSession(response.user.id, sessionData);
      }

      /* Store Refresh Token */
      if (response.refreshToken) {
        const decoded = jwt.verify(response.refreshToken, process.env.JWT_SECRET as string) as {
          tokenId: string;
        };
        const refreshTokenData = {
          userId: response.user.id,
          tokenId: decoded.tokenId,
          ipAddress: clientIP,
          userAgent: req.headers["user-agent"] as string,
          createdAt: Date.now().toString(),
          lastActivity: Date.now().toString(),
        };

        await this.redisAuthService.storeRefreshToken(decoded.tokenId, refreshTokenData);
      }

      /* Set cookies */
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE_DAYS as string),
        path: "/",
      });

      res.cookie("accessToken", response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE_DAYS as string),
        path: "/",
      });

      sendResponseJson(res, StatusCodes.OK, "You have successfully logged in", true, response.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error logging In";

      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Refresh token is required", false);
        return;
      }

      const newAccessToken = await AuthService.refreshToken(refreshToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE_DAYS as string),
        path: "/",
      });

      res.setHeader("X-Access-Token", newAccessToken);

      console.log("new accesstoken has been created and send to the front-end", newAccessToken);

      sendResponseJson(res, StatusCodes.OK, "Successfully created", true, {
        accessToken: newAccessToken,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error while creating a new refresh token";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Not authenticated", false);
      return;
    }

    const user = {
      id: req.user._id.toString(),
      email: req.user.email,
      name: req.user.name,
      password: "",
      phone: req.user.phone,
      role: req.user.role,
      isVerified: req.user.isVerified,
    };
    sendResponseJson(res, StatusCodes.OK, "User Featched", true, user);
    return;
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      sendResponseJson(res, StatusCodes.OK, "Logout Successful", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}
