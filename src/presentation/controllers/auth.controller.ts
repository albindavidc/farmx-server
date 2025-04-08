import { UserUseCase } from "../../application/use-cases/interfaces/user.use-case";
import sendResponseJson from "../../application/utils/Message";
import { User } from "../../domain/entities/User.entity";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/Types";

@injectable()
export default class AuthController {
  constructor(
    @inject(TYPES.CreateUser) private createUserUseCase: UserUseCase
  ) {}

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        sendResponseJson(
          res,
          StatusCodes.BAD_REQUEST,
          "All fields are required",
          false
        );
        return;
      }

      const user = new User(name, email, password, role);
      await user.hashPassword();

      const response = await this.createUserUseCase.execute(user);

      // // Optionally issue tokens upon signup (if part of your workflow)
      // const { accessToken, refreshToken } = await this.loginUserUseCase.execute(email, password); // Assume LoginUser returns tokens
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   path: "/refresh",
      //   sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      //   secure: process.env.NODE_ENV === "production",
      //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      // });
      // res.setHeader("Authorization", `Bearer ${accessToken}`);

      // const messageRole = (role: string): string => {
      //   if (role === "student") {
      //     return "Student created successfully. Please verify your account.";
      //   } else if (role === "tutor") {
      //     return "Tutor created successfully. Please verify your account.";
      //   } else {
      //     return "User created successfully.";
      //   }
      // };

      // sendResponseJson(
      //   res,
      //   HttpStatus.CREATED,
      //   messageRole(role),
      //   true,
      //   { user: response, jwt_token: accessToken }
      // );

      const successMessage =
        role === "user"
          ? "User created successfully. Please verify your account"
          : role === "farmer"
          ? "Farmer created successfully. Please verify your account."
          : "Guest created successfully";

      sendResponseJson(
        res,
        StatusCodes.CREATED,
        successMessage,
        true,
        response
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating user";

      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        false
      );
    }
  }
}
