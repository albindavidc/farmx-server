import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { LoginRequest, LoginResponse } from "../../application/use-cases/dto/login.dto";
import { UserUseCase } from "../../application/use-cases/interfaces/user.use-case";
import sendResponseJson from "../../application/utils/Message";
import { User } from "../../domain/entities/user.entity";
import { AuthService } from "../../infrastructure/services/Auth.service";
import { LoginService } from "../../infrastructure/services/Login.service";
import { TYPES } from "../container/types";

@injectable()
export default class AuthController {
  constructor(
    @inject(TYPES.CreateUserUseCase) private createUserUseCase: UserUseCase,
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.LoginService) private loginService: LoginService
  ) {}

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, password } = req.body;

      if (!name || !email || !password || !phone) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "All fields are required", false);
        return;
      }

      const user = new User(name, email, password, role, phone);

      if (user.role === "farmer") {
        user.isFarmer = true;
      }

      console.log(user, "this is from the backend - to validate");

      const response = await this.createUserUseCase.execute(user);
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
      const request: LoginRequest = req.body;
      const response: LoginResponse = await this.loginService.login(request);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.cookie("accessToken", response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
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
        maxAge: 60 * 60 * 1000,
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
