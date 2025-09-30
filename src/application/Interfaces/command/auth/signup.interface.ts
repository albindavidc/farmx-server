import { UserDto } from "@application/dtos/user.dto.js";
import { SignupUserCommand } from "@application/commands/auth/signup-user.command.js";

export interface ISignUp {
  execute(dto: SignupUserCommand): Promise<UserDto>;
}
