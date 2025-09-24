import { CreateUserCommand } from "@application/commands/user/create-user.command";
import { UserDto } from "@application/dtos/user.dto";

export interface ICreateUser {
  execute(command: CreateUserCommand): Promise<UserDto>;
}
