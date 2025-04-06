import { UserUseCase } from "../../application/use-cases/interfaces/user.use-case";
import sendResponseJson from "../../application/utils/Message";
import { User } from "../../domain/entities/User.entity";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export default class AuthController {
  constructor(public createUserUseCase: UserUseCase) {}

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
