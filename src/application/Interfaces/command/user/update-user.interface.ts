import { UpdateUserCommand } from "@application/commands/user/update-user.command.js";
import { UserDto } from "@application/dtos/user.dto.js";

export interface IUpdateUser {
  execute(command: UpdateUserCommand): Promise<UserDto | null>;
}
