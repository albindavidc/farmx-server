import { BlockUserCommand } from "@application/commands/user/block-user.command";
import { UserDto } from "@application/dtos/user.dto";

export interface IBlockUser {
  execute(command: BlockUserCommand): Promise<UserDto | null>;
}
