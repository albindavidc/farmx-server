import { Request, Response } from "express";
import { RegisterCommand } from "../../application/use-cases/commands/Signup.command";
import { VerifyOtpCommand } from "../../application/use-cases/commands/verify-otp.command";
import { CommandBus } from "../../application/interfaces/command-bus.interface";
import { RegisterRequest } from "../../application/use-cases/dto/auth/register.request";
import { UserMapper } from "../../application/use-cases/mappers/user.mapper";

export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  async register(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const registerRequest = new RegisterRequest(
        name,
        email,
        phone,
        password
      );

      const command = new RegisterCommand(
        registerRequest.name,
        registerRequest.email,
        registerRequest.phone,
        registerRequest.password
      );

      const user = await this.commandBus.execute(command);
      const response = UserMapper.toRegisterResponse(user);

      res.status(201).json(response);
    } catch (error) {
      res
        .status(400)
        .json({ error: (error as Error).message });
    }
  }

  async verifyOtp(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId, code } = req.body;
      const command = new VerifyOtpCommand(userId, code);
      const result = await this.commandBus.execute(command);

      res.status(200).json({ isValid: result });
    } catch (error) {
      res
        .status(400)
        .json({ error: (error as Error).message });
    }
  }
}
