import { UpdateUserCommand } from "@application/commands/user/update-user.command";
import { UserDto } from "@application/dtos/user.dto";

export interface IUpdateUser {
  execute(command: UpdateUserCommand): Promise<UserDto | null>;
}
