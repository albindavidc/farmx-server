import { UserUseCase } from "../../application/use-cases/interfaces/user.use-case";
import sendResponseJson from "../../application/utils/Message";
import { User } from "../../domain/entities/User.entity";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/Types";
import { AuthService } from "../../application/services/Auth.service";

@injectable()
export default class AuthController {
  constructor(
    @inject(TYPES.CreateUserCommand) private createUserUseCase: UserUseCase,
    @inject(TYPES.AuthService) private authService: AuthService
  ) {}

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, password } = req.body;

      if (!name || !email || !password || !phone) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "All fields are required", false);
        return;
      }

      const user = new User(name, email, password, role, phone);

      console.log(user, "this is from the backend - to validate");
      const response = await this.createUserUseCase.execute(user);

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

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(
        refreshToken
      );
      sendResponseJson(res, StatusCodes.OK, "Successfully created", true, {
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error while creating a new refresh token";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}
