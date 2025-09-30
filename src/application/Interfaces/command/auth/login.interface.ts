// @application/interfaces/command/auth/login.interface.ts
import { LoginResponse } from "@application/dtos/login.dto.js";
import { LoginUserCommand } from "@application/commands/auth/login-user.command.js";
export interface ILogin {
  execute(command: LoginUserCommand): Promise<LoginResponse>;
}
