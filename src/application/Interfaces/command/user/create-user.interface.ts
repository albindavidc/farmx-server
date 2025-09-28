import { CreateUserCommand } from "@application/commands/user/create-user.command.js";
import { UserDto } from "@application/dtos/user.dto.js";

export interface ICreateUser {
  execute(command: CreateUserCommand): Promise<UserDto>;
}
